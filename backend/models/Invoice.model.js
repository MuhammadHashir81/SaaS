import mongoose from "mongoose";
import { Schema } from "mongoose";


const invoiceItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    product: {
        type: String,
        required: true
    },

    rate: {
        type: Number,
        required: true
    },

    qty: {
        type: Number,
        required: true

    },

    discount:{
        type:Number,
    },

    soldAt: {
        type: Date,
        default: Date.now
    },
    
    subTotal: {
        type: Number,
    },

    total:{
        type:Number
    }
})

const invoiceSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Customer'
    },
    customer: {
        type: String,
        required: true
    },
    product: [invoiceItemSchema],


}, { timestamps: true })


invoiceSchema.pre('save', async function () {
    this.product.forEach((item) => {
       return item.subTotal = item.qty * item.rate;
    });
     
    this.product.forEach((item)=>{
        return item.total = (item.qty * item.rate) - item.discount
    })

});


let Invoice = mongoose.model('invoice', invoiceSchema)
export { Invoice }

