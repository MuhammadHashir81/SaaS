import mongoose from "mongoose";
import { Schema } from "mongoose";

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
    product: {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product'

        },
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    rate: {
        type: String,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    }
}, { timestamps: true })


invoiceSchema.pre('save', function(next) {
    this.totalAmount = this.quantity * this.rate;
    next();
});


const Invoice = mongoose.model('invoice', invoiceSchema)

export { Invoice }