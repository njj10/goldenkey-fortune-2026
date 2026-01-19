"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { COMPANIES, WISH_TYPES } from "@/lib/mock-data"
import { SCENARIOS } from "@/lib/constants/scenarios"
import { generateFortune } from "@/app/actions"
import { cn } from "@/lib/utils"
import { Rocket, Coins, Award, Shield, Search, Loader2, Download, RotateCcw } from "lucide-react"
import html2canvas from "html2canvas"

// Icon map
const Icons = {
  Bull: Coins, // Using Coins as proxy for Bull/Wealth
  Rocket: Rocket,
  Qilin: Award, // Using Award for Sales/Success
  "Mount Tai": Shield, // Using Shield for Safety
}

type Step = "landing" | "input" | "loading" | "result"

interface FortuneResult {
  big_character?: string
  lucky_poem: string
  financial_insight: string
}

// Color styles map for Tailwind safelist
const COLOR_STYLES: Record<string, string> = {
  red: "border-red-500 bg-red-950/30 text-red-500",
  blue: "border-blue-500 bg-blue-950/30 text-blue-500",
  purple: "border-purple-500 bg-purple-950/30 text-purple-500",
  green: "border-green-500 bg-green-950/30 text-green-500",
}

export default function MainFlow() {
  const [step, setStep] = useState<Step>("landing")
  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [wish, setWish] = useState<string>(WISH_TYPES[0].id)
  const [suggestions, setSuggestions] = useState<typeof COMPANIES>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [result, setResult] = useState<FortuneResult | null>(null)
  const [loadingText, setLoadingText] = useState("正在连接财神...")
  const [collectionCount, setCollectionCount] = useState(0)
  const [showUnlockDialog, setShowUnlockDialog] = useState(false)
  
  const resultRef = useRef<HTMLDivElement>(null)

  // Load collection count
  useEffect(() => {
    const count = parseInt(localStorage.getItem("fortune_collection_count") || "0")
    setCollectionCount(count)
  }, [])

  // Autocomplete logic
  useEffect(() => {
    if (company.length > 0) {
      const filtered = COMPANIES.filter(c => 
        c.name.toLowerCase().includes(company.toLowerCase()) || 
        c.ticker.toLowerCase().includes(company.toLowerCase())
      )
      setSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }, [company])

  // Loading animation logic
  useEffect(() => {
    if (step === "loading") {
      const texts = [
        "正在分析财报数据...",
        "正在链接财神...",
        "正在计算ROE...",
        "正在观测K线...",
        "正在查阅周易..."
      ]
      let i = 0
      const interval = setInterval(() => {
        setLoadingText(texts[i % texts.length])
        i++
      }, 600)
      return () => clearInterval(interval)
    }
  }, [step])

  const handleStart = () => {
    setStep("input")
  }

  const handleSubmit = async () => {
    if (!name || !company) return // Simple validation
    
    setStep("loading")
    
    // Simulate min loading time for effect
    const minTimePromise = new Promise(resolve => setTimeout(resolve, 2500))
    const apiPromise = generateFortune({ name, company, wishId: wish })
    
    const [_, res] = await Promise.all([minTimePromise, apiPromise])
    
    setResult(res)
    setStep("result")
    
    // Update collection
    const newCount = collectionCount + 1
    setCollectionCount(newCount)
    localStorage.setItem("fortune_collection_count", newCount.toString())
    
    if (newCount === 3) {
      setTimeout(() => setShowUnlockDialog(true), 1000)
    }
  }

  const handleDownload = async () => {
    if (!resultRef.current) return
    try {
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: null,
        scale: 2
      })
      const url = canvas.toDataURL("image/png")
      const a = document.createElement("a")
      a.href = url
      a.download = `金钥开运2026_${name}.png`
      a.click()
    } catch (err) {
      console.error("Download failed", err)
    }
  }

  const handleReset = () => {
    setStep("input")
    setResult(null)
    setCompany("")
    // Keep name maybe?
  }

  return (
    <div className="w-full max-w-md mx-auto min-h-[600px] relative overflow-hidden">
      <AnimatePresence mode="wait">
        
        {/* LANDING */}
        {step === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center justify-center h-[80vh] text-center space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-primary font-serif drop-shadow-sm">
                金钥开运·2026
              </h1>
              <p className="text-foreground/80 text-lg">
                懂财报的 AI 运势签
              </p>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg" 
                onClick={handleStart}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg px-8 py-6 rounded-full shadow-[0_0_15px_rgba(251,192,45,0.5)] border border-yellow-300/50"
              >
                测测我的 2026 运势
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* INPUT */}
        {step === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex flex-col h-full pt-10 space-y-6 px-4"
          >
            <div className="space-y-2">
              <h2 className="text-2xl font-serif font-bold text-primary">
                请赐名号
              </h2>
              <Input 
                placeholder="输入你的姓名 (如: 股神老王)" 
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={4}
                className="bg-card/80 border-border text-lg py-6 placeholder:text-muted-foreground/50 text-foreground"
              />
            </div>

            <div className="space-y-2 relative">
              <h2 className="text-2xl font-serif font-bold text-primary">
                心之所向
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="输入目标公司 (如: 腾讯)" 
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  className="pl-10 bg-card/80 border-border text-lg py-6 placeholder:text-muted-foreground/50 text-foreground"
                />
              </div>
              
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-popover border border-border rounded-md mt-1 max-h-40 overflow-y-auto shadow-xl">
                  {suggestions.map(s => (
                    <div 
                      key={s.ticker}
                      className="px-4 py-2 hover:bg-muted cursor-pointer text-sm text-foreground"
                      onClick={() => {
                        setCompany(s.name)
                        setShowSuggestions(false)
                      }}
                    >
                      {s.name} <span className="text-muted-foreground text-xs">({s.ticker})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-serif font-bold text-primary">
                所求何事
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {WISH_TYPES.map(w => {
                  const Icon = Icons[w.icon as keyof typeof Icons]
                  const isSelected = wish === w.id
                  return (
                    <div
                      key={w.id}
                      onClick={() => setWish(w.id)}
                      className={cn(
                        "cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 flex flex-col items-center justify-center gap-2",
                        isSelected 
                          ? COLOR_STYLES[w.color] 
                          : "border-border bg-card/50 text-muted-foreground hover:border-primary/50"
                      )}
                    >
                      <Icon className="h-8 w-8" />
                      <span className="font-bold">{w.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold text-lg py-6 mt-8 shadow-lg shadow-orange-900/20"
              onClick={handleSubmit}
              disabled={!name || !company}
            >
              生成 2026 运势
            </Button>
          </motion.div>
        )}

        {/* LOADING */}
        {step === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-[60vh] text-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full animate-pulse" />
              <Loader2 className="h-16 w-16 text-primary animate-spin relative z-10" />
            </div>
            <motion.p 
              key={loadingText}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-xl text-primary font-serif"
            >
              {loadingText}
            </motion.p>
          </motion.div>
        )}

        {/* RESULT */}
        {step === "result" && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center pt-6 px-4 space-y-6"
          >
            <div ref={resultRef} className="w-full bg-card p-4 rounded-xl border-2 border-primary/30 shadow-2xl relative overflow-hidden">
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl" />
              
              {/* Corner Ornaments (CSS based simple corners) */}
              <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-primary/50 rounded-tl-lg" />
              <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-primary/50 rounded-tr-lg" />
              <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-primary/50 rounded-bl-lg" />
              <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-primary/50 rounded-br-lg" />

              <div className="border border-primary/20 rounded-lg p-6 flex flex-col items-center text-center space-y-6 bg-card/80 backdrop-blur-sm">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm tracking-widest uppercase">
                    {SCENARIOS[(Object.keys(SCENARIOS).find(k => (SCENARIOS as any)[k].id === wish) as keyof typeof SCENARIOS) || "WEALTH"].header}
                  </p>
                  <h2 className="text-3xl font-serif font-bold text-primary">{name} · 运势签</h2>
                  <p className="text-muted-foreground text-xs">目标：{company} | 心愿：{WISH_TYPES.find(w => w.id === wish)?.label}</p>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                {result.big_character && (
                  <div className="flex items-center justify-center py-1">
                    <div className={cn(
                      "h-20 w-20 rounded-lg flex items-center justify-center border-2 text-4xl font-bold shadow-inner transform rotate-3", 
                      "bg-red-800/20 border-red-500/50 text-red-500" // Always use red vibe for the stamp
                    )}>
                      {result.big_character}
                    </div>
                  </div>
                )}

                <div className="space-y-3 py-2">
                  {result.lucky_poem.split(/\\r|\\n|\r|\n|，|。/).filter(Boolean).map((line, i) => (
                    <p key={i} className="text-xl font-serif text-foreground tracking-[0.2em] font-medium">
                      {line}
                    </p>
                  ))}
                </div>

                <div className="w-full bg-secondary/30 rounded-lg p-4 text-left border border-primary/10">
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    <span className="text-primary font-bold mr-1 text-lg">✦</span>
                    {result.financial_insight}
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between w-full border-t border-primary/10 mt-2">
                  <div className="text-left">
                    <p className="text-[10px] text-muted-foreground">GoldenKey AI</p>
                    <p className="text-[10px] text-muted-foreground">Fortune 2026</p>
                  </div>
                  <div className="h-8 w-8 rounded bg-red-800/20 flex items-center justify-center border border-red-500/50">
                    <span className="text-red-500 text-xs font-bold">吉</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex w-full gap-3">
              <Button 
                variant="outline" 
                className="flex-1 border-primary/30 text-primary hover:bg-primary/10 hover:text-primary"
                onClick={handleReset}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                再测一次
              </Button>
              <Button 
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                onClick={handleDownload}
              >
                <Download className="mr-2 h-4 w-4" />
                保存签文
              </Button>
            </div>

            <div className="w-full bg-secondary rounded-full h-2 mt-4 overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-500" 
                style={{ width: `${Math.min(collectionCount, 3) / 3 * 100}%` }} 
              />
            </div>
            <p className="text-xs text-muted-foreground">
              已收集 {Math.min(collectionCount, 3)}/3 张运势卡 {collectionCount >= 3 ? "(已解锁指南)" : "(集齐解锁行业避坑指南)"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unlock Dialog */}
      <Dialog open={showUnlockDialog} onOpenChange={setShowUnlockDialog}>
        <DialogContent className="bg-card border-primary/30 text-foreground">
          <DialogHeader>
            <DialogTitle className="text-primary text-xl">🎉 恭喜集齐 3 张运势卡！</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              您的 2026 运势已加持。作为奖励，为您解锁独家避坑指南。
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-secondary/50 p-4 rounded-lg flex items-center gap-4 border border-primary/20">
              <div className="bg-red-900/30 p-2 rounded text-red-500">
                <Shield className="h-8 w-8" />
              </div>
              <div>
                <h4 className="font-bold text-foreground">2026 热门行业避坑指南</h4>
                <p className="text-xs text-muted-foreground">PDF • 2.4 MB</p>
              </div>
            </div>
          </div>
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
            立即下载
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
