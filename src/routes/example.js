import { Router } from "express";
import testController from "../controllers/test.js";

const router = Router();

router.post("/test/getList", testController.getList);
router.get("/test/getDetail", testController.getDetail);
router.post("/test/create", testController.create);
router.post("/test/update", testController.update);
router.post("/test/delete", testController.delete);
router.post("/test/getEducationList", testController.getEducationList);
router.get("/test/getEducationDetail", testController.getEducationDetail);
router.post("/test/createEducation", testController.createEducation);
router.post("/test/updateEducation", testController.updateEducation);
router.post("/test/deleteEducation", testController.deleteEducation);

export default router;
