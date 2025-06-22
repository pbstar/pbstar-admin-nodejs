import { query } from "../db/mysql.js";

export default {
  // 获取角色列表
  getList: async (req, res) => {
    const { pageNumber = 1, pageSize = 10, name = "", key = "" } = req.body;
    const offset = (pageNumber - 1) * pageSize;

    // SQL语句
    const countSql = `SELECT COUNT(*) as total FROM role`;
    const dataSql = `SELECT * FROM role LIMIT ? OFFSET ?`;

    // 条件
    let whereSql = "";
    let whereParams = [];
    if (name) {
      whereSql += " WHERE name LIKE ?";
      whereParams.push(`%${name}%`);
    }
    if (key) {
      whereSql += " AND key LIKE ?";
      whereParams.push(`%${key}%`);
    }

    // 查询总数
    const total = await query(countSql + whereSql, whereParams);

    // 查询分页数据
    const list = await query(dataSql + whereSql, [
      pageSize,
      offset,
      ...whereParams,
    ]);

    res.json({
      code: 200,
      data: {
        list,
        total: total.total,
        pageNumber,
        pageSize,
      },
      msg: "成功",
    });
  },

  // 获取角色详情
  getDetail: async (req, res) => {
    const { id } = req.query;
    const sql = `SELECT * FROM role WHERE id = ?`;
    const result = await query(sql, [id]);

    if (role) {
      res.json({
        code: 200,
        data: result[0],
        msg: "成功",
      });
    } else {
      res.json({
        code: 404,
        msg: "角色不存在",
      });
    }
  },

  // 创建角色
  create: async (req, res) => {
    const { name, key, navs, btns } = req.body;
    const sql = `INSERT INTO role (name, key, navs, btns) VALUES (?, ?, ?, ?)`;
    const result = await query(sql, [name, key, navs, btns]);
    res.json({
      code: 200,
      data: result,
      msg: "创建成功",
    });
  },

  // 更新角色
  update: async (req, res) => {
    const { id, name, key, navs, btns } = req.body;
    const sql = `UPDATE role SET name = ?, key = ?, navs = ?, btns = ? WHERE id = ?`;
    const result = await query(sql, [name, key, navs, btns, id]);
    res.json({
      code: 200,
      data: result,
      msg: "更新成功",
    });
  },

  // 删除角色
  delete: async (req, res) => {
    const { idList } = req.body;
    const sql = `DELETE FROM role WHERE id IN (?)`;
    const result = await query(sql, [idList]);

    res.json({
      code: 200,
      data: result,
      msg: "删除成功",
    });
  },

  // 通过角色key获取角色信息
  getRoleByKey: async (req, res) => {
    const { key } = req.query;
    const sql = `SELECT * FROM role WHERE key = ?`;
    const [role] = await query(sql, [key]);

    if (role) {
      res.json({
        code: 200,
        data: role,
        msg: "成功",
      });
    }
  },
};
