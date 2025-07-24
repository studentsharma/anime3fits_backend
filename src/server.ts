import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/connectDB.js";
import userRouter from "./routes/user.route.js"
import cookieParser from "cookie-parser";
import adminRoute from "./routes/admin.route.js"
import globalRoute from "./routes/global.route.js"


const app = express();

app.use(express.json());
app.use(cors({
    // origin: process.env.CORS_ORIGIN,
    origin: ["http://localhost:5173", "https://anime3fits-tm59.vercel.app" ],
    // origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"))
dotenv.config()

app.use("/api/user", userRouter)
app.use("/api/admin", adminRoute)
app.use("/api/global", globalRoute)


app.listen(process.env.PORT, () => {
    connectDB();
    console.log(`server running at ${process.env.PORT}`);
})

 