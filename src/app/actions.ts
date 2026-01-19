"use server"

import OpenAI from "openai"
import { COMPANIES, WISH_TYPES } from "@/lib/mock-data"

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
  lucky_poem: string
  financial_insight: string
}

export async function generateFortune(data: FortuneRequest): Promise<FortuneResponse> {
  const { name, company, wishId } = data
  const wish = WISH_TYPES.find((w) => w.id === wishId)?.label || "暴富"

  // 1. Check for API Key
  if (!process.env.OPENAI_API_KEY) {
    console.log("No OpenAI API Key found. Using Mock response.")
    return generateMockResponse(name, company, wish)
  }

  // 2. Call OpenAI
  try {
    const prompt = `
    角色：你是一个精通价值投资与中国传统命理的 AI 算命师。
    任务：根据用户选择的 [心愿类型] 和 [目标公司]，生成一段运势。
    用户姓名：${name}
    目标公司：${company}
    心愿类型：${wish}

    请输出 JSON 格式：
    {
      "lucky_poem": "四句七言绝句，必须押韵，通俗易懂，侧重'我'的收获。",
      "financial_insight": "格式：金钥AI预测：基于该司[真实/模拟的财务亮点]，预示着[用户的利益]将[正向结果]。"
    }
    `

    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: process.env.OPENAI_MODEL || "gpt-4o",
      response_format: { type: "json_object" },
    })

    const content = completion.choices[0].message.content
    if (!content) throw new Error("No content from OpenAI")
    
    return JSON.parse(content) as FortuneResponse
  } catch (error) {
    console.error("OpenAI Error:", error)
    return generateMockResponse(name, company, wish)
  }
}

function generateMockResponse(name: string, companyName: string, wish: string): FortuneResponse {
  // Find company mock data
  const companyData = COMPANIES.find(c => c.name.includes(companyName) || c.ticker === companyName)
  const highlights = companyData ? companyData.highlights.join("、") : "行业前景广阔、基本面稳健"
  
  // Simple deterministic mock based on string length to vary it slightly
  const poems = [
    "运筹帷幄胜千里，财源滚滚达三江。金钥开启致富门，从容笑看日方长。",
    "职场风云凭我跃，步步高升展宏图。贵人相助行大运，前程似锦且无忧。",
    "业绩长虹冲云霄，客户盈门喜眉梢。天时地利人和聚，功成名就乐逍遥。",
    "稳扎稳打基业固，风控严密心不惊。穿越周期见真章，岁岁平安福满盈。"
  ]
  
  const poemIndex = Math.floor(Math.random() * poems.length)

  return {
    lucky_poem: poems[poemIndex],
    financial_insight: `金钥AI预测：监测到${companyName}具有[${highlights}]等特征，预示着${name}在2026年将如鱼得水，${wish}心愿达成，收益显著。`
  }
}
