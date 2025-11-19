import mysql from "../db/mysql.js";

export default {
  getMyAppList: async (req, res) => {
    if (!req.userId) {
      return res.json({
        code: 401,
        msg: "未登录",
      });
    }

    // 获取用户信息
    const userSql = `SELECT * FROM users WHERE id = ?`;
    const uSqlRes = await mysql.query(userSql, [req.userId]);
    if (!uSqlRes.isOk || uSqlRes.data.length == 0) {
      return res.json({
        code: 401,
        msg: "用户不存在",
      });
    }

    const role = uSqlRes.data[0].role;
    if (!role) {
      return res.json({
        code: 401,
        msg: "用户角色不存在",
      });
    }

    // 获取角色信息
    const roleSql = `SELECT * FROM roles WHERE role_key = ?`;
    const rSqlRes = await mysql.query(roleSql, [role]);

    if (!rSqlRes.isOk || rSqlRes.data.length == 0) {
      return res.json({
        code: 401,
        msg: "角色不存在",
      });
    }

    const navs = rSqlRes.data[0].navs ? rSqlRes.data[0].navs.split(",") : [];
    const [nSqlRes, aSqlRes] = await Promise.all([
      mysql.query(`SELECT * FROM navs`),
      mysql.query(`SELECT * FROM apps`),
    ]);

    if (!nSqlRes.isOk || !aSqlRes.isOk) {
      return res.json({
        code: 400,
        msg: "获取数据失败",
      });
    }

    let myNavList = [];
    const appList = [];

    if (navs.length == 0) {
      return res.json({
        code: 401,
        msg: "请配置角色权限",
      });
    } else if (navs.includes("all")) {
      myNavList = nSqlRes.data;
    } else {
      myNavList = nSqlRes.data.filter((item) =>
        navs.includes(item.id.toString())
      );
    }

    // 使用Set优化查找性能
    const appSet = new Set();
    myNavList.forEach((item) => {
      const app = aSqlRes.data.find((app) => app.id === item.app_id);
      if (app && !appSet.has(app.id)) {
        appSet.add(app.id);
        appList.push(app);
      }
    });

    res.json({
      code: 200,
      data: appList,
      msg: "成功",
    });
  },
  getMyNavListByAppId: async (req, res) => {
    if (!req.userId) {
      return res.json({
        code: 401,
        msg: "未登录",
      });
    }

    // 获取用户信息
    const userSql = `SELECT * FROM users WHERE id = ?`;
    const uSqlRes = await mysql.query(userSql, [req.userId]);
    if (!uSqlRes.isOk || uSqlRes.data.length === 0) {
      return res.json({
        code: 401,
        msg: "用户不存在",
      });
    }

    const role = uSqlRes.data[0].role;
    if (!role) {
      return res.json({
        code: 401,
        msg: "用户角色不存在",
      });
    }

    // 获取角色信息
    const roleSql = `SELECT * FROM roles WHERE role_key = ?`;
    const rSqlRes = await mysql.query(roleSql, [role]);

    if (!rSqlRes.isOk || rSqlRes.data.length == 0) {
      return res.json({
        code: 401,
        msg: "角色不存在",
      });
    }

    const navs = rSqlRes.data[0].navs ? rSqlRes.data[0].navs.split(",") : [];
    const nSqlRes = await mysql.query(`SELECT * FROM navs WHERE app_id = ?`, [
      req.query.appId,
    ]);
    let myNavList = [];
    const nSqlResData = (nSqlRes.data || []).sort((a, b) => a.index - b.index);

    if (navs.length == 0) {
      return res.json({
        code: 401,
        msg: "请配置角色菜单权限",
      });
    } else if (navs.includes("all")) {
      myNavList = nSqlResData;
    } else {
      myNavList = nSqlResData.filter((item) =>
        navs.includes(item.id.toString())
      );
    }

    res.json({
      code: 200,
      data: myNavList,
      msg: "成功",
    });
  },
  // 查询
  getList: async (req, res) => {
    const { name, url, appId } = req.body;
    const params = {};
    if (name) {
      params.name = {
        type: "like",
        value: name,
      };
    }
    if (url) {
      params.url = {
        type: "like",
        value: url,
      };
    }
    if (appId) {
      params.app_id = {
        type: "=",
        value: appId,
      };
    }
    const sqlRes = await mysql.getList({
      db: "navs",
      params,
      order: "asc",
    });
    if (!sqlRes.isOk) {
      res.json({
        code: 400,
        msg: "获取失败",
        data: null,
      });
      return;
    }
    if (sqlRes.data) {
      sqlRes.data.forEach((item) => {
        delete item.btn_json;
        item.parentId = item.parent_id;
        delete item.parent_id;
        item.appId = item.app_id;
        delete item.app_id;
        item.isNav = item.is_nav;
        delete item.is_nav;
      });
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
      db: "navs",
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
    if (sqlRes.data) {
      sqlRes.data.forEach((item) => {
        item.parentId = item.parent_id;
        delete item.parent_id;
        item.appId = item.app_id;
        delete item.app_id;
        item.isNav = item.is_nav;
        delete item.is_nav;
        item.btnList = [];
        if (item.btn_json) {
          item.btnList = JSON.parse(item.btn_json);
        }
        delete item.btn_json;
      });
    }
    res.json({
      code: 200,
      data: sqlRes.data[0],
      msg: "成功",
    });
  },
  // 新增
  create: async (req, res) => {
    const { name, url, parentId, icon, isNav, index, appId, remark, btnList } =
      req.body;
    const sqlRes = await mysql.insert({
      db: "navs",
      params: {
        name,
        url,
        parent_id: parentId,
        icon,
        is_nav: isNav,
        app_id: appId,
        index,
        remark,
        btn_json: JSON.stringify(btnList),
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
    const {
      id,
      name,
      url,
      parentId,
      icon,
      isNav,
      index,
      appId,
      remark,
      btnList,
    } = req.body;
    const params = {};
    if (name !== undefined) {
      params.name = name;
    }
    if (url !== undefined) {
      params.url = url;
    }
    if (parentId !== undefined) {
      params.parent_id = parentId;
    }
    if (icon !== undefined) {
      params.icon = icon;
    }
    if (isNav !== undefined) {
      params.is_nav = isNav;
    }
    if (index !== undefined) {
      params.index = index;
    }
    if (appId !== undefined) {
      params.app_id = appId;
    }
    if (remark !== undefined) {
      params.remark = remark;
    }
    if (btnList !== undefined) {
      params.btn_json = JSON.stringify(btnList);
    }
    const sqlRes = await mysql.update({
      db: "navs",
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
      db: "navs",
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
  // 获取按钮列表
  getBtnList: async (req, res) => {
    const sqlRes = await mysql.query(`SELECT * FROM navs`);
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
    const btnList = [];
    if (sqlRes.data) {
      sqlRes.data.forEach((item) => {
        if (item.btn_json) {
          const arr = JSON.parse(item.btn_json);
          btnList.push({
            parentId: "",
            label: item.name,
            value: item.id.toString(),
          });
          arr.forEach((btn) => {
            btnList.push({
              parentId: item.id.toString(),
              label: btn.name,
              value: btn.key,
            });
          });
        }
      });
    }
    res.json({
      code: 200,
      data: btnList,
      msg: "成功",
    });
  },
};
