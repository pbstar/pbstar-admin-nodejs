import mysql from "../db/mysql.js";

export default {
  // 获取枚举
  getEnum: async (req, res) => {
    const { enumKey } = req.query;
    const keyArr = enumKey.split(",");
    const result = {};
    for (const item of keyArr) {
      const sql = `SELECT * FROM enums WHERE enum_key = ?`;
      const sqlRes = await mysql.query(sql, [item]);
      if (sqlRes.isOk && sqlRes.data.length > 0) {
        const enumItemsSql = `SELECT * FROM enum_itemss WHERE enum_id = ?`;
        const enumItems = await mysql.query(enumItemsSql, [sqlRes.data[0].id]);
        result[item] = enumItems.data;
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
    const mConfig = {
      pageNumber,
      pageSize,
      db: "enums",
      params: {},
      orderBy: "id",
      order: "desc",
    }
    if (name) {
      mConfig.params.enum_name = {
        type: "like",
        value: name,
      };
    }
    if (key) {
      mConfig.params.enum_key = {
        type: "like",
        value: key,
      };
    }
    const dataRes = await mysql.getPage(pageObj);
    if (!dataRes.isOk) {
      res.json({
        code: 400,
        msg: "获取失败",
      });
      return;
    }
    res.json({
      code: 200,
      data: dataRes.data,
      msg: "成功",
    });
  },
  // 详情
  getDetail: async (req, res) => {
    const { id } = req.query;
    const sqlRes = await mysql.getDetail({
      db: "enums",
      id,
    });
    if (!sqlRes.isOk) {
      res.json({
        code: 400,
        msg: "获取失败",
      });
      return;
    }
    if (sqlRes.data) {
      res.json({
        code: 200,
        data: sqlRes.data,
        msg: "成功",
      });
    }
  },
  // 新增
  create: async (req, res) => {
    const { name, key } = req.body;
    const sqlRes = await mysql.insert({
      db: "enums",
      params: {
        enum_name: name,
        enum_key: key,
      },
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
      data: sqlRes.data,
      msg: "创建成功",
    });
  },
  // 修改
  update: async (req, res) => {
    const { id, name, key } = req.body;
    const config = {
      db: "enums",
      params: {},
      id,
    }
    if (name) {
      config.params.enum_name = name;
    }
    if (key) {
      config.params.enum_key = key;
    }
    const sqlRes = await mysql.update(config);
    if (!sqlRes.isOk) {
      res.json({
        code: 400,
        msg: "更新失败",
      });
      return;
    }
    res.json({
      code: 200,
      data: sqlRes.data,
      msg: "更新成功",
    });
  },
  // 删除
  delete: async (req, res) => {
    const { idList } = req.body;
    const config = {
      db: "enums",
      idList,
    }
    const sqlRes = await mysql.deleteBatch(config);
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
  // 获取子表列表
  getEnumList: async (req, res) => {
    const { enumId } = req.query;
    const config = {
      db: "enum_items",
      params: {
        enum_id: enumId,
      },
    }
    const sqlRes = await mysql.getList(config);
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
  // 获取子表详情
  getEnumDetail: async (req, res) => {
    const { id } = req.query;
    const config = {
      db: "enum_items",
      id,
    }
    const sqlRes = await mysql.getDetail(config);
    if (!sqlRes.isOk) {
      res.json({
        code: 400,
        msg: "获取失败",
      });
      return;
    }
    if (sqlRes.data) {
      res.json({
        code: 200,
        data: sqlRes.data,
        msg: "成功",
      });
    }
  },
  // 新增子表
  createEnum: async (req, res) => {
    const { enumId, label, value } = req.body;
    const config = {
      db: "enum_items",
      params: {
        enum_id: enumId,
        label,
        value,
      },
    }
    const sqlRes = await mysql.insert(config);
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
  // 修改子表
  updateEnum: async (req, res) => {
    const { id, enumId, label, value } = req.body;
    const config = {
      db: "enum_items",
      params: {
        enum_id: enumId,
        label,
        value,
      },
      id,
    }
    const sqlRes = await mysql.update(config);
    if (!sqlRes.isOk) {
      res.json({
        code: 400,
        msg: "更新失败",
      });
      return;
    }
    res.json({
      code: 200,
      data: sqlRes.data,
      msg: "更新成功",
    });
  },
  // 删除子表
  deleteEnum: async (req, res) => {
    const { idList } = req.body;
    const config = {
      db: "enum_items",
      idList,
    }
    const sqlRes = await mysql.deleteBatch(config);
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
};
