"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { COMPANIES, WISH_TYPES } from "@/lib/mock-data"
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
              <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-yellow-500 font-serif drop-shadow-sm">
                金钥开运·2026
              </h1>
              <p className="text-muted-foreground text-lg">
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
                className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold text-lg px-8 py-6 rounded-full shadow-[0_0_15px_rgba(202,138,4,0.5)]"
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
              <h2 className="text-2xl font-serif font-bold text-yellow-500">
                请赐名号
              </h2>
              <Input 
                placeholder="输入你的姓名 (如: 股神老王)" 
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={4}
                className="bg-zinc-900 border-zinc-700 text-lg py-6"
              />
            </div>

            <div className="space-y-2 relative">
              <h2 className="text-2xl font-serif font-bold text-yellow-500">
                心之所向
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="输入目标公司 (如: 腾讯)" 
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  onFocus={() => setShowSuggestions(true)}
                  className="pl-10 bg-zinc-900 border-zinc-700 text-lg py-6"
                />
              </div>
              
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-zinc-900 border border-zinc-700 rounded-md mt-1 max-h-40 overflow-y-auto shadow-xl">
                  {suggestions.map(s => (
                    <div 
                      key={s.ticker}
                      className="px-4 py-2 hover:bg-zinc-800 cursor-pointer text-sm text-zinc-300"
                      onClick={() => {
                        setCompany(s.name)
                        setShowSuggestions(false)
                      }}
                    >
                      {s.name} <span className="text-zinc-500 text-xs">({s.ticker})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-serif font-bold text-yellow-500">
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
                          : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-600"
                      )}
                      style={{
                        // Fallback purely for visualization if classes fail, though map handles it
                      }}
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
              className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold text-lg py-6 mt-8"
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
              <Loader2 className="h-16 w-16 text-yellow-500 animate-spin relative z-10" />
            </div>
            <motion.p 
              key={loadingText}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-xl text-yellow-200 font-serif"
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
            <div ref={resultRef} className="w-full bg-zinc-950 p-4 rounded-xl border border-yellow-900/50 shadow-2xl relative overflow-hidden">
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl" />
              
              <div className="border border-yellow-700/30 rounded-lg p-6 flex flex-col items-center text-center space-y-6 bg-zinc-900/80 backdrop-blur-sm">
                <div className="space-y-1">
                  <p className="text-zinc-400 text-sm">2026 丙午年</p>
                  <h2 className="text-3xl font-serif font-bold text-yellow-500">{name} · 运势签</h2>
                  <p className="text-zinc-500 text-xs">目标：{company} | 心愿：{WISH_TYPES.find(w => w.id === wish)?.label}</p>
                </div>

                <div className="w-full h-px bg-gradient-to-r from-transparent via-yellow-800 to-transparent" />

                <div className="space-y-2 py-2">
                  {result.lucky_poem.split(/，|。/).filter(Boolean).map((line, i) => (
                    <p key={i} className="text-xl font-serif text-zinc-100 tracking-widest">
                      {line}
                    </p>
                  ))}
                </div>

                <div className="w-full bg-zinc-950/50 rounded-lg p-4 text-left border border-zinc-800">
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    <span className="text-yellow-600 font-bold mr-1">✦</span>
                    {result.financial_insight}
                  </p>
                </div>

                <div className="pt-4 flex items-center justify-between w-full">
                  <div className="text-left">
                    <p className="text-[10px] text-zinc-600">GoldenKey AI</p>
                    <p className="text-[10px] text-zinc-600">Fortune 2026</p>
                  </div>
                  <div className="h-8 w-8 rounded bg-yellow-900/20 flex items-center justify-center border border-yellow-900/50">
                    <span className="text-yellow-700 text-xs font-bold">吉</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex w-full gap-3">
              <Button 
                variant="outline" 
                className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                onClick={handleReset}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                再测一次
              </Button>
              <Button 
                className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white"
                onClick={handleDownload}
              >
                <Download className="mr-2 h-4 w-4" />
                保存签文
              </Button>
            </div>

            <div className="w-full bg-zinc-900 rounded-full h-2 mt-4 overflow-hidden">
              <div 
                className="bg-yellow-600 h-full transition-all duration-500" 
                style={{ width: `${Math.min(collectionCount, 3) / 3 * 100}%` }} 
              />
            </div>
            <p className="text-xs text-zinc-500">
              已收集 {Math.min(collectionCount, 3)}/3 张运势卡 {collectionCount >= 3 ? "(已解锁指南)" : "(集齐解锁行业避坑指南)"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unlock Dialog */}
      <Dialog open={showUnlockDialog} onOpenChange={setShowUnlockDialog}>
        <DialogContent className="bg-zinc-900 border-yellow-600/30 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-yellow-500 text-xl">🎉 恭喜集齐 3 张运势卡！</DialogTitle>
            <DialogDescription className="text-zinc-400">
              您的 2026 运势已加持。作为奖励，为您解锁独家避坑指南。
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-zinc-800 p-4 rounded-lg flex items-center gap-4 border border-zinc-700">
              <div className="bg-red-900/30 p-2 rounded text-red-500">
                <Shield className="h-8 w-8" />
              </div>
              <div>
                <h4 className="font-bold text-zinc-200">2026 热门行业避坑指南</h4>
                <p className="text-xs text-zinc-500">PDF • 2.4 MB</p>
              </div>
            </div>
          </div>
          <Button className="w-full bg-yellow-600 hover:bg-yellow-500 text-white">
            立即下载
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}
