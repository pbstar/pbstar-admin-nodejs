const create = (json) => {
  let dataStr = "";
  let searchStr = "";
  json.fields.forEach((field) => {
    if (!dataStr) dataStr = `${field.key}`;
    else dataStr += `, ${field.key}`;
    if (field.showIn.includes("search")) {
      if (!searchStr) searchStr = `${field.key}`;
      else searchStr += `, ${field.key}`;
    }
  });
  return `
import mysql from "../db/mysql.js";

export default {
  // 查询
    getList: async (req, res) => {
    const { pageNumber, pageSize, ${searchStr} } = req.body;
    const params = {};

    const dataRes = await mysql.getPage({
      pageNumber,
      pageSize,
      db: "${json.key}",
      params,
      orderBy: "id",
      order: "desc",
    });

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
      db: "${json.key}",
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
  // 新增
  create: async (req, res) => {
    const { ${dataStr} } = req.body;
    const params = {};
    if (${dataStr}) {
      ${dataStr
        .split(",")
        .map((item) => `params.${item} = ${item};`)
        .join("\n")}
    }
    const sqlRes = await mysql.insert({
      db: "${json.key}",
      params,
    });
    if (!sqlRes.isOk || sqlRes.data.length === 0) {
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
  // 修改
  update: async (req, res) => {
    const { id, ${dataStr} } = req.body;
    const params = {};
    if (${dataStr}) {
      ${dataStr
        .split(",")
        .map((item) => `params.${item} = ${item};`)
        .join("\n")}
    }
    const updateRes = await mysql.update({
      db: "${json.key}",
      params,
      id,
    });
    if (!updateRes.isOk || updateRes.data.length === 0) {
      res.json({
        code: 400,
        msg: "更新失败",
      });
      return;
    }
    res.json({
      code: 200,
      data: updateRes.data[0],
      msg: "更新成功",
    });
  },
  // 删除
  delete: async (req, res) => {
    const { idList } = req.body;
    const sqlRes = await mysql.deleteBatch({
      db: "${json.key}",
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
  `;
};
export default create;
