import productModel from "../models/products.model.js"

const get_products = async (req : any, res : any ) => {
    try{
        const {subCategory} = req.body
        const pro = await productModel.find({subCategory}).select("name price url discount pro_id -_id");
        res.status(200).json(pro);
    }
    catch(err : any){
        console.log("error in sending products", err.message);
        res.status(404).json({message:"cant send"});
    }
}

export {get_products}