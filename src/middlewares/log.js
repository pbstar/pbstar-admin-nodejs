import mysql from "../db/mysql.js";

function getClientIp(req) {
  // 获取X-Forwarded-For头部
  let ip = req.headers["x-forwarded-for"];
  if (ip) {
    // X-Forwarded-For头部可能包含多个IP地址，取第一个
    ip = ip.split(",")[0].trim();
  } else {
    // 如果没有X-Forwarded-For头部，尝试获取连接的远程地址
    ip = req.socket.remoteAddress;
  }
  return ip;
}

export default async (req, res, next) => {
  try {
    const { userId } = req;
    let userName = "";
    // 获取用户名
    if (userId) {
      const userRes = await mysql.getDetail({
        db: "users",
        id: userId,
      });
      if (userRes.isOk && userRes.data.length > 0) {
        userName = userRes.data[0].username;
      }
    }
    // 记录日志
    await mysql.insert({
      db: "logs",
      params: {
        user_id: userId || null,
        user_name: userName,
        method: req.method,
        path: req.path,
        param: JSON.stringify({
          query: req.query,
          body: req.body,
          params: req.params,
        }),
        ip: getClientIp(req),
      },
    });
  } catch (error) {
    console.error("操作日志记录失败:", error);
  }
  next();
};
