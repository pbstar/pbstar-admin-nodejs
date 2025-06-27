import prettier from "prettier";
import listCreate from "./list.js";
import detailCreate from "./detail.js";
import s_routeCreate from "./server_route.js";
import s_controllerCreate from "./server_controller.js";
import sqlCreate from "./sql.js";

const create = async (jsonData) => {
  const arr = [];
  // 列表
  const listCode = await prettier.format(listCreate(jsonData), {
    parser: "vue",
  });
  arr.push({
    fileName: `${jsonData.key}.vue`,
    fileCode: listCode,
    fileType: "vue",
  });
  // 详情
  const detailCode = await prettier.format(detailCreate(jsonData), {
    parser: "vue",
  });
  arr.push({
    fileName: `${jsonData.key}_detail.vue`,
    fileCode: detailCode,
    fileType: "vue",
  });
  // 服务端路由
  const s_routeCode = await prettier.format(s_routeCreate(jsonData), {
    parser: "espree",
  });
  arr.push({
    fileName: `${jsonData.key}_s_route.js`,
    fileCode: s_routeCode,
    fileType: "js",
  });
  // 服务端控制器
  const s_controllerCode = await prettier.format(s_controllerCreate(jsonData), {
    parser: "espree",
  });
  arr.push({
    fileName: `${jsonData.key}_s_controller.js`,
    fileCode: s_controllerCode,
    fileType: "js",
  });
  // 数据库脚本
  const sqlCode = await prettier.format(sqlCreate(jsonData), {
    parser: "espree",
  });
  arr.push({
    fileName: `${jsonData.key}.sql`,
    fileCode: sqlCode,
    fileType: "sql",
  });
  return arr;
};
export default create;
