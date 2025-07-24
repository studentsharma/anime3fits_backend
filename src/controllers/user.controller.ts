import { Request, Response } from "express";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js"
import cartModel from "../models/cart.model.js"
import productModel from "../models/products.model.js"
import { AuthenticatedRequest } from "../middlewares/auth.middleware.js";


interface userType {
    name: string,
    email: string,
    password: string,
    mobile: number
}

interface loginType {
    email: string,
    password: string
}

interface logoutType {
    email: string,
}

interface cartType {
    id : number,
    email: string,
    name: string,
    size: string,
    quantity: number,
    url: string
}

interface removecartType {
    email: string,
    name: string,
    size: string,
    quantity: number,
    url: string
}

type UserRequest = Request<{}, {}, userType>;
type loginRequest = Request<{}, {}, loginType>;
type logoutRequest = Request<{}, {}, logoutType>;
type cartRequest = Request<{}, {}, cartType>;
type removecartRequest = Request<{}, {}, removecartType>;

const register_user = async (req: UserRequest, res: Response): Promise<void> => {
    try {
        const { name, email, password, mobile } = req.body;
        // console.log(email)
        const hash_password = await bcrypt.hash(password, 10);

        const cart = await cartModel.create({
            email
        })

        const user = await userModel.create({
            name,
            email,
            password: hash_password,
            mobile
        })

        const token = jwt.sign(
            { email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: "24h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000
        });

        console.log("user registered : ", user);
        res.status(201).json({ message: "registration successful" })

    }
    catch (err: any) {
        console.log('error in registration of user ', err.message)
        res.status(501).json({ message: "unable to register" });
    }
}

const login = async (req: loginRequest, res: Response): Promise<Response> => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const decoded = await bcrypt.compare(password, user.password);

        if (!decoded) {
            return res.status(401).json({ message: "wrong credentials" });
        }

        const token = jwt.sign(
            { email: user.email},
            process.env.JWT_SECRET!,
            { expiresIn: "24h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000
        });


        return res.status(200).json({ message: "login successful",token,name : user.name, email : user.email });
    }
    catch (err: any) {
        console.log("error while login ", err.message);
        return res.status(501).json({ message: "login issue" });
    }
}

const logout = async (req: logoutRequest, res: Response): Promise<Response> => {
    try {

        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "none"
        });

        return res.status(200).json({ message: "logout successful" });
    }
    catch (err: any) {
        console.log("error while login ", err.message);
        return res.status(501).json({ message: "logout issue" });
    }
}

const addCart = async (req: cartRequest, res: Response): Promise<Response> => {
    try {
        const { id, name, email, size, quantity, url } = req.body;
        const cart = await cartModel.findOne({ email });
        const product = await productModel.findOne({pro_id : id});
        console.log( "product price ", product?.price )
        if (!cart) return res.status(404).json({ message: "no cart found" });
        if (!product) return res.status(404).json({ message: "no product found" });
        cart.products.push({
            id,
            product_name: name,
            size,
            quantity,
            image: url,
            price : product?.price - product?.discount

        })
        await cart.save();
        return res.status(201).json({ message: "successfully cart added" })
    }
    catch (err: any) {
        console.log("error in add cart", err.message)
        return res.status(500).json({ message: "unable to add item into cart" })
    }
}

const removeCart = async (req: removecartRequest, res: Response): Promise<Response> => {
    try {
        const { name, email } = req.body;
        console.log("accessing remove cart",email)
        const cart = await cartModel.findOne({ email });
        if (!cart) return res.status(404).json({ message: "no cart found" });
        await cartModel.updateOne({ email }, {
            $pull: {
                products: { product_name: name },
            }
        })
        return res.status(201).json({ message: "successfully remove from cart" })
    }
    catch (err: any) {
        console.log("error in removing cart", err.message)
        return res.status(500).json({ message: "unable to remove item from cart" })
    }
}

const getCart = async (req : any, res : Response) => {
    try{
        const email = req.user?.email;
        console.log("accessing get carts : ",email)
        const cart = await cartModel.findOne({email});
        res.status(200).json(cart);
    }
    catch(err){
        console.log("error while sending cart details ");
        res.status(500).json({message:"dont know anything"})
    }

}

const authme = async (req: AuthenticatedRequest, res: Response) => {
    try{
        const email = req.user?.email
        const User = await userModel.findOne({ email });
        console.log(email)
        res.status(200).json({
          message: "User is authenticated",
          user: User?.name || null,
          email : User?.email || null
        });
    }
    catch(err){

    }
}

const already_present = async (req:any, res : Response) : Promise<Response> => {
     try{
        const {id, email} = req.body;
        const cart = await await cartModel.findOne({ email });
         if (!cart) return res.status(404).json({ message: "no cart found" });
        const result = cart.products.find((ele : any) => ele.id === id);
        if( result ){
            return res.status(200).json({message : "YES"});
        }
        return res.status(200).json({ message: "NO" });
     }
     catch(err : any ){
        return res.status(500);
     }
}


export { register_user, login, logout, addCart, removeCart, getCart, authme, already_present };
