import uploadonCloudinary from "../utils/claudinery.js";
import productModel from "../models/products.model.js"

const upload_product = async (req : any, res : any) => {
  try {
    const {pro_id,name, category, subCategory, price, discount, quantity } = req.body
    const size = JSON.parse(req.body.size);
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("Uploaded file:", req.file);

    const result = await uploadonCloudinary(req.file.path);

    if( !result ) return res.status(404).json({message:"image not found"});

    const prod = await productModel.create({
        pro_id,
        name,
        category,
        subCategory,
        url : result.url,
        price,
        discount,
        size,
        quantity
    })

    res.status(200).json({
      message: "File uploaded to Cloudinary",
      url: result.secure_url
    });

    console.log(result.url)
  } catch (err: any) {
    console.error("Upload error:", err.message);
    res.status(500).json({ message: "Upload failed" });
  }
}

export default upload_product