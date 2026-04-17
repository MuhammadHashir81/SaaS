import mongoose from "mongoose";

const outflowSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            required: true,
        },
        category: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        description: {
            type: String,
            trim: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    { timestamps: true }
);

const Outflow = mongoose.model("Outflow", outflowSchema);

export { Outflow };
