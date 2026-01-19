"use server"

import OpenAI from "openai"
import { COMPANIES, WISH_TYPES } from "@/lib/mock-data"
import { SCENARIOS } from "@/lib/constants/scenarios"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy",
  baseURL: process.env.OPENAI_BASE_URL,
})

interface FortuneRequest {
  name: string
  company: string
  wishId: string
}

interface FortuneResponse {
  big_character: string
  lucky_poem: string
  financial_insight: string
}

export async function generateFortune(data: FortuneRequest): Promise<FortuneResponse> {
  const { name, company, wishId } = data
  const wish = WISH_TYPES.find((w) => w.id === wishId)?.label || "暴富"
  const scenarioEntry = Object.entries(SCENARIOS).find(([_, v]) => v.id === wishId)?.[1]
  const scenarioKey = scenarioEntry ? (Object.keys(SCENARIOS).find(k => (SCENARIOS as any)[k].id === wishId) as keyof typeof SCENARIOS) : "WEALTH"
  const allowedChars: ReadonlyArray<string> = scenarioEntry?.keywords ?? ["吉"]

  // 1. Check for API Key
  if (!process.env.OPENAI_API_KEY) {
    console.log("No OpenAI API Key found. Using Mock response.")
    return generateMockResponse(name, company, wishId, allowedChars)
  }

  // 2. Call OpenAI
  try {
    const companyData = COMPANIES.find(c => c.name.includes(company) || c.ticker === company)
    const financialData = companyData ? companyData.highlights.join("、") : "行业前景广阔、基本面稳健、现金流良好"
    const scenarioId = wishId as "wealth" | "career" | "sales" | "safety"
    const patterns: Record<typeof scenarioId, string> = {
      wealth: "💡 金钥 AI 预判：监测到该司[Net Profit/Growth Data]，预示着你的持仓收益将[Positive Result]！",
      career: "🚀 金钥 AI 透视：监测到该司[R&D/Expansion Data]，预示着核心岗位极度缺人，你的机会来了！",
      sales: "🏆 金钥 AI 助攻：监测到该司[Operating Cash Flow Data]，预示着合作必成，回款毫无压力！",
      safety: "🛡️ 金钥 AI 认证：监测到该司[Cash Reserves/Assets Data]，预示着这是你职场最坚固的避风港！",
    }
    const scenarioTemplates: Record<typeof scenarioId, string[]> = {
      wealth: [
        "K线直冲九重天，分红入账笑开颜。马年账户红似火，躺赚收益稳连绵。",
        "牛势昂扬财源涌，回购分红喜相逢。账户长红心不慌，被动收益自从容。",
      ],
      career: [
        "才华横溢逢伯乐，核心岗位等你择。薪资翻倍职级涨，青云直上不止步。",
        "简历如金名声立，高薪邀约不停歇。领导赏识重器用，步步高升入巅巅。",
      ],
      sales: [
        "千单落笔不拖延，签约成功捷报传。回款迅速如闪电，业绩长虹挂云天。",
        "拜访以诚客户赞，流程顺畅签约安。订单爆发连不断，回款稳稳心不慌。",
      ],
      safety: [
        "任凭风浪起云涌，现金储备护我躬。根基厚重心自定，岁岁平安稳如松。",
        "避风良港现金足，裁员风雨不惊惧。稳字当头步不乱，安然前行皆坦途。",
      ],
    }
    const formatInsight = (id: typeof scenarioId, highlightsText: string) => {
      return patterns[id]
        .replace("[Net Profit/Growth Data]", highlightsText)
        .replace("[R&D/Expansion Data]", highlightsText)
        .replace("[Operating Cash Flow Data]", highlightsText)
        .replace("[Cash Reserves/Assets Data]", highlightsText)
        .replace("[Positive Result]", "显著提升")
    }
    const scenarioRules = `
# SCENARIO RULES

## A. WEALTH (我要暴富)
- Vibe: Stock market, dividends, passive income.
- Allowed Big Characters: 涨, 牛, 红, 翻
- Insight Pattern: "💡 金钥 AI 预判：监测到该司[Net Profit/Growth Data]，预示着你的持仓收益将[Positive Result]！"
- Poem Style Example:
  "K线直冲九重天，分红拿到手抽筋。
   马年账户红似火，躺着也把钱赚尽。"

## B. CAREER (我要高升)
- Vibe: Promotion, job hunting, appreciation by boss.
- Allowed Big Characters: 升, 高, 聘, 稳
- Insight Pattern: "🚀 金钥 AI 透视：监测到该司[R&D/Expansion Data]，预示着核心岗位极度缺人，你的机会来了！"
- Poem Style Example:
  "才华横溢遇伯乐，核心岗位任你挑。
   薪资翻倍职级涨，步步高升冲云霄。"

## C. SALES (我要长虹)
- Vibe: Closing deals, signing contracts, fast payment.
- Allowed Big Characters: 爆, 赢, 签, 成
- Insight Pattern: "🏆 金钥 AI 助攻：监测到该司[Operating Cash Flow Data]，预示着合作必成，回款毫无压力！"
- Poem Style Example:
  "千万大单落笔头，业绩销冠独占鳌。
   回款迅速如闪电，老板要把红包掏。"

## D. SAFETY (我要稳赢)
- Vibe: Stability, safety, cash reserves, lay-off proof.
- Allowed Big Characters: 泰, 定, 磐, 安
- Insight Pattern: "🛡️ 金钥 AI 认证：监测到该司[Cash Reserves/Assets Data]，预示着这是你职场最坚固的避风港！"
- Poem Style Example:
  "任凭风浪起高楼，稳坐钓鱼不知愁。
   现金充沛根基厚，安心搞钱到白头。"
`
    const prompt = `
Role: You are an expert Fortune Teller specializing in Financial Reports and Chinese Metaphysics.
Task: Generate a fortune result based on User Input and Scenario Type.

Inputs:
1. User Name: ${name}
2. Company: ${company}
3. Scenario Type: ${String(scenarioKey)}
4. Company Data Highlights: ${financialData}

Output Format (JSON):
{
  "big_character": "One single Chinese character chosen randomly from the allowed list for this scenario.",
  "lucky_poem": "A 4-line poem (7 chars each). Must rhyme. Must match the scenario vibe.",
  "financial_insight": "A structured insight string starting with the specific emoji and prefix."
}

${scenarioRules}
`

    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: process.env.OPENAI_MODEL || "gpt-4o",
      response_format: { type: "json_object" },
    })

    const content = completion.choices[0].message.content
    if (!content) throw new Error("No content from OpenAI")
    
    const parsed = JSON.parse(content) as FortuneResponse
    // Enforce SCENARIO RULES via post-processing
    const ensuredBig =
      allowedChars.includes(parsed.big_character)
        ? parsed.big_character
        : allowedChars[Math.floor(Math.random() * allowedChars.length)]
    // Validate poem: ensure 4 lines
    const lines = parsed.lucky_poem
      .split(/\r|\n|\\n|，|。/)
      .map(s => s.trim().replace(/\\n|\r/g, ""))
      .filter(Boolean)
    const poem =
      lines.length === 4
        ? lines.join("。")
        : scenarioTemplates[scenarioId][Math.floor(Math.random() * scenarioTemplates[scenarioId].length)]
    const insight = formatInsight(scenarioId, financialData)
    return {
      big_character: ensuredBig,
      lucky_poem: poem,
      financial_insight: insight,
    }
  } catch (error) {
    console.error("OpenAI Error:", error)
    return generateMockResponse(name, company, wishId, allowedChars)
  }
}

