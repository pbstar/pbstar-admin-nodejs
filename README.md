# pbstar-admin-nodejs

本项目为 Node.js 版的 [pbstar-admin](https://github.com/pbstar/pbstar-admim) 项目服务端示例。

在线文档：[http://pbstar-admin-docs.pbstar.cn/docs/server.html](http://pbstar-admin-docs.pbstar.cn/docs/server.html)

## 技术选型

- 后端框架：Node.js + Express
- 数据库：MySQL
- 代码风格：Prettier

## 安装

1. 克隆仓库

```bash
git clone https://github.com/pbstar/pbstar-admin-nodejs.git
```

2. 安装依赖

```bash
npm install
```

3. 导入`src/db/pbstar_admin.sql`数据库脚本
4. 修改`src/db/config.js`中的数据库配置

## 运行

```bash
# 开发模式
npm run dev
# 生产模式
npm start
```

## 项目结构

```
src/
├── controllers/      # 控制器
├── db/               # 数据库配置
├── middlewares/      # 中间件
├── routes/           # 路由
├── utils/            # 工具函数
├── main.js           # 服务入口
└── app.js            # Express应用入口
```
