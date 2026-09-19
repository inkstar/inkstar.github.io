---
title: 什么是 MCP：架构原理与常见告警排查指南
date: 2026-02-18 21:35
updated: 2026-09-19 10:23
tags: [AI, MCP, ModelContextProtocol, Codex, Cursor]
author: Inkstar
---

# 什么是 MCP：架构原理与常见告警排查指南

`MCP` 是 `Model Context Protocol`（模型上下文协议），可以理解成一套让 AI 连接外部工具和服务的工业级标准协议。

在 Codex 与现代 AI Agent 里，`GitHub`、`Vercel`、`Stripe`、`Supabase` 这类服务都可以通过各自的 MCP server 接进来。这样模型就不只是“聊天”，还可以在权限允许的前提下读取项目、查询部署、查看日志、访问数据库结构，或者执行受控操作。

简单类比：

- **AI 模型是大脑**
- **MCP 是标准接口**
- **Vercel / Stripe / Supabase MCP server 是不同服务的适配器**

所以当终端里出现 MCP 相关告警时，通常不是代码本身坏了，而是某个外部服务没有登录、启动失败，或者连接超时。

---

## 这几条告警分别是什么意思

### 1. `The vercel MCP server is not logged in`

这表示 `vercel` 这个 MCP 服务已经配置好了，但当前没有登录，所以 Codex 不能访问你的 Vercel 账号、项目和部署信息。

处理方式：

```bash
codex mcp login vercel
```

### 2. `The stripe MCP server is not logged in`

这和 Vercel 的情况一样，表示 `stripe` MCP server 没有登录，因此 Codex 目前无法访问 Stripe 相关资源。

处理方式：

```bash
codex mcp login stripe
```

### 3. `MCP client for supabase timed out after 30 seconds`

这表示 `supabase` MCP client 在启动时等待了 30 秒，但没有成功连上对应服务，于是超时退出。

这类问题不一定是“没登录”，也可能是：

- 网络慢
- `supabase` MCP server 启动本身比较慢
- 配置不完整
- 本地环境或令牌有问题

终端里提示你去调整 `config.toml`：

```toml
[mcp_servers.supabase]
startup_timeout_sec = 60
```

如果 60 秒仍然不够，可以继续调大。

### 4. `MCP startup incomplete (failed: stripe, supabase, vercel)`

这是一条汇总信息，表示本次 MCP 启动没有完全成功。失败的服务就是括号里列出的这几个：

- `stripe`
- `supabase`
- `vercel`

---

## 怎么理解这些状态

可以按下面的方式快速判断：

- `not logged in`：服务能识别到，但你还没完成登录授权
- `timed out`：服务启动或连接太慢，超过等待时间
- `startup incomplete`：上面的问题导致整体初始化没有完成

---

## 需要马上处理吗

不一定。

如果你当前并不打算让 Codex 使用 `Vercel`、`Stripe`、`Supabase`，这些告警可以先忽略。

如果你接下来要让 Codex 帮你处理这些平台上的事情，就应该先把它们修好：

1. 登录 `vercel`
2. 登录 `stripe`
3. 给 `supabase` 增加更长的启动超时
4. 再重新启动或重试相关命令

---

## 一句话总结

这些提示的核心意思是：Codex 想连接外部服务，但 `vercel` 和 `stripe` 还没登录，`supabase` 启动又超时了，所以这三个 MCP 暂时不可用。
