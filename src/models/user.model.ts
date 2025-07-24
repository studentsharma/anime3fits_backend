import mongoose, { Document } from "mongoose";

interface Payment {
    // id : number,
    products : any[],
    amount: number;
    method: string;
    date: Date;
}

interface userType extends Document {
    name : string,
    email: string,
    password: string,
    isVerified: boolean,
    payment_history: Payment[]
    mobile : number
}

const userSchema = new mongoose.Schema<userType>({

    name : {
        type : String,
        required : true
    },

    email: {
        type: String,
        unique: true,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    payment_history: {
        type: [
            {
                // id: { type: Number, required: true },
                amount: { type: Number, required: true },
                products: { type: [], required: true },
                method: { type: String, required: true },
                date: { type: Date, required: true },
            }
        ],
        default: [],
    },

    mobile : {
        type : Number, 
        required : true
    }

}, { timestamps: true });

const User = mongoose.model<userType>("User", userSchema);

export default User;