import mysql from "../db/mysql.js";

export default async (req, res, next) => {
  try {
    const { userId } = req;
    let userName = '';
    // 获取用户名
    if (userId) {
      const userRes = await mysql.getDetail({
        db: 'users',
        id: userId,
      })
      if (userRes.isOk && userRes.data.length>0) {
        userName = userRes.data[0].username;
      }
    }
    // 记录日志
    await mysql.insert({
      db: 'logs',
      params: {
        user_id: userId || null,
        user_name: userName,
        method: req.method,
        path: req.path,
        param: JSON.stringify({
          query: req.query,
          body: req.body,
          params: req.params
        }),
        ip: req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      }
    })
  } catch (error) {
    console.error('操作日志记录失败:', error);
  }
  next();
};