import mongoose from "mongoose";
import { Schema } from "mongoose";


const invoiceItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    product:{
        type:String,
        required:true
    },

    rate: {
        type: String,
        required: true
    },

    qty: {
        type: String,
        required: true

    },
    
    totalAmount: {
        type: String,
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
    
    subTotal:{
        type:String,
    }

}, { timestamps: true })


invoiceSchema.pre('save', async function () {
    this.product.forEach((item) => {
        item.totalAmount = item.qty * item.rate;
    });
        this.subTotal = this.product.reduce((sum,item)=>{
        return sum + item.rate * item.qty
    },0)

});

    

const Invoice = mongoose.model('invoice', invoiceSchema)
export { Invoice }

