import { query, getPage } from "../db/mysql.js";

export default {
  // 查询
  getList: async (req, res) => {
    const { pageNumber, pageSize, name, age, sex } = req.body;
    const pageObj = {
      pageNumber,
      pageSize,
      db: "example_persons",
      params: {},
      orderBy: "id",
      order: "desc",
    };
    // 查询条件
    if (name) {
      pageObj.params.name = {
        type: "like",
        value: name,
      };
    }
    if (age) {
      pageObj.params.age = {
        type: "=",
        value: age,
      };
    }
    if (sex) {
      pageObj.params.sex = {
        type: "=",
        value: sex,
      };
    }

    const dataRes = await getPage(pageObj);

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
    const sql = `SELECT * FROM example_persons WHERE id = ?`;
    const detailRes = await query(sql, [id]);

    if (detailRes.isOk && detailRes.data.length > 0) {
      res.json({
        code: 200,
        data: detailRes.data[0],
        msg: "成功",
      });
    } else {
      res.json({
        code: 404,
        msg: "测试数据不存在",
      });
    }
  },
  // 新增
  create: async (req, res) => {
    const { name, age, sex, ethnic, isHealthy, hobbyList } = req.body;
    const sql = `INSERT INTO example_persons (name, age, sex, ethnic, is_healthy, hobby_list) VALUES (?, ?, ?, ?, ?, ?)`;
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
      data: result.data[0],
      msg: "创建成功",
    });
  },
  // 修改
  update: async (req, res) => {
    const { id, name, age, sex, ethnic, isHealthy, hobbyList } = req.body;
    const params = {};
    if (name) {
      params.name = name;
    }
    if (age) {
      params.age = age;
    }
    if (sex) {
      params.sex = sex;
    }
    if (ethnic) {
      params.ethnic = ethnic;
    }
    if (isHealthy) {
      params.is_healthy = isHealthy;
    }
    if (hobbyList) {
      console.log(hobbyList);

    }
    const updateRes = await update({
      db: "example_persons",
      params,
      id,
    });
    if (updateRes.isOk) {
      res.json({
        code: 200,
        data: updateRes.data[0],
        msg: "更新成功",
      });
    } else {
      res.json({
        code: 400,
        msg: updateRes.msg,
      });
    }
  },
  // 删除
  delete: async (req, res) => {
    const { idList } = req.body;
    const sql = `DELETE FROM example_persons WHERE id IN (?)`;
    const result = await query(sql, [idList]);

    res.json({
      code: 200,
      data: result.data[0],
      msg: "删除成功",
    });
  },
  // 获取子表列表
  getEducationList: async (req, res) => {
    const { testId } = req.body;
    const sql = `SELECT * FROM example_person_edus WHERE person_id = ?`;
    const result = await query(sql, [testId]);

    res.json({
      code: 200,
      data: result.data,
      msg: "成功",
    });
  },
  // 获取子表详情
  getEducationDetail: async (req, res) => {
    const { id } = req.query;
    const sql = `SELECT * FROM example_person_edus WHERE id = ?`;
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
    const sql = `INSERT INTO example_person_edus (person_id, edu_name, date_range, remark) VALUES (?, ?, ?, ?)`;
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
    const sql = `UPDATE example_person_edus SET person_id = ?, edu_name = ?, date_range = ?, remark = ? WHERE id = ?`;
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
    const sql = `DELETE FROM example_person_edus WHERE id IN (?)`;
    const result = await query(sql, [idList]);

    res.json({
      code: 200,
      data: result,
      msg: "删除成功",
    });
  },
};
