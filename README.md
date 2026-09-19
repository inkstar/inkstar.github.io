---
title: Inkstar's Space
date: 2026-02-18
updated: 2026-09-19
---

# Inkstar's Space

#### 个人博客与项目交互实验室

托管于 [GitHub Pages](https://pages.github.com/)，自定义域名：[www.inkstar.org](https://www.inkstar.org)。

---

## 🚀 精选可视化交互实验室

- 🚗 **[物理·匀变速直线运动全景实验室 ↗](projects/uniform-linear-motion.html ':target=_blank')**  
  高中物理必修一核心考点可视化实验室：包含动力学仿真跑道、智能滑块小车矢量箭头、打点残影、四维图像联动（$v-t$、$x-t$、$a-t$、$v^2-x$）、五大核心公式图谱、“知三求二”智能推导演算器、三大性质（时间中点 vs 位移中点、纸带打点与逐差法、初速为0比例王国几何积木切片）以及高考刹车死时间陷阱、追及相遇临界模型。
- 📈 **[Power Function 幂函数模型 ↗](projects/powerfunction.html ':target=_blank')**  
  交互式幂函数性质与图像动态演练。
- 📊 **[三角函数极值区间演示 ↗](projects/dailyproblem26052601.html ':target=_blank')**  
  三角函数极值与单调区间交互动态演示。
- 🤖 **[AI Studio 题目动画 ↗](https://ai.studio/apps/f7a31f6a-3ca5-46c3-865f-15d919971c63 ':target=_blank')**

---

## 📝 最新技术博客

- 📐 **[Web 现代数学公式渲染避坑全指南](blog/math-rendering-guide.md)**  
  从排版原理、KaTeX vs MathJax 深度选型对比，到定界符失效、隐藏 Tab 几何尺寸为零、SPA 异步渲染时序脱节、JS 反斜杠转义黑洞等五大深坑与完整解法。
- 🤖 **[什么是 MCP：架构原理与常见告警排查指南](blog/mcp.md)**  
  深入浅出解析 Model Context Protocol 协议、服务适配器以及 Vercel/Stripe/Supabase 常见启动与超时排查。
- 🛠️ **[2026 搭建博客指南](blog/setup.md)**  
  GitHub Pages + Docsify + 独立域名搭建全流程记录。
- 🧪 **[LaTeX 公式演练与测试](blog/blog01.md)**  
  行内与块级数学公式排版实操演练。

---

## 项目说明与本地开发

- 在线地址：[https://www.inkstar.org/](https://www.inkstar.org/)
- 本地开发：用浏览器直接打开 `index.html`，或使用任意静态服务器（如 `npx serve .`）预览。

### 目录结构

```
.
├── index.html      # Docsify 入口与核心配置
├── _sidebar.md     # 侧边栏导航配置
├── _coverpage.md   # 封面页展示
├── projects/       # 独立可视化应用
└── blog/           # 技术博客文章
```
