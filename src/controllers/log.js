import mysql from "../db/mysql.js";
import dayjs from "dayjs";

export default {
  // 获取操作日志列表
  getList: async (req, res) => {
    const { pageNumber, pageSize, userName, createTime } = req.body;
    const params = {};
    if (userName) {
      params.user_name = {
        type: "like",
        value: userName,
      };
    }
    if (createTime) {
      params.created_at = {
        type: "between",
        value: createTime,
      };
    }

    const dataRes = await mysql.getPage({
      pageNumber,
      pageSize,
      db: "logs",
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

    if (dataRes.data && dataRes.data.list) {
      dataRes.data.list.forEach((item) => {
        item.userName = item.user_name;
        delete item.user_name;
        item.createTime = item.created_at;
        delete item.created_at;
      });
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
      db: "logs",
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
    if (sqlRes.data[0].user_name) {
      sqlRes.data[0].userName = sqlRes.data[0].user_name;
      delete sqlRes.data[0].user_name;
      sqlRes.data[0].createTime = dayjs(sqlRes.data[0].created_at).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      delete sqlRes.data[0].created_at;
    }
    res.json({
      code: 200,
      data: sqlRes.data[0],
      msg: "成功",
    });
  },
  // 删除
  delete: async (req, res) => {
    const { idList } = req.body;
    const sqlRes = await mysql.deleteBatch({
      db: "logs",
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
