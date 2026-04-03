import mongoose from 'mongoose'
import { Schema } from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
    },
    packing: {
        type: String,
    },
    batchNo: {
        type: String
    },
    barcode: {
        type: String
    },
},
    {timestamps:true}
)

const Product = mongoose.model('Product', productSchema)

export { Product }