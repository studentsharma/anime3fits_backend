import express from "express";
import { get_products } from "../controllers/global.controller.js";

const router = express.Router();

router.post("/get_products", get_products);

export default router;