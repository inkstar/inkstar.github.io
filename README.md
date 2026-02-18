# inkstar.github.io

#### it is some fundamental information of inkstar

个人博客与项目展示站，托管于 [GitHub Pages](https://pages.github.com/)。

- 在线地址：[https://inkstar.github.io/](https://inkstar.github.io/)
- 本地开发：用浏览器直接打开 `index.html`，或使用任意静态服务器（如 `npx serve .`）预览。

## 使用自定义域名

可以购买自己的域名（如 `inkstar.com`），然后让 GitHub Pages 用该域名提供服务。

### 步骤概要

1. **购买域名**在任意域名注册商（如 Namecheap、Cloudflare、阿里云、腾讯云等）购买你想要的域名。
2. **在仓库中启用自定义域名**

   - 在 GitHub 仓库 **Settings → Pages** 里，在 **Custom domain** 填你的域名（如 `www.inkstar.com` 或 `inkstar.com`），保存。
   - （可选）在本仓库根目录新建一个名为 `CNAME` 的文件，内容只写一行你的域名，例如：

     ```
     www.inkstar.com
     ```

     这样用 Git 推送时，GitHub 会记住你的自定义域名设置。
3. **在域名服务商处配置 DNS**根据你用的是「根域名」还是「子域名」二选一：

   - **使用 `www` 子域名（如 www.inkstar.com）**添加一条 **CNAME** 记录：

     - 主机记录：`www`
     - 记录值：`inkstar.github.io`
   - **使用根域名（如 inkstar.com）**添加一条 **A** 记录：

     - 主机记录：`@`
     - 记录值：`185.199.108.153`（或 GitHub 官方文档中当前提供的 IP）
       建议再查一次 [GitHub 官方文档](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site) 以确认最新 IP。
4. **开启 HTTPS（推荐）**
   在 GitHub **Settings → Pages** 里勾选 **Enforce HTTPS**，等 DNS 生效后 GitHub 会为你的自定义域名签发证书。

配置生效可能需要几分钟到 48 小时，生效后访问你的域名即可打开本站；项目仍然在 GitHub 上维护，只是通过你自己的域名访问。

## 项目结构

```
.
├── index.html      # 首页（博客 + 项目 + 关于）
├── css/
│   └── style.css   # 样式
└── README.md       # 说明与自定义域名步骤
```

后续可在此仓库继续添加更多页面、博客文章目录或子项目链接。

>>>>>>> ed92f98 (Add blog and project landing page)
>>>>>>>
>>>>>>
>>>>>
>>>>
>>>
>>
