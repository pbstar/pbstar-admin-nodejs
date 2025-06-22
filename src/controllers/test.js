import { query } from "../db/mysql.js";

export default {
  // 查询
  getList: async (req, res) => {
    const { pageNumber, pageSize, name, age, sex } = req.body;
    const limit = pageSize || 10;
    const offset = (pageNumber - 1) * pageSize || 0;
    const sqls = [];
    const vals = [];

    // 查询条件
    if (name) {
      sqls.push(`name LIKE ?`);
      vals.push(`%${name}%`);
    }
    if (age) {
      sqls.push(`age = ?`);
      vals.push(age);
    }
    if (sex) {
      sqls.push(`sex = ?`);
      vals.push(sex);
    }

    // 查询总数
    const countSql = `SELECT COUNT(*) as total FROM test WHERE ${sqls.join(" AND ")}`;
    const countRes = await query(countSql, vals);

    // 查询分页数据
    const dataSql = `SELECT * FROM test WHERE ${sqls.join(" AND ")} LIMIT ? OFFSET ?`;
    const dataRes = await query(dataSql, [...vals, limit, offset]);

    res.json({
      code: 200,
      data: {
        list: dataRes.data,
        total: countRes.data[0].total,
        pageNumber,
        pageSize,
      },
      msg: "成功",
    });
  },
  // 详情
  getDetail: async (req, res) => {
    const { id } = req.query;
    const sql = `SELECT * FROM test WHERE id = ?`;
    const detailRes = await query(sql, [id]);

    if (detailRes.isOk && detailRes.data.length > 0) {
      res.json({
        code: 200,
        data: detailRes.data[0],
        msg: "成功",
      });
    } else {
      res.json({
        code: 400,
        msg: "测试数据不存在",
      });
    }
  },
  // 新增
  create: async (req, res) => {
    const { name, age, sex, ethnic, isHealthy, hobbyList } = req.body;
    const sql = `INSERT INTO test (name, age, sex, ethnic, is_healthy, hobby_list) VALUES (?, ?, ?, ?, ?, ?)`;
    const result = await query(sql, [
      name,
      age,
      sex,
      ethnic,
      isHealthy,
      JSON.stringify(hobbyList),
    ]);

    res.json({
      code: 200,
      data: result,
      msg: "创建成功",
    });
  },
  // 修改
  update: async (req, res) => {
    const { id, name, age, sex, ethnic, isHealthy, hobbyList } = req.body;
    const sql = `UPDATE test SET name = ?, age = ?, sex = ?, ethnic = ?, is_healthy = ?, hobby_list = ? WHERE id = ?`;
    const result = await query(sql, [
      name,
      age,
      sex,
      ethnic,
      isHealthy,
      JSON.stringify(hobbyList),
      id,
    ]);

    res.json({
      code: 200,
      data: result,
      msg: "更新成功",
    });
  },
  // 删除
  delete: async (req, res) => {
    const { idList } = req.body;
    const sql = `DELETE FROM test WHERE id IN (?)`;
    const result = await query(sql, [idList]);

    res.json({
      code: 200,
      data: result,
      msg: "删除成功",
    });
  },
  // 获取子表列表
  getEducationList: async (req, res) => {
    const { testId } = req.query;
    const sql = `SELECT * FROM test_education WHERE test_id = ?`;
    const result = await query(sql, [testId]);

    res.json({
      code: 200,
      data: result,
      msg: "成功",
    });
  },
  // 获取子表详情
  getEducationDetail: async (req, res) => {
    const { id } = req.query;
    const sql = `SELECT * FROM test_education WHERE id = ?`;
    const [result] = await query(sql, [id]);

    if (result) {
      res.json({
        code: 200,
        data: result,
        msg: "成功",
      });
    } else {
      res.json({
        code: 404,
        msg: "教育记录不存在",
      });
    }
  },
  // 新增子表
  createEducation: async (req, res) => {
    const { testId, eduName, dateRange, remark } = req.body;
    const sql = `INSERT INTO test_education (test_id, edu_name, date_range, remark) VALUES (?, ?, ?, ?)`;
    const result = await query(sql, [testId, eduName, dateRange, remark]);

    res.json({
      code: 200,
      data: result,
      msg: "创建成功",
    });
  },
  // 修改子表
  updateEducation: async (req, res) => {
    const { id, testId, eduName, dateRange, remark } = req.body;
    const sql = `UPDATE test_education SET test_id = ?, edu_name = ?, date_range = ?, remark = ? WHERE id = ?`;
    const result = await query(sql, [testId, eduName, dateRange, remark, id]);

    res.json({
      code: 200,
      data: result,
      msg: "更新成功",
    });
  },
  // 删除子表
  deleteEducation: async (req, res) => {
    const { idList } = req.body;
    const sql = `DELETE FROM test_education WHERE id IN (?)`;
    const result = await query(sql, [idList]);

    res.json({
      code: 200,
      data: result,
      msg: "删除成功",
    });
  },
};
