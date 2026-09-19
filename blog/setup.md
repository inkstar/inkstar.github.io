---
title: 2026 搭建博客指南
date: 2026-02-18 21:30
updated: 2026-02-18 21:30
tags: [博客搭建, Docsify, GitHub Pages, 域名解析]
author: Inkstar
---

# 2026 搭建博客指南

这是我在 2026 年开启技术写作与个人项目沉淀的第一篇随笔。记录如何基于 GitHub Pages 与 Docsify 快速搭建一套轻量、纯粹且支持动态交互的现代化技术博客。

---

## 核心技术选型

- **宿主托管**：GitHub Pages（免费、全球 CDN 分发、无运维心智负担）
- **文档渲染引擎**：Docsify（基于 Vue 的轻量 SPA，无需编译构建，实时解析 Markdown）
- **独立域名**：[www.inkstar.org](https://www.inkstar.org)（通过 CNAME 智能解析与 Cloudflare/GitHub SSL 证书双重保障）

---

## 搭建步骤

### 1. 创建 GitHub 仓库与开启 Pages
1. 创建名称为 `username.github.io`（或个人组织仓库）的公开仓库；
2. 在仓库设置（Settings -> Pages）中将发布源指定为 `main` 分支的根目录 `/`；
3. 配置根目录下的 `CNAME` 文件，填入自定义域名 `www.inkstar.org`。

### 2. 初始化 Docsify
在项目根目录创建 `index.html`，引入 Docsify 核心脚本与主题：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>Inkstar's Space</title>
  <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@4/lib/themes/vue.css">
</head>
<body>
  <div id="app">加载中...</div>
  <script>
    window.$docsify = {
      name: 'Inkstar',
      repo: 'https://github.com/inkstar',
      loadSidebar: true,
      coverpage: true
    };
  </script>
  <script src="//cdn.jsdelivr.net/npm/docsify@4"></script>
</body>
</html>
```

### 3. 配置侧边栏与封面
- `_sidebar.md`：用于多级目录树和分类导航；
- `_coverpage.md`：提供沉浸式的首页视觉封面；
- `README.md`：主站引导页。

---

## 下一步规划
- [x] 接入高中物理与数学交互式可视化实验
- [x] 接入 LaTeX 数学公式渲染插件
- [x] 接入文章发布时间、更新时间与全站访客量统计（不蒜子 Busuanzi）
- [ ] 持续撰写前端工程、AI 与 MCP 相关的深度技术随笔
