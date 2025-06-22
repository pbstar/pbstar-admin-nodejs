# pbstar-admin-nodejs

PbstarAdmin 后端接口

## 项目描述

这是一个基于Node.js和Express的后台管理系统，提供用户管理、角色权限、系统配置等功能。

在线文档：[http://pbstar-admin-docs.pbstar.cn/docs/server.html](http://pbstar-admin-docs.pbstar.cn/docs/server.html)

## 安装

1. 克隆仓库

```bash
git clone https://github.com/pbstar/pbstar-admin-nodejs.git
```

2. 安装依赖

```bash
npm install
```

3. 配置数据库
   修改`src/db/config.js`中的数据库配置

## 运行

开发模式

```bash
npm run dev
```

生产模式

```bash
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
