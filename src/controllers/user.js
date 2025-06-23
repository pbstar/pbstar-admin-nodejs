import mysql from "../db/mysql.js";
import { generateToken } from "../utils/token.js";

export default {
  // 用户登录
  login: async (req, res) => {
    const { username, password } = req.body;
    const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
    const sqlRes = await mysql.query(sql, [username, password]);
    if (!sqlRes.isOk || sqlRes.data.length == 0) {
      return res.json({
        code: 401,
        msg: "账号或密码错误",
      });
    }
    const token = generateToken(sqlRes.data[0].id);
    //存储token
    const uSqlRes = await mysql.query(`UPDATE users SET token = ? WHERE id = ?`, [
      token,
      sqlRes.data[0].id,
    ]);
    if (!uSqlRes.isOk) {
      return res.json({
        code: 500,
        msg: "登录失败",
      });
    }
    const rSqlRes = await mysql.query(`SELECT * FROM roles WHERE role_key = ?`, [
      sqlRes.data[0].role,
    ]);
    res.json({
      code: 200,
      data: {
        token: token,
        id: sqlRes.data[0].id,
        username: sqlRes.data[0].username,
        name: sqlRes.data[0].name,
        role: sqlRes.data[0].role,
        avatar: sqlRes.data[0].avatar,
        btns: rSqlRes.data[0].btns,
      },
      msg: "登录成功",
    });
  },

  // 获取用户列表
  getList: async (req, res) => {
    const { pageNumber, pageSize, username, name, role } = req.body;
    const limit = pageSize || 10;
    const offset = (pageNumber - 1) * pageSize || 0;
    const querySqls = [];
    const queryVals = [];

    // 查询条件
    if (username) {
      querySqls.push(`username LIKE ?`);
      queryVals.push(`%${username}%`);
    }
    if (name) {
      querySqls.push(`name LIKE ?`);
      queryVals.push(`%${name}%`);
    }
    if (role) {
      querySqls.push(`role = ?`);
      queryVals.push(role);
    }

    // 查询总数
    const countSql = `SELECT COUNT(*) as total FROM users ${querySqls.length > 0 ? `WHERE ${querySqls.join(" AND ")}` : ""}`;
    const cSqlRes = await mysql.query(countSql, queryVals);

    // 查询分页数据
    const dataSql = `SELECT * FROM users ${querySqls.length > 0 ? `WHERE ${querySqls.join(" AND ")}` : ""} LIMIT ? OFFSET ?`;
    const dSqlRes = await mysql.query(dataSql, [...queryVals, limit, offset]);

    res.json({
      code: 200,
      data: {
        list: dSqlRes.data,
        total: cSqlRes.data[0].total,
        pageNumber,
        pageSize,
      },
      msg: "成功",
    });
  },

  // 获取用户详情
  getDetail: async (req, res) => {
    const { id } = req.query;
    const sql = `SELECT * FROM users WHERE id = ?`;
    const sqlRes = await mysql.query(sql, [id]);

    if (sqlRes.isOk && sqlRes.data.length > 0) {
      res.json({
        code: 200,
        data: sqlRes.data[0],
        msg: "成功",
      });
    } else {
      res.json({
        code: 401,
        msg: "用户不存在",
      });
    }
  },

  // 创建用户
  create: async (req, res) => {
    const { username, password, avatar, name, role } = req.body;
    const sql = `INSERT INTO users (username, password, avatar, name, role) VALUES (?, ?, ?, ?, ?)`;
    const sqlRes = await mysql.query(sql, [username, password, avatar, name, role]);

    if (sqlRes.isOk) {
      res.json({
        code: 200,
        data: sqlRes.data,
        msg: "创建成功",
      });
    } else {
      res.json({
        code: 500,
        msg: sqlRes.msg,
      });
    }
  },

  // 更新用户
  update: async (req, res) => {
    const { id, username, password, avatar, name, role } = req.body;

    const sqls = [];
    const vals = [];
    if (username) {
      sqls.push(`username = ?`);
      vals.push(username);
    }
    if (password) {
      sqls.push(`password = ?`);
      vals.push(password);
    }
    if (avatar) {
      sqls.push(`avatar = ?`);
      vals.push(avatar);
    }
    if (name) {
      sqls.push(`name = ?`);
      vals.push(name);
    }
    if (role) {
      sqls.push(`role = ?`);
      vals.push(role);
    }
    if (sqls.length === 0) {
      return res.json({
        code: 400,
        msg: "请填写更新内容",
      });
    }
    vals.push(id);
    const sql = `UPDATE users SET ${sqls.join(",")} WHERE id = ?`;
    const sqlRes = await mysql.query(sql, vals);
    if (sqlRes.isOk) {
      res.json({
        code: 200,
        data: sqlRes.data,
        msg: "更新成功",
      });
    } else {
      res.json({
        code: 500,
        msg: sqlRes.msg,
      });
    }
  },

  // 删除用户
  delete: async (req, res) => {
    const { idList } = req.body;
    const sql = `DELETE FROM users WHERE id IN (?)`;
    const sqlRes = await mysql.query(sql, [idList]);

    if (sqlRes.isOk) {
      res.json({
        code: 200,
        data: sqlRes.data,
        msg: "删除成功",
      });
    } else {
      res.json({
        code: 500,
        msg: sqlRes.msg,
      });
    }
  },

  // 通过token登录
  loginByToken: async (req, res) => {
    if (!req.userId) {
      return res.json({
        code: 401,
        msg: "未登录",
      });
    }
    const sqlRes = await mysql.query(`SELECT * FROM users WHERE id = ?`, [
      req.userId,
    ]);
    if (!sqlRes.isOk || sqlRes.data.length == 0) {
      return res.json({
        code: 401,
        msg: "未登录",
      });
    }
    const user = sqlRes.data[0];
    const rSqlRes = await mysql.query(`SELECT * FROM roles WHERE role_key = ?`, [
      user.role,
    ]);
    res.json({
      code: 200,
      data: {
        token: sqlRes.data[0].token,
        id: sqlRes.data[0].id,
        username: sqlRes.data[0].username,
        name: sqlRes.data[0].name,
        role: sqlRes.data[0].role,
        avatar: sqlRes.data[0].avatar,
        btns: rSqlRes.data[0].btns,
      },
      msg: "登录成功",
    });
  },

  // 登出
  logout: async (req, res) => {
    if (!req.userId) {
      return res.json({
        code: 401,
        msg: "未登录",
      });
    }
    const sqlRes = await mysql.query(`UPDATE users SET token = NULL WHERE id = ?`, [
      req.userId,
    ]);
    if (!sqlRes.isOk) {
      return res.json({
        code: 500,
        msg: sqlRes.msg,
      });
    }
    res.json({
      code: 200,
      data: "success",
      msg: "登出成功",
    });
  },

  // 修改个人信息
  updateMyInfo: async (req, res) => {
    if (!req.userId) {
      return res.json({
        code: 401,
        msg: "未登录",
      });
    }
    const { username, password, avatar, name } = req.body;
    const sqls = [];
    const vals = [];
    if (username) {
      sqls.push(`username = ?`);
      vals.push(username);
    }
    if (password) {
      sqls.push(`password = ?`);
      vals.push(password);
    }
    if (avatar) {
      sqls.push(`avatar = ?`);
      vals.push(avatar);
    }
    if (name) {
      sqls.push(`name = ?`);
      vals.push(name);
    }
    if (sqls.length === 0) {
      return res.json({
        code: 400,
        msg: "请填写更新内容",
      });
    }
    vals.push(req.userId);
    const sql = `UPDATE users SET ${sqls.join(",")} WHERE id = ?`;
    const sqlRes = await mysql.query(sql, vals);
    if (sqlRes.isOk) {
      res.json({
        code: 200,
        data: null,
        msg: "更新成功",
      });
    } else {
      res.json({
        code: 500,
        msg: sqlRes.msg,
      });
    }
  },
};
