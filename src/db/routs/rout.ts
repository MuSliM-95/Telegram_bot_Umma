import  Router  from "express"
import { addressController } from "../controllers/addressController.js"
import upload from "../middleWares/upload.js"

const router = Router()

router.post("/data/:chatId",  upload.single("photo"),  addressController.postData) 
router.get("/addresses/:jsonLocation",   addressController.getAddresses) 
router.get("/getAddress/botChat/:chatId/:addressId",   addressController.getClientInfo) 

export default router 