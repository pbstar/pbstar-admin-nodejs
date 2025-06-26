import mysql from "../db/mysql.js";

export default {
  // 获取所有角色列表
  getAllList: async (req, res) => {
    const sqlRes = await mysql.getList({
      db: "roles",
    });
    if (!sqlRes.isOk) {
      res.json({
        code: 400,
        msg: "获取失败",
        data: []
      });
      return;
    }
    res.json({
      code: 200,
      data: sqlRes.data,
      msg: "成功",
    });
  },
  // 获取角色列表
  getList: async (req, res) => {
    const { pageNumber, pageSize, name, key } = req.body;
    const params = {};
    if (name) {
      params.name = {
        type: "like",
        value: name,
      };
    }
    if (key) {
      params.role_key = {
        type: "like",
        value: key,
      };
    }
    const sqlRes = await mysql.getPage({
      pageNumber,
      pageSize,
      db: "roles",
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
    if (sqlRes.data.list) {
      sqlRes.data.list.forEach(item => {
        item.key = item.role_key;
        delete item.role_key;
      })
    }

    res.json({
      code: 200,
      data: sqlRes.data,
      msg: "成功",
    });
  },

  // 获取角色详情
  getDetail: async (req, res) => {
    const { id } = req.query;
    const sqlRes = await mysql.getDetail({
      db: "roles",
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
        item.key = item.role_key;
        delete item.role_key;
      })
    }
    res.json({
      code: 200,
      data: sqlRes.data[0],
      msg: "成功",
    });
  },

  // 创建角色
  create: async (req, res) => {
    const { name, key, navs, btns, remark } = req.body;
    const sqlRes = await mysql.insert({
      db: "roles",
      params: {
        name,
        role_key: key,
        navs,
        btns,
        remark
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
      data: sqlRes.data[0],
      msg: "创建成功",
    });
  },

  // 更新角色
  update: async (req, res) => {
    const { id, name, key, navs, btns, remark } = req.body;
    const params = {};
    if (name) {
      params.name = name;
    }
    if (key) {
      params.role_key = key;
    }
    if (navs) {
      params.navs = navs;
    }
    if (btns) {
      params.btns = btns;
    }
    if (remark) {
      params.remark = remark;
    }
    const sqlRes = await mysql.update({
      db: "roles",
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

  // 删除角色
  delete: async (req, res) => {
    const { idList } = req.body;
    const sqlRes = await mysql.deleteBatch({
      db: "roles",
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
