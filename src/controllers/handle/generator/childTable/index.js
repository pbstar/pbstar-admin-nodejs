import prettier from "prettier";
import childTableCreate from "./childTable.js";
import s_routeCreate from "./server_route.js";
import s_controllerCreate from "./server_controller.js";
import sqlCreate from "./sql.js";
const create = async (jsonData) => {
  const arr = [];
  // 子表
  const formattedCode = await prettier.format(childTableCreate(jsonData), {
    parser: "vue",
  });
  arr.push({
    fileName: `${jsonData.childKey}.vue`,
    fileCode: formattedCode,
    fileType: "vue",
  });
  // 服务端路由
  const s_routeCode = await prettier.format(s_routeCreate(jsonData), {
    parser: "espree",
  });
  arr.push({
    fileName: `${jsonData.childKey}_s_route.js`,
    fileCode: s_routeCode,
    fileType: "js",
  });
  // 服务端控制器
  const s_controllerCode = await prettier.format(s_controllerCreate(jsonData), {
    parser: "espree",
  });
  arr.push({
    fileName: `${jsonData.childKey}_s_controller.js`,
    fileCode: s_controllerCode,
    fileType: "js",
  });
  // 数据库脚本
  const sqlCode = await prettier.format(sqlCreate(jsonData), {
    parser: "espree",
  });
  arr.push({
    fileName: `${jsonData.childKey}.sql`,
    fileCode: sqlCode,
    fileType: "sql",
  });
  return arr;
};
export default create;
