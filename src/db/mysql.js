import mysql from "mysql2/promise";
import config from "./config.js";
import dayjs from "dayjs";

// 初始化数据库连接池，添加超时配置
const pool = mysql.createPool({
  ...config,
  acquireTimeout: 6000, // 连接超时时间6秒
  timeout: 6000, // 查询超时时间6秒
  reconnect: true, // 自动重连
  connectionLimit: 10, // 最大连接数
  queueLimit: 0, // 排队限制
});
// 执行SQL语句
const query = async (sql, params) => {
  try {
    const [rows, fields] = await pool.query(sql, params);
    if (Array.isArray(rows)) {
      rows.forEach((item) => {
        if (item.created_at) {
          item.created_at = dayjs(item.created_at).format(
            "YYYY-MM-DD HH:mm:ss",
          );
        }
        if (item.updated_at) {
          item.updated_at = dayjs(item.updated_at).format(
            "YYYY-MM-DD HH:mm:ss",
          );
        }
      });
    }
    return {
      isOk: true,
      data: rows,
      msg: "成功",
    };
  } catch (error) {
    console.log(error);
    return {
      isOk: false,
      data: [],
      msg: error.sqlMessage,
    };
  }
};
// 分页查询
const getPage = async ({
  pageNumber = 1,
  pageSize = 10,
  db = "",
  params = {},
  orderBy = "id",
  order = "desc",
}) => {
  if (!db) {
    return {
      isOk: false,
      data: {
        list: [],
        total: 0,
      },
      msg: "请输入表名",
    };
  }
  const limit = pageSize || 10;
  const offset = (pageNumber - 1) * pageSize || 0;
  let sqlList = `SELECT * FROM \`${db}\``;
  let sqlCount = `SELECT COUNT(*) as total FROM \`${db}\``;
  const labels = [];
  const values = [];
  if (params && Object.keys(params).length > 0) {
    Object.keys(params).forEach((key) => {
      if (params[key]) {
        if (params[key].type === "like") {
          labels.push(`\`${key}\` LIKE ?`);
          values.push(`%${params[key].value}%`);
        } else if (
          params[key].type === "between" &&
          Array.isArray(params[key].value) &&
          params[key].value.length === 2
        ) {
          labels.push(`\`${key}\` BETWEEN ? AND ?`);
          values.push(params[key].value[0]);
          values.push(params[key].value[1]);
        } else {
          labels.push(`\`${key}\` = ?`);
          values.push(params[key].value);
        }
      }
    });
  }
  if (labels.length > 0) {
    sqlList += ` WHERE ${labels.join(" AND ")}`;
    sqlCount += ` WHERE ${labels.join(" AND ")}`;
  }
  sqlList += ` ORDER BY \`${orderBy}\` ${order}`;
  sqlList += ` LIMIT ? OFFSET ?`;

  const countRes = await query(sqlCount, values);
  const listRes = await query(sqlList, [...values, limit, offset]);
  if (countRes.isOk) {
    return {
      isOk: true,
      data: {
        list: listRes.data,
        total: countRes.data[0].total,
      },
      msg: "成功",
    };
  } else {
    return {
      isOk: false,
      data: {
        list: [],
        total: 0,
      },
      msg: countRes.msg,
    };
  }
};
// 查询数据
const getList = async ({
  db = "",
  params = {},
  orderBy = "id",
  order = "desc",
}) => {
  if (!db) {
    return {
      isOk: false,
      data: [],
      msg: "请输入表名",
    };
  }
  let sqlList = `SELECT * FROM \`${db}\``;
  const labels = [];
  const values = [];
  if (params && Object.keys(params).length > 0) {
    Object.keys(params).forEach((key) => {
      if (params[key]) {
        if (params[key].type === "like") {
          labels.push(`\`${key}\` LIKE ?`);
          values.push(`%${params[key].value}%`);
        } else if (
          params[key].type === "between" &&
          Array.isArray(params[key].value) &&
          params[key].value.length === 2
        ) {
          labels.push(`\`${key}\` BETWEEN ? AND ?`);
          values.push(params[key].value[0]);
          values.push(params[key].value[1]);
        } else {
          labels.push(`\`${key}\` = ?`);
          values.push(params[key].value);
        }
      }
    });
  }
  if (labels.length > 0) {
    sqlList += ` WHERE ${labels.join(" AND ")}`;
  }
  sqlList += ` ORDER BY \`${orderBy}\` ${order}`;
  const listRes = await query(sqlList, [...values]);
  if (!listRes.isOk) {
    return {
      isOk: false,
      data: [],
      msg: listRes.msg,
    };
  }
  return {
    isOk: true,
    data: listRes.data,
    msg: "成功",
  };
};
// 查询详情
const getDetail = async ({ db = "", id = 0 }) => {
  if (!db) {
    return {
      isOk: false,
      data: [],
      msg: "请输入表名",
    };
  }
  if (!id) {
    return {
      isOk: false,
      data: [],
      msg: "请输入id",
    };
  }
  const sql = `SELECT * FROM \`${db}\` WHERE \`id\` = ?`;
  const res = await query(sql, [id]);
  if (res.isOk) {
    return {
      isOk: true,
      data: res.data,
      msg: "成功",
    };
  } else {
    return {
      isOk: false,
      data: [],
      msg: res.msg,
    };
  }
};
// 更新
const update = async ({ db = "", params = {}, id = 0 }) => {
  if (!db) {
    return {
      isOk: false,
      data: [],
      msg: "请输入表名",
    };
  }
  if (!id) {
    return {
      isOk: false,
      data: [],
      msg: "请输入id",
    };
  }
  let sql = `UPDATE \`${db}\` SET `;
  const updateParams = [];
  Object.keys(params).forEach((key) => {
    sql += `\`${key}\` = ?,`;
    updateParams.push(params[key]);
  });
  sql = sql.slice(0, -1);
  sql += ` WHERE \`id\` = ?`;
  updateParams.push(id);
  const res = await query(sql, updateParams);
  if (res.isOk) {
    return {
      isOk: true,
      data: [
        {
          id,
        },
      ],
      msg: "更新成功",
    };
  } else {
    return {
      isOk: false,
      data: [],
      msg: res.msg,
    };
  }
};
// 新增
const insert = async ({ db = "", params = {} }) => {
  if (!db) {
    return {
      isOk: false,
      data: [],
      msg: "请输入表名",
    };
  }
  const keys = Object.keys(params);
  const placeholders = keys.map(() => "?").join(",");
  const columns = keys.map((key) => `\`${key}\``).join(",");

  let sql = `INSERT INTO \`${db}\` (${columns}) VALUES (${placeholders})`;
  const insertParams = Object.values(params);

  const res = await query(sql, insertParams);
  if (res.isOk) {
    return {
      isOk: true,
      data: [
        {
          id: res.data.insertId,
        },
      ],
      msg: "新增成功",
    };
  } else {
    return {
      isOk: false,
      data: [],
      msg: res.msg,
    };
  }
};
//批量删除
const deleteBatch = async ({ db = "", idList = [] }) => {
  if (!db) {
    return {
      isOk: false,
      data: [],
      msg: "请输入表名",
    };
  }
  if (!idList.length) {
    return {
      isOk: false,
      data: [],
      msg: "请输入id",
    };
  }
  const idListStr = idList.join(",");
  let sql = `DELETE FROM \`${db}\` WHERE \`id\` IN (${idListStr})`;
  const res = await query(sql, idList);
  if (res.isOk) {
    return {
      isOk: true,
      data: idList,
      msg: "删除成功",
    };
  } else {
    return {
      isOk: false,
      data: [],
      msg: res.msg,
    };
  }
};
export default {
  query,
  getPage,
  getList,
  getDetail,
  update,
  insert,
  deleteBatch,
};
