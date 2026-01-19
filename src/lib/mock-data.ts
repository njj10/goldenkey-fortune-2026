export interface Company {
  ticker: string;
  name: string;
  highlights: string[];
}

export const COMPANIES: Company[] = [
  {
    ticker: "00700.HK",
    name: "腾讯控股 (Tencent)",
    highlights: ["经营性现金流充沛", "社交护城河深厚", "游戏业务回暖", "视频号商业化加速"]
  },
  {
    ticker: "BABA",
    name: "阿里巴巴 (Alibaba)",
    highlights: ["电商GMV稳居第一", "阿里云盈利能力提升", "估值处于历史低位", "回购力度大"]
  },
  {
    ticker: "600519.SH",
    name: "贵州茅台 (Moutai)",
    highlights: ["高端白酒龙头", "毛利率极高", "分红慷慨", "品牌护城河极深"]
  },
  {
    ticker: "00268.HK",
    name: "金蝶国际 (Kingdee)",
    highlights: ["云转型成效显著", "订阅收入占比提升", "国产替代受益者", "SaaS龙头"]
  },
  {
    ticker: "BIDU",
    name: "百度 (Baidu)",
    highlights: ["AI大模型领先", "自动驾驶布局早", "搜索业务现金流稳健", "云服务增长快"]
  },
  {
    ticker: "PDD",
    name: "拼多多 (Pinduoduo)",
    highlights: ["跨境电商Temu爆发", "国内主站用户粘性高", "人效极高", "低价心智占领"]
  },
  {
    ticker: "300750.SZ",
    name: "宁德时代 (CATL)",
    highlights: ["全球动力电池龙头", "技术壁垒高", "海外市场扩张顺利", "储能业务高增"]
  },
  {
    ticker: "002594.SZ",
    name: "比亚迪 (BYD)",
    highlights: ["新能源车销量全球第一", "全产业链垂直整合", "出口增长强劲", "高端化初见成效"]
  },
  {
    ticker: "600036.SH",
    name: "招商银行 (CMB)",
    highlights: ["零售之王", "资产质量优异", "数字化转型领先", "高净值客户粘性强"]
  },
  {
    ticker: "03690.HK",
    name: "美团 (Meituan)",
    highlights: ["本地生活霸主", "即时配送网络强大", "新业务减亏", "到店业务护城河深"]
  },
  {
    ticker: "JD",
    name: "京东 (JD.com)",
    highlights: ["供应链效率极致", "自建物流体验好", "下沉市场渗透", "百亿补贴见效"]
  },
  {
    ticker: "01810.HK",
    name: "小米集团 (Xiaomi)",
    highlights: ["手机高端化战略", "汽车业务超预期", "AIoT生态完善", "全球化布局"]
  },
  {
    ticker: "02015.HK",
    name: "理想汽车 (Li Auto)",
    highlights: ["增程技术精准定位", "家庭用户口碑好", "毛利率健康", "现金流充裕"]
  },
  {
    ticker: "000333.SZ",
    name: "美的集团 (Midea)",
    highlights: ["家电全球化龙头", "收购库卡布局机器人", "B端业务增长快", "分红稳定"]
  },
  {
    ticker: "601888.SH",
    name: "中国中免 (CDF)",
    highlights: ["全球免税龙头", "渠道优势明显", "消费回流受益", "毛利率修复"]
  },
  {
    ticker: "600276.SH",
    name: "恒瑞医药 (Hengrui)",
    highlights: ["创新药转型成功", "PD-1等多款重磅药", "研发投入巨大", "出海进程加速"]
  },
  {
    ticker: "000858.SZ",
    name: "五粮液 (Wuliangye)",
    highlights: ["浓香型白酒龙头", "品牌价值稳固", "渠道改革深化", "分红率提升"]
  },
  {
    ticker: "600030.SH",
    name: "中信证券 (CITIC)",
    highlights: ["券商龙头", "机构业务优势明显", "国际化布局领先", "抗风险能力强"]
  },
  {
    ticker: "002415.SZ",
    name: "海康威视 (Hikvision)",
    highlights: ["安防监控全球第一", "创新业务多点开花", "AI落地场景丰富", "数字化转型赋能"]
  },
  {
    ticker: "601318.SH",
    name: "中国平安 (Ping An)",
    highlights: ["综合金融牌照齐全", "寿险改革深化", "医疗健康生态圈", "低估值高股息"]
  }
];

export const WISH_TYPES = [
  { id: "wealth", label: "暴富", color: "red", icon: "Bull", description: "搞钱第一" },
  { id: "career", label: "高升", color: "blue", icon: "Rocket", description: "升职加薪" },
  { id: "sales", label: "长虹", color: "purple", icon: "Qilin", description: "业绩翻倍" },
  { id: "safety", label: "稳赢", color: "green", icon: "Mount Tai", description: "落袋为安" }
] as const;
