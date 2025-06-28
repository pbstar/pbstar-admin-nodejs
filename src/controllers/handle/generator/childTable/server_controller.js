const create = (json) => {
  const key = json.childKey.charAt(0).toUpperCase() + json.childKey.slice(1);
  let dataStr = "";
  json.fields.forEach((field) => {
    if (!dataStr) dataStr = `${field.key}`;
    else dataStr += `, ${field.key}`;
  });
  return `
import mysql from "../db/mysql.js";

export default {
  // 获取子表列表
  get${key}List: async (req, res) => {
    const { ${json.key}Id } = req.body;
    if (!${json.key}Id) {
      res.json({
        code: 400,
        msg: "请输入${json.key}Id",
      });
      return;
    }
    const sqlRes = await mysql.getList({
      db: "${json.childKey}",
      params: {
        ${json.key}_id: {
          type: "=",
          value: ${json.key}Id,
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
  // 详情
  get${key}Detail: async (req, res) => {
    const { id } = req.query;
    const sqlRes = await mysql.getDetail({
      db: "${json.childKey}",
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
  create${key}: async (req, res) => {
    const { ${json.key}Id, ${dataStr} } = req.body;
    if (!${json.key}Id) {
      res.json({
        code: 400,
        msg: "请输入${json.key}Id",
      });
      return;
    }
    const params = {};
    params.${json.key}_id = ${json.key}Id;
    if (${dataStr}) {
      ${dataStr
        .split(",")
        .map((item) => `params.${item} = ${item};`)
        .join("\n")}
    }
    const sqlRes = await mysql.insert({
      db: "${json.childKey}",
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
  // 修改子表
  update${key}: async (req, res) => {
    const { id, ${json.key}Id, ${dataStr} } = req.body;
    if (!id) {
      res.json({
        code: 400,
        msg: "请输入id",
      });
      return;
    }
    if (!${json.key}Id) {
      res.json({
        code: 400,
        msg: "请输入${json.key}Id",
      });
      return;
    }
    const params = {};
    params.${json.key}_id = ${json.key}Id;
    if (${dataStr}) {
      ${dataStr
        .split(",")
        .map((item) => `params.${item} = ${item};`)
        .join("\n")}
    }
    const updateRes = await mysql.update({
      db: "${json.childKey}",
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
  delete${key}: async (req, res) => {
    const { idList } = req.body;
    const sqlRes = await mysql.deleteBatch({
      db: "${json.childKey}",
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
