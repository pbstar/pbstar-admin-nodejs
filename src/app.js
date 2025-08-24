import express from "express";
import userIdMiddleware from "./middlewares/userId.js";
import logMiddleware from "./middlewares/log.js";
import baseMiddleware from "./middlewares/base.js";
import mainRouter from "./routes/main.js";
import systemRouter from "./routes/system.js";
import exampleRouter from "./routes/example.js";

const app = express();

// 中间件
app.use(express.json());
app.use(baseMiddleware);
app.use(userIdMiddleware);
app.use(logMiddleware);

// 路由
app.use("/main", mainRouter);
app.use("/system", systemRouter);
app.use("/example", exampleRouter);

// 简单错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    code: 500,
    msg: "Something went wrong!",
  });
});

export default app;
