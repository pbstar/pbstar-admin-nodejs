import { Router } from "express";
import generatorController from "../controllers/generator.js";
import enumController from "../controllers/enum.js";
import navController from "../controllers/nav.js";
import userController from "../controllers/user.js";
import roleController from "../controllers/role.js";
import logController from "../controllers/log.js";
import appController from "../controllers/app.js";

const router = Router();

// 代码生成器
router.post("/generator", generatorController.toCreate);

// 枚举管理
router.post("/enum/getList", enumController.getList);
router.post("/enum/delete", enumController.delete);
router.post("/enum/create", enumController.create);
router.post("/enum/update", enumController.update);
router.get("/enum/getDetail", enumController.getDetail);
router.post("/enum/getEnumList", enumController.getEnumList);
router.get("/enum/getEnumDetail", enumController.getEnumDetail);
router.post("/enum/createEnum", enumController.createEnum);
router.post("/enum/updateEnum", enumController.updateEnum);
router.post("/enum/deleteEnum", enumController.deleteEnum);

// 导航管理
router.post("/nav/getList", navController.getList);
router.post("/nav/delete", navController.delete);
router.post("/nav/create", navController.create);
router.post("/nav/update", navController.update);
router.get("/nav/getDetail", navController.getDetail);

// 用户管理
router.post("/user/getList", userController.getList);
router.post("/user/delete", userController.delete);
router.post("/user/create", userController.create);
router.post("/user/update", userController.update);
router.get("/user/getDetail", userController.getDetail);

// 角色管理
router.get("/role/getAllList", roleController.getAllList);
router.post("/role/getList", roleController.getList);
router.post("/role/delete", roleController.delete);
router.post("/role/create", roleController.create);
router.post("/role/update", roleController.update);
router.get("/role/getDetail", roleController.getDetail);

// 操作日志
router.post("/log/getList", logController.getList);
router.post("/log/delete", logController.delete);
router.get("/log/getDetail", logController.getDetail);

// 应用管理
router.post("/app/getList", appController.getList);
router.post("/app/delete", appController.delete);
router.post("/app/create", appController.create);
router.post("/app/update", appController.update);
router.get("/app/getDetail", appController.getDetail);

export default router;
