这是一个使用 [Next.js](https://nextjs.org) 构建的项目。

## 开发运行

启动开发服务器：

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 访问页面。

可以编辑 `src/app/page.tsx`，页面会自动热更新。

本项目已移除 Google Fonts 远程依赖，使用系统字体以确保构建与部署稳定。

## 生产构建

本地打包：

```bash
npm run build
npm run start
```

## 部署到 Vercel（推荐）

1. 安装 CLI（如未安装）：
   ```bash
   npm i -g vercel
   ```
2. 登录并初始化项目：
   ```bash
   vercel
   ```
3. 配置环境变量（生产环境）：
   ```bash
   vercel env add OPENAI_API_KEY production
   vercel env add OPENAI_BASE_URL production
   vercel env add OPENAI_MODEL production
   ```
   按提示分别填入：
   - OPENAI_API_KEY（例如：sk-...）
   - OPENAI_BASE_URL（例如：https://dashscope.aliyuncs.com/compatible-mode/v1）
   - OPENAI_MODEL（例如：qwen-max）
4. 部署生产环境：
   ```bash
   vercel --prod
   ```
5. 获取线上地址并分享给朋友访问。

## 使用 Docker 部署（通用平台）

已提供 `Dockerfile` 与 `.dockerignore`，可在任何支持容器的平台部署：

```bash
docker build -t goldenkey-fortune-2026 .
docker run -e OPENAI_API_KEY=sk-... \
           -e OPENAI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1 \
           -e OPENAI_MODEL=qwen-max \
           -p 3000:3000 goldenkey-fortune-2026
```

容器启动后，访问 `http://服务器IP:3000` 即可。
