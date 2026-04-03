import mongoose from 'mongoose'
import { DB_Name } from '../constants.js';
import express from 'express'
import { configDotenv } from 'dotenv';

configDotenv()

const app = express()
export const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}${DB_Name}`);
        console.log('database connected')
        app.on('error',()=>{
            console.log('error',error)
            throw error
        })
        
}
    catch (error) {
        console.log('Database connection error:', error);
        process.exit(1)
}
}

// you can also use IFFE to connect database 