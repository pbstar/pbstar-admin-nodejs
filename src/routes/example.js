import { Router } from "express";
import personController from "../controllers/person.js";

const router = Router();

router.post("/person/getList", personController.getList);
router.get("/person/getDetail", personController.getDetail);
router.post("/person/create", personController.create);
router.post("/person/update", personController.update);
router.post("/person/delete", personController.delete);
router.post("/person/getEducationList", personController.getEducationList);
router.get("/person/getEducationDetail", personController.getEducationDetail);
router.post("/person/createEducation", personController.createEducation);
router.post("/person/updateEducation", personController.updateEducation);
router.post("/person/deleteEducation", personController.deleteEducation);

export default router;
