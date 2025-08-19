import mysql from "../db/mysql.js";

export default {
  // 查询
  getList: async (req, res) => {
    const { name, key, group } = req.body;
    const params = {};
    if (name) {
      params.name = {
        type: "like",
        value: name,
      };
    }
    if (key) {
      params.key = {
        type: "like",
        value: key,
      };
    }
    if (group) {
      params.group = {
        type: "like",
        value: group,
      };
    }
    const sqlRes = await mysql.getList({
      db: "apps",
      params,
    });
    if (!sqlRes.isOk) {
      res.json({
        code: 400,
        msg: "获取失败",
        data: null,
      });
      return;
    }
    res.json({
      code: 200,
      data: sqlRes.data,
      msg: "成功",
    });
  },
  // 详情
  getDetail: async (req, res) => {
    const { id } = req.query;
    const sqlRes = await mysql.getDetail({
      db: "apps",
      id,
    });
    if (!sqlRes.isOk) {
      res.json({
        code: 400,
        msg: "获取失败",
        data: null,
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
  // 新增
  create: async (req, res) => {
    const { name, key, group, icon } = req.body;
    const sqlRes = await mysql.insert({
      db: "apps",
      params: {
        name,
        key,
        group,
        icon,
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
    const { id, name, key, group, icon } = req.body;
    const params = {};
    if (name) {
      params.name = name;
    }
    if (key) {
      params.key = key;
    }
    if (group) {
      params.group = group;
    }
    if (icon) {
      params.icon = icon;
    }
    const sqlRes = await mysql.update({
      db: "apps",
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
      db: "apps",
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
