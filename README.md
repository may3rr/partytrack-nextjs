# 党建助手 - PartyTrack

基于Next.js的党员管理系统，专为高校团支部和党支部设计。

## 🚀 一键部署到Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/may3rr/partytrack-nextjs)

## ✨ 功能特性

- ✅ 成员全生命周期管理
- ✅ 智能提醒系统
- ✅ AI党建助手
- ✅ 用户认证系统
- ✅ 响应式设计
- ✅ 云端部署

## 🛠️ 技术栈

- **前端**: Next.js 15 + TypeScript + Tailwind CSS
- **后端**: Next.js API Routes
- **数据库**: PostgreSQL + Prisma
- **认证**: NextAuth.js
- **AI**: OpenAI GPT-3.5-turbo

## 📦 快速开始

### 本地开发

```bash
# 克隆项目
git clone https://github.com/may3rr/partytrack-nextjs.git
cd partytrack-nextjs

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填写你的配置

# 数据库设置
npm run db:push

# 启动开发服务器
npm run dev
```

### 环境变量配置

在Vercel控制台配置以下环境变量：

```bash
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-secret-key
POSTGRES_PRISMA_URL=your-vercel-postgres-url
POSTGRES_URL_NON_POOLING=your-vercel-postgres-direct-url
OPENAI_API_KEY=your-openai-api-key
```

## 📁 项目结构

```
src/
├── app/              # 应用路由和页面
├── components/       # 公共组件
├── lib/             # 工具库
└── types/           # 类型定义
```

## 🎯 主要功能

1. **成员管理**: 完整的党员发展流程管理
2. **智能提醒**: 自动提醒重要时间节点
3. **AI助手**: 24/7党建政策咨询
4. **数据统计**: 实时数据看板
5. **多端适配**: 完美支持手机、平板、电脑

## 📖 使用指南

1. 部署到Vercel
2. 配置环境变量
3. 访问管理后台
4. 开始管理党员信息

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License
