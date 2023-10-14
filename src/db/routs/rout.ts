import  Router  from "express"
import { dataController } from "../controllers/controllers.js"
import upload from "../middleWares/upload.js"

const router = Router()

router.post("/data",  upload.single("photo"),  dataController.postData) 
router.get("/admin/info",   dataController.getAdminInfo) 
router.get("/addresses/:jsonLocation",   dataController.getAddresses) 

export default router  