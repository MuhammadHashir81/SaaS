import mongoose from "mongoose";
    import { Schema } from "mongoose";


const invoiceItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
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
        type: Number,
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


invoiceItemSchema.pre('save', function (next) {
    this.totalAmount = this.quantity * this.rate;
    next();
});


const Invoice = mongoose.model('invoice', invoiceSchema)
export { Invoice }

