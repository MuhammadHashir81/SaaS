import jwt from 'jsonwebtoken'

// verify admin middleware
export const verifyAdmin = async (req,res,next) =>{
  try {
    const getToken = req.cookies.adminAccessToken
    console.log(getToken)
    if(!getToken){
      console.log('error occcured')
        return res.status(401).json({error:'please login',tokenExpired:true})
    }
    const decoded = jwt.verify(getToken,process.env.USER_ACCESS_TOKEN)
    req.adminId = decoded.id
    next()
  } catch (error) {
    console.log(error.message)
    return res.status(500).json({error:error.message})
  }
}