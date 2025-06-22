import { query } from "../db/mysql.js";

export default {
  getEnum: async (req, res) => {
    const { enumKey } = req.query;
    const keyArr = enumKey.split(",");
    const result = {};
    for (const item of keyArr) {
      const sql = `SELECT * FROM enum WHERE key = ?`;
      const sqlRes = await query(sql, [item]);
      if (sqlRes.isOk && sqlRes.data.length > 0) {
        const enumItemsSql = `SELECT * FROM enum_item WHERE enum_id = ?`;
        const enumItems = await query(enumItemsSql, [sqlRes.data[0].id]);
        result[item] = enumItems;
      } else {
        result[item] = [];
      }
    }
    res.json({
      code: 200,
      data: result,
      msg: "成功",
    });
  },
  // 查询
  getList: async (req, res) => {
    const { pageNumber, pageSize, name, key } = req.body;
    const limit = pageSize || 10;
    const offset = (pageNumber - 1) * pageSize || 0;
    const querySqls = [];
    const queryVals = [];

    if (name) {
      querySqls.push(`name LIKE ?`);
      queryVals.push(`%${name}%`);
    }
    if (key) {
      querySqls.push(`key LIKE ?`);
      queryVals.push(`%${key}%`);
    }

    // 查询总数
    const countSql = `SELECT COUNT(*) as total FROM enum WHERE ${querySqls.join(" AND ")}`;
    const cSqlRes = await query(countSql, queryVals);

    // 查询分页数据
    const dataSql = `SELECT * FROM enum WHERE ${querySqls.join(" AND ")} LIMIT ? OFFSET ?`;
    const dSqlRes = await query(dataSql, [...queryVals, limit, offset]);

    res.json({
      code: 200,
      data: {
        list: dSqlRes,
        total: cSqlRes[0].total,
        pageNumber,
        pageSize,
      },
      msg: "成功",
    });
  },
  // 详情
  getDetail: async (req, res) => {
    const { id } = req.query;
    const sql = `SELECT * FROM enum WHERE id = ?`;
    const sqlRes = await query(sql, [id]);

    if (sqlRes.isOk && sqlRes.data.length > 0) {
      res.json({
        code: 200,
        data: sqlRes.data[0],
        msg: "成功",
      });
    } else {
      res.json({
        code: 404,
        msg: "枚举不存在",
      });
    }
  },
  // 新增
  create: async (req, res) => {
    const { name, key } = req.body;
    const sql = `INSERT INTO enum (name, key) VALUES (?, ?)`;
    const sqlRes = await query(sql, [name, key]);

    res.json({
      code: 200,
      data: sqlRes.data[0],
      msg: "创建成功",
    });
  },
  // 修改
  update: async (req, res) => {
    const { id, name, key } = req.body;
    const sql = `UPDATE enum SET name = ?, key = ? WHERE id = ?`;
    const sqlRes = await query(sql, [name, key, id]);

    res.json({
      code: 200,
      data: sqlRes.data[0],
      msg: "更新成功",
    });
  },
  // 删除
  delete: async (req, res) => {
    const { idList } = req.body;
    const sql = `DELETE FROM enum WHERE id IN (?)`;
    const sqlRes = await query(sql, [idList]);

    res.json({
      code: 200,
      data: sqlRes.data[0],
      msg: "删除成功",
    });
  },
  // 获取子表列表
  getEnumList: async (req, res) => {
    const { enumId } = req.query;
    const sql = `SELECT * FROM enum_item WHERE enum_id = ?`;
    const sqlRes = await query(sql, [enumId]);

    res.json({
      code: 200,
      data: sqlRes.data,
      msg: "成功",
    });
  },
  // 获取子表详情
  getEnumDetail: async (req, res) => {
    const { id } = req.query;
    const sql = `SELECT * FROM enum_item WHERE id = ?`;
    const sqlRes = await query(sql, [id]);

    if (sqlRes.isOk && sqlRes.data.length > 0) {
      res.json({
        code: 200,
        data: sqlRes.data[0],
        msg: "成功",
      });
    } else {
      res.json({
        code: 401,
        msg: "枚举项不存在",
      });
    }
  },
  // 新增子表
  createEnum: async (req, res) => {
    const { enumId, label, value } = req.body;
    const sql = `INSERT INTO enum_item (enum_id, label, value) VALUES (?, ?, ?)`;
    const sqlRes = await query(sql, [enumId, label, value]);

    res.json({
      code: 200,
      data: sqlRes.data[0],
      msg: "创建成功",
    });
  },
  // 修改子表
  updateEnum: async (req, res) => {
    const { id, enumId, label, value } = req.body;
    const sql = `UPDATE enum_item SET enum_id = ?, label = ?, value = ? WHERE id = ?`;
    const sqlRes = await query(sql, [enumId, label, value, id]);

    res.json({
      code: 200,
      data: sqlRes.data[0],
      msg: "更新成功",
    });
  },
  // 删除子表
  deleteEnum: async (req, res) => {
    const { idList } = req.body;
    const sql = `DELETE FROM enum_item WHERE id IN (?)`;
    const sqlRes = await query(sql, [idList]);

    res.json({
      code: 200,
      data: sqlRes.data[0],
      msg: "删除成功",
    });
  },
};
