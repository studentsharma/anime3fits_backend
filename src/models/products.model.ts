import mongoose, { Document } from "mongoose";

enum MenClothingCategory {
    Topwear = "Topwear",
    Bottomwear = "Bottomwear"
}

enum MenClothingSubCategory {
    TShirt = "T-Shirt",
    Hoodie = "Hoodie",
    Jacket = "Jacket",
    Jeans = "Jeans",
    Cargo = "Cargo"
}

enum Sizes {
    XS = "XS",
    S = "S",
    M = "M",
    L = "L",
    XL = "XL",
    XXL = "XXL"
}

interface productType extends Document {
    pro_id : number,
    name: string,
    category: MenClothingCategory,
    subCategory: MenClothingSubCategory,
    url: string,
    price: number,
    discount: number,
    size: Sizes[],
    quantity: number // not focusing on the quantity of different size cloths
}

const productSchema = new mongoose.Schema<productType>({

    pro_id: {
        type: Number,
        required: true,
        unique: true
    },

    name: {
        type: String,
        required: true,
        unique: true
    },

    category: {
        type: String,
        enum: Object.values(MenClothingCategory),
        required: true
    },

    subCategory: {
        type: String,
        enum: Object.values(MenClothingSubCategory),
        required: true
    },

    url: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    discount: Number,

    size: {
        type: [String], 
        enum: Object.values(Sizes),
        required: true
    },

    quantity: {
        type: Number,
        default : 1
    }

}, { timestamps: true });

const Product = mongoose.model<productType>("Product", productSchema);

export default Product;