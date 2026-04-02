import express from 'express'
import cors from 'cors'
import { configDotenv } from 'dotenv'
import cookieParser from 'cookie-parser'
import { adminAuthRouter } from './routes/adminAuth.route.js'
import { connectDB } from './db/connectionDB.js'
import { seedAdmin } from './controllers/user.auth.controller.js'
import { customerRoute } from './routes/customer.route.js'
import { productRouter } from './routes/product.route.js'

const app = express()
app.use(cookieParser())


configDotenv()
// db connection
connectDB()
seedAdmin()


const port = process.env.API_URL || 3000

app.use(express.json())
app.use(cors(
  {
    origin:'http://localhost:5173',
    credentials:true
  }
));


// admin auth routers
app.use('/api/admin',adminAuthRouter)



  
// customer route
app.use('/api/customer',customerRoute)

// product router
app.use('/api/product',productRouter)

app.get('/',(res,req)=>{
  res.send('SaaS')
})



app.listen(port,()=>{
    console.log(`SaaS is listening on port ${port}`)
})