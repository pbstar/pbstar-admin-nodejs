import mysql from "../db/mysql.js";

export default {
  // 获取枚举
  getEnum: async (req, res) => {
    const { enumKey } = req.query;
    const keyArr = enumKey.split(",");
    const result = {};
    for (const item of keyArr) {
      const enumRes = await mysql.getList({
        db: "enums",
        params: {
          enum_key: {
            type: "=",
            value: item,
          },
        },
      });
      if (!enumRes.isOk || enumRes.data.length === 0) {
        result[item] = [];
        continue;
      }
      const enumValueRes = await mysql.getList({
        db: "enum_items",
        params: {
          enum_id: {
            type: "=",
            value: enumRes.data[0].id,
          },
        },
      });
      if (enumValueRes.isOk && enumValueRes.data.length > 0) {
        result[item] = enumValueRes.data;
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
    const params = {}
    if (name) {
      params.enum_name = {
        type: "like",
        value: name,
      };
    }
    if (key) {
      params.enum_key = {
        type: "like",
        value: key,
      };
    }
    const dataRes = await mysql.getPage({
      pageNumber,
      pageSize,
      db: "enums",
      params,
      orderBy: "id",
      order: "desc",
    });
    if (!dataRes.isOk) {
      res.json({
        code: 400,
        msg: "获取失败",
        data: null,
      });
      return;
    }
    if (dataRes.data.list) {
      dataRes.data.list.forEach(item => {
        item.key = item.enum_key;
        delete item.enum_key;
        item.name = item.enum_name;
        delete item.enum_name;
      })
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
    if (sqlRes.data.length === 0) {
      res.json({
        code: 400,
        msg: "数据不存在",
      });
      return;
    }
    if (sqlRes.data) {
      sqlRes.data.forEach(item => {
        item.key = item.enum_key;
        delete item.enum_key;
        item.name = item.enum_name;
        delete item.enum_name;
      })
    }
    res.json({
      code: 200,
      data: sqlRes.data[0],
      msg: "成功",
    });
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
    const params = {};
    if (name) {
      params.enum_name = name;
    }
    if (key) {
      params.enum_key = key;
    }
    const sqlRes = await mysql.update({
      db: "enums",
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
      data: sqlRes.data,
      msg: "更新成功",
    });
  },
  // 删除
  delete: async (req, res) => {
    const { idList } = req.body;
    const sqlRes = await mysql.deleteBatch({
      db: "enums",
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
  // 获取子表列表
  getEnumList: async (req, res) => {
    const { enumId } = req.body;
    const sqlRes = await mysql.getList({
      db: "enum_items",
      params: {
        enum_id: {
          type: "=",
          value: enumId,
        },
      },
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
  // 获取子表详情
  getEnumDetail: async (req, res) => {
    const { id } = req.query;
    const sqlRes = await mysql.getDetail({
      db: "enum_items",
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
  // 新增子表
  createEnum: async (req, res) => {
    const { enumId, label, value } = req.body;
    const params = {};
    if (enumId) {
      params.enum_id = enumId;
    }
    if (label) {
      params.label = label;
    }
    if (value) {
      params.value = value;
    }
    const sqlRes = await mysql.insert({
      db: "enum_items",
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
  // 修改子表
  updateEnum: async (req, res) => {
    const { id, enumId, label, value } = req.body;
    const params = {};
    if (enumId) {
      params.enum_id = enumId;
    }
    if (label) {
      params.label = label;
    }
    if (value) {
      params.value = value;
    }
    const sqlRes = await mysql.update({
      db: "enum_items",
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
      data: sqlRes.data,
      msg: "更新成功",
    });
  },
  // 删除子表
  deleteEnum: async (req, res) => {
    const { idList } = req.body;
    const sqlRes = await mysql.deleteBatch({
      db: "enum_items",
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
};
