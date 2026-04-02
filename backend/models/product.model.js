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
    bathNo: {
        type: String
    },
    barcode: {
        type: String
    },
},
    {}
)

const Product = mongoose.model('Product', productSchema)

export { Product }