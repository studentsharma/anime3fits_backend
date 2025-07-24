import mongoose, { Document } from "mongoose";

interface product{
    id : number,
    product_name : string,
    quantity : number,
    size : string,
    image : string
    price : number
}

interface cartType extends Document{
    email : string,
    products : product[]
}

const cartSchema = new mongoose.Schema<cartType>({
    email : {
        type : String,
        required : true,
        unique : true
    },

    products : 
        // type : [{
        //     id : { type : Number, required : true },
        //     product_name : { type: String, required: true },
        //     quantity: { type: Number, required: true, default : 1  },
        //     price: { type: Number, required: true  },
        //     image : { type : String },
        //     size : { type : String }
        // }]\
        [{
            id : { type : Number, required : true },
            product_name : { type: String, required: true },
            quantity: { type: Number, required: true, default : 1  },
            price: { type: Number, required: true  },
            image : { type : String },
            size : { type : String }
        }]
    // },


}, { timestamps: true });

const Cart = mongoose.model<cartType>("Cart", cartSchema);

export default Cart;