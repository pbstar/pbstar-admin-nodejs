import mysql from "mysql2/promise";
import config from "./config.js";
import dayjs from "dayjs";

// 初始化数据库连接池
const pool = mysql.createPool(config);

// 执行SQL查询
export const query = async (sql, params) => {
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
