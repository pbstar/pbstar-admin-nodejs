import mysql from "../db/mysql.js";

export default {
  // 查询
  getList: async (req, res) => {
    const { pageNumber, pageSize, name, age, sex } = req.body;
    const params = {};
    // 查询条件
    if (name) {
      params.name = {
        type: "like",
        value: name,
      };
    }
    if (age) {
      params.age = {
        type: "=",
        value: age,
      };
    }
    if (sex) {
      params.sex = {
        type: "=",
        value: sex,
      };
    }

    const dataRes = await mysql.getPage({
      pageNumber,
      pageSize,
      db: "example_persons",
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
      db: "example_persons",
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
    if (sqlRes.data[0].hobby_json) {
      sqlRes.data[0].hobby_json = JSON.parse(sqlRes.data[0].hobby_json);
    }
    res.json({
      code: 200,
      data: sqlRes.data[0],
      msg: "成功",
    });
  },
  // 新增
  create: async (req, res) => {
    const { name, age, sex, ethnic, isHealthy, hobbyList } = req.body;
    const params = {
      name,
      age,
      sex,
      ethnic,
      is_healthy: isHealthy,
      hobby_json: JSON.stringify(hobbyList),
    };
    const sqlRes = await mysql.insert({
      db: "example_persons",
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
      params.hobby_json = JSON.stringify(hobbyList);
    }
    const updateRes = await mysql.update({
      db: "example_persons",
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
      db: "example_persons",
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
  getEducationList: async (req, res) => {
    const { personId } = req.body;
    if (!personId) {
      res.json({
        code: 400,
        msg: "请输入personId",
      });
      return;
    }
    const sqlRes = await mysql.getList({
      db: "example_person_edus",
      params: {
        person_id: personId,
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
  getEducationDetail: async (req, res) => {
    const { id } = req.query;
    const sqlRes = await mysql.getDetail({
      db: "example_person_edus",
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
  createEducation: async (req, res) => {
    const { personId, eduName, dateRange, remark } = req.body;
    const params = {
      person_id: personId,
      name: eduName,
      remark,
    }
    if (dateRange && dateRange.length === 2) {
      params.date_start = dateRange[0];
      params.date_end = dateRange[1];
    }
    const sqlRes = await mysql.insert({
      db: "example_person_edus",
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
  updateEducation: async (req, res) => {
    const { id, personId, eduName, dateRange, remark } = req.body;
    const params = {};
    if (personId) {
      params.person_id = personId;
    }
    if (eduName) {
      params.name = eduName;
    }
    if (dateRange && dateRange.length === 2) {
      params.date_start = dateRange[0];
      params.date_end = dateRange[1];
    }
    if (remark) {
      params.remark = remark;
    }
    const sqlRes = await mysql.update({
      db: "example_person_edus",
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
  // 删除子表
  deleteEducation: async (req, res) => {
    const { idList } = req.body;
    const sqlRes = await mysql.deleteBatch({
      db: "example_person_edus",
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
