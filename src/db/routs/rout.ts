import  Router  from "express"
import { addressController } from "../controllers/addressController.js"
import upload from "../middleWares/upload.js"

const router = Router()

router.post("/dat
a",  upload.single("photo"),  addressController.postData) 
router.get("/addresses/:jsonLocation",   addressController.getAddresses) 
export default router  