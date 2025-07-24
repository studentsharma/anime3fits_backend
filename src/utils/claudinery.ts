import { auto } from '@cloudinary/url-gen/actions/resize';
import { v2 as cloudinary } from 'cloudinary'
import fs, { unlink, unlinkSync } from "fs"
import dotenv from "dotenv"
dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME!,
  api_key: process.env.CLOUD_API_KEY!,
  api_secret: process.env.CLOUD_API_SECRET!,
});

const uploadonCloudinary = async (localfilepath : string) => {
    try{
        if( !localfilepath ) return null
        console.log(localfilepath)
        const res = await cloudinary.uploader.upload(localfilepath,{resource_type:"auto"})
        console.log("file uploaded ", res.url)
        fs.unlinkSync(localfilepath);
        return res
    }
    catch(err : any){
        console.log("error while file upload : ", err.message);
        fs.unlinkSync(localfilepath);
        return null
    }

}

export default uploadonCloudinary;