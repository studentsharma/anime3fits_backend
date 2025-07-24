import express from "express";
import Verify from "../middlewares/auth.middleware.js";
import {register_user, login, logout, addCart, removeCart, getCart, authme, already_present} from "../controllers/user.controller.js"
import { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { Response } from "express";

const router = express.Router();

router.post("/register_user", register_user)
router.post("/login", login)
router.post("/logout",Verify, logout)
router.post("/add_cart", Verify , addCart)
router.post("/remove_cart", Verify, removeCart)
router.post("/get_cart", Verify, getCart)
router.post("/already_cart", Verify, already_present)
router.post("/home", Verify, authme);


export default router;