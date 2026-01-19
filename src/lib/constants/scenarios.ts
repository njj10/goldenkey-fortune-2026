export const SCENARIOS = {
  WEALTH: {
    id: "wealth",
    label: "我要暴富",
    themeColor: "red",
    header: "2026 丙午马年·招财签",
    actionVerb: "正在坐等",
    keywords: ["涨", "牛", "红", "翻"],
    cta: "扫码测测你的搞钱运势 ➜",
    icon: "Bull",
  },
  CAREER: {
    id: "career",
    label: "我要高升",
    themeColor: "blue",
    header: "2026 丙午马年·青云签",
    actionVerb: "正在冲击",
    keywords: ["升", "高", "聘", "稳"],
    cta: "扫码测测你的跳槽运势 ➜",
    icon: "Rocket",
  },
  SALES: {
    id: "sales",
    label: "我要长虹",
    themeColor: "purple",
    header: "2026 丙午马年·必胜签",
    actionVerb: "正在攻略",
    keywords: ["爆", "赢", "签", "成"],
    cta: "扫码测测你的开单运势 ➜",
    icon: "Trophy",
  },
  SAFETY: {
    id: "safety",
    label: "我要稳赢",
    themeColor: "green",
    header: "2026 丙午马年·定海签",
    actionVerb: "正在坐镇",
    keywords: ["泰", "定", "磐", "安"],
    cta: "扫码测测你的职场运势 ➜",
    icon: "Mountain",
  },
} as const

export type ScenarioKey = keyof typeof SCENARIOS
export type ScenarioId = (typeof SCENARIOS)[ScenarioKey]["id"]

