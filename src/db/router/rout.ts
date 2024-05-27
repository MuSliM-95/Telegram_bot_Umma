import  Router  from "express"
import { addressController } from "../controllers/addressController.js"
import upload from "../middlewares/upload.js"


const router = Router()

router.post("/address/:chatId",  upload.array("photo[]", 3),  addressController.postData) 
router.patch("/address/:chatId/:addressId",  upload.array("photo[]", 3),  addressController.updateAddress) 
router.get("/addresses/:jsonLocation",  addressController.getAddresses) 
router.get("/address/:addressId/:chatId?",  addressController.getClientInfo) 

export default router