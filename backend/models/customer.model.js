import mongoose, { Schema } from "mongoose";

const customerSchema =  new Schema({
    name:{
        type:String,
        required:true,
        lowercase:true,
        trim:true
    },
    location:{
        type:String,
        lowercase:true,
        trim:true
    },
    email:{
        type:String,
        lowercase:true,
        trim:true
    },
    phone:{
      type:String,
    },
    strn:{
        type:String,
    },
    ntn:{
        type:String
    }

},{timestamps:true}
)
const Customer = mongoose.model('Customer',customerSchema)

export {Customer}