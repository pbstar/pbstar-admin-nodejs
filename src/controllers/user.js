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
        code: 400,
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
    const params = {};
    if (name !== undefined && name !== '') {
      params.name = {
        type: "like",
        value: name,
      };
    }
    if (username !== undefined && username !== '') {
      params.username = {
        type: "like",
        value: username,
      };
    }
    if (role !== undefined && role !== '') {
      params.role = {
        type: "=",
        value: role,
      };
    }
    const sqlRes = await mysql.getPage({
      pageNumber,
      pageSize,
      db: "users",
      params,
      orderBy: "id",
      order: "desc",
    });

    if (!sqlRes.isOk) {
      res.json({
        code: 400,
        msg: "获取失败",
      });
      return;
    }

    res.json({
      code: 200,
      data: sqlRes.data,
      msg: "成功",
    });
  },

  // 获取用户详情
  getDetail: async (req, res) => {
    const { id } = req.query;
    const sqlRes = await mysql.getDetail({
      db: "users",
      id,
    });
    if (!sqlRes.isOk) {
      res.json({
        code: 400,
        msg: "获取失败",
      });
      return;
    }
    if (sqlRes.data.length === 0) {
      res.json({
        code: 400,
        msg: "数据不存在",
      });
      return;
    }
    res.json({
      code: 200,
      data: sqlRes.data[0],
      msg: "成功",
    });
  },

  // 创建用户
  create: async (req, res) => {
    const { username, password, avatar, name, role } = req.body;
    const params = {};
    if (username) {
      params.username = username;
    }
    if (password) {
      params.password = password;
    }
    if (avatar) {
      params.avatar = avatar;
    }
    if (name) {
      params.name = name;
    }
    if (role) {
      params.role = role;
    }
    const sqlRes = await mysql.insert({
      db: "users",
      params,
    });
    if (!sqlRes.isOk) {
      res.json({
        code: 400,
        msg: "创建失败",
      });
      return;
    }
    res.json({
      code: 200,
      data: sqlRes.data[0],
      msg: "创建成功",
    });
  },

  // 更新用户
  update: async (req, res) => {
    const { id, username, password, avatar, name, role } = req.body;
    const params = {};
    if (username) {
      params.username = username;
    }
    if (password) {
      params.password = password;
    }
    if (avatar) {
      params.avatar = avatar;
    }
    if (name) {
      params.name = name;
    }
    if (role) {
      params.role = role;
    }
    const sqlRes = await mysql.update({
      db: "users",
      params,
      id,
    });
    if (!sqlRes.isOk) {
      res.json({
        code: 400,
        msg: "更新失败",
      });
      return;
    }
    res.json({
      code: 200,
      data: sqlRes.data[0],
      msg: "更新成功",
    });
  },

  // 删除用户
  delete: async (req, res) => {
    const { idList } = req.body;
    const sqlRes = await mysql.deleteBatch({
      db: "users",
      idList,
    });
    if (!sqlRes.isOk) {
      res.json({
        code: 400,
        msg: "删除失败",
      });
      return;
    }
    res.json({
      code: 200,
      data: sqlRes.data,
      msg: "删除成功",
    });
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
    const sqlRes = await mysql.update({
      db: "users",
      params: {
        token: null,
      },
      id: req.userId,
    });
    if (!sqlRes.isOk) {
      res.json({
        code: 400,
        msg: "登出失败",
      });
      return;
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
    const params = {};
    if (username !== undefined) {
      params.username = username;
    }
    if (password !== undefined) {
      params.password = password;
    }
    if (avatar !== undefined) {
      params.avatar = avatar;
    }
    if (name !== undefined) {
      params.name = name;
    }
    const sqlRes = await mysql.update({
      db: "users",
      params,
      id: req.userId,
    });
    if (!sqlRes.isOk) {
      res.json({
        code: 400,
        msg: "更新失败",
      });
      return;
    }
    res.json({
      code: 200,
      data: sqlRes.data[0],
      msg: "更新成功",
    });
  },
};