function generateMockResponse(name: string, companyName: string, wishId: string, allowedChars: ReadonlyArray<string>): FortuneResponse {
  // Find company mock data
  const companyData = COMPANIES.find(c => c.name.includes(companyName) || c.ticker === companyName)
  const highlights = companyData ? companyData.highlights.join("、") : "行业前景广阔、基本面稳健"
  
  // Simple deterministic mock based on string length to vary it slightly
  const scenarioId = wishId as "wealth" | "career" | "sales" | "safety"
  const templates: Record<typeof scenarioId, string[]> = {
    wealth: [
      "K线直冲九重天，分红入账笑开颜。马年账户红似火，躺赚收益稳连绵。",
      "牛势昂扬财源涌，回购分红喜相逢。账户长红心不慌，被动收益自从容。",
    ],
    career: [
      "才华横溢逢伯乐，核心岗位等你择。薪资翻倍职级涨，青云直上不止步。",
      "简历如金名声立，高薪邀约不停歇。领导赏识重器用，步步高升入巅巅。",
    ],
    sales: [
      "千单落笔不拖延，签约成功捷报传。回款迅速如闪电，业绩长虹挂云天。",
      "拜访以诚客户赞，流程顺畅签约安。订单爆发连不断，回款稳稳心不慌。",
    ],
    safety: [
      "任凭风浪起云涌，现金储备护我躬。根基厚重心自定，岁岁平安稳如松。",
      "避风良港现金足，裁员风雨不惊惧。稳字当头步不乱，安然前行皆坦途。",
    ],
  }
  
  const poem = templates[scenarioId][Math.floor(Math.random() * templates[scenarioId].length)]
  const bigChar = allowedChars[Math.floor(Math.random() * allowedChars.length)]
  const patterns: Record<typeof scenarioId, string> = {
    wealth: "💡 金钥 AI 预判：监测到该司[Net Profit/Growth Data]，预示着你的持仓收益将[Positive Result]！",
    career: "🚀 金钥 AI 透视：监测到该司[R&D/Expansion Data]，预示着核心岗位极度缺人，你的机会来了！",
    sales: "🏆 金钥 AI 助攻：监测到该司[Operating Cash Flow Data]，预示着合作必成，回款毫无压力！",
    safety: "🛡️ 金钥 AI 认证：监测到该司[Cash Reserves/Assets Data]，预示着这是你职场最坚固的避风港！",
  }

  return {
    big_character: bigChar,
    lucky_poem: poem,
    financial_insight: `${patterns[wishId as "wealth" | "career" | "sales" | "safety"]}`.replace("[Net Profit/Growth Data]", highlights).replace("[R&D/Expansion Data]", highlights).replace("[Operating Cash Flow Data]", highlights).replace("[Cash Reserves/Assets Data]", highlights).replace("[Positive Result]", "显著提升")
  }
}
