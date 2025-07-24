import express from "express";
import upload_product from "../controllers/admin.contorller.js";
import { upload } from "../middlewares/multer.middleware.js"

const router = express.Router();

router.post("/upload", upload.single('image'),upload_product)

export default router;