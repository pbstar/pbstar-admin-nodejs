import { query } from "../db/mysql.js";
import { structure } from "../utils/array.js";

export default {
  getMyNavTreeList: async (req, res) => {
    if (!req.userId) {
      return res.json({
        code: 401,
        msg: "未登录",
      });
    }

    // 获取用户信息
    const userSql = `SELECT * FROM users WHERE id = ?`;
    const uSqlRes = await query(userSql, [req.userId]);
    if (!uSqlRes.isOk || uSqlRes.data.length == 0) {
      return res.json({
        code: 401,
        msg: "用户不存在",
      });
    }

    const role = uSqlRes.data[0].role;
    if (!role) {
      return res.json({
        code: 401,
        msg: "用户角色不存在",
      });
    }

    // 获取角色信息
    const roleSql = `SELECT * FROM roles WHERE role_key = ?`;
    const rSqlRes = await query(roleSql, [role]);

    if (!rSqlRes.isOk || rSqlRes.data.length == 0) {
      return res.json({
        code: 401,
        msg: "角色不存在",
      });
    }

    const navs = rSqlRes.data[0].navs.split(",");
    const nSqlRes = await query(`SELECT * FROM navs`);

    let list = [];
    if (navs == "all") {
      list = nSqlRes.data;
    } else {
      const allNavIds = [...navs];
      nSqlRes.data.forEach((item) => {
        if (
          navs.includes(item.id.toString()) &&
          item.parent_id &&
          !allNavIds.includes(item.parent_id.toString())
        ) {
          allNavIds.push(item.parent_id.toString());
        }
      });
      list = nSqlRes.data.filter((item) =>
        allNavIds.includes(item.id.toString()),
      );
    }

    res.json({
      code: 200,
      data: structure(list, "parent_id"),
      msg: "成功",
    });
  },
  getAllList: async (req, res) => {
    const sql = `SELECT * FROM navs`;
    const sqlRes = await query(sql);

    res.json({
      code: 200,
      data: sqlRes.data,
      msg: "成功",
    });
  },
  // 查询
  getList: async (req, res) => {
    const { pageNumber = 1, pageSize = 10, name = "", url = "" } = req.body;
    const offset = (pageNumber - 1) * pageSize;

    // 查询总数
    const countSql = `SELECT COUNT(*) as total FROM nav WHERE name LIKE ? AND url LIKE ?`;
    const [totalResult] = await query(countSql, [`%${name}%`, `%${url}%`]);

    // 查询分页数据
    const dataSql = `SELECT * FROM nav WHERE name LIKE ? AND url LIKE ? LIMIT ? OFFSET ?`;
    const list = await query(dataSql, [
      `%${name}%`,
      `%${url}%`,
      pageSize,
      offset,
    ]);

    res.json({
      code: 200,
      data: {
        list: list,
        total: totalResult.total,
        pageNumber,
        pageSize,
      },
      msg: "成功",
    });
  },
  // 详情
  getDetail: async (req, res) => {
    const { id } = req.query;
    const sql = `SELECT * FROM nav WHERE id = ?`;
    const [result] = await query(sql, [id]);

    if (result) {
      res.json({
        code: 200,
        data: result,
        msg: "成功",
      });
    } else {
      res.json({
        code: 404,
        msg: "导航不存在",
      });
    }
  },
  // 新增
  create: async (req, res) => {
    const { name, url, parent_id, icon } = req.body;
    const sql = `INSERT INTO nav (name, url, parent_id, icon) VALUES (?, ?, ?, ?)`;
    const result = await query(sql, [name, url, parent_id, icon]);

    res.json({
      code: 200,
      data: result,
      msg: "创建成功",
    });
  },
  // 修改
  update: async (req, res) => {
    const { id, name, url, parent_id, icon } = req.body;
    const sql = `UPDATE nav SET name = ?, url = ?, parent_id = ?, icon = ? WHERE id = ?`;
    const result = await query(sql, [name, url, parent_id, icon, id]);

    res.json({
      code: 200,
      data: result,
      msg: "更新成功",
    });
  },
  // 删除
  delete: async (req, res) => {
    const { idList } = req.body;
    const sql = `DELETE FROM nav WHERE id IN (?)`;
    const result = await query(sql, [idList]);

    res.json({
      code: 200,
      data: result,
      msg: "删除成功",
    });
  },
};
