import prettier from "prettier";
import formTableCreate from "./formTable.js";
const create = async (jsonData) => {
  const arr = [];
  // 表单表格
  const formattedCode = await prettier.format(formTableCreate(jsonData), {
    parser: "vue",
  });
  arr.push({
    fileName: `${jsonData.childKey}.vue`,
    fileCode: formattedCode,
    fileType: "vue",
  });
  return arr;
};
export default create;
