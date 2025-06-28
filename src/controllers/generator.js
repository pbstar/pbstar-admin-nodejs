import mainCreate from "./handle/generator/main/index.js";
import childTableCreate from "./handle/generator/childTable/index.js";
import formTableCreate from "./handle/generator/formTable/index.js";
export default {
  toCreate: async (req, res) => {
    const jsonData = req.body;
    const cRes = {
      code: 200,
      msg: "生成成功",
      data: [],
    };
    if (jsonData.template === "main") {
      cRes.data = await mainCreate(jsonData);
    } else if (jsonData.template === "childTable") {
      cRes.data = await childTableCreate(jsonData);
    } else if (jsonData.template === "formTable") {
      cRes.data = await formTableCreate(jsonData);
    } else {
      cRes.code = 400;
      cRes.msg = "模板不存在";
    }
    res.json(cRes);
  },
};
