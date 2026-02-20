import jwt from 'jsonwebtoken'

// verify admin middleware
export const verifyAdmin = async () =>{
  try {
    const getToken = req.cookies.adminAccessToken
    if(!getToken){
        return res.status(400).json({error:'please login',tokenExpired:true})
    }
    const decoded = jwt.verify(getToken,process.env.ADMIN_ACCESS_TOKEN_SECRET)
    req.adminId = decoded.id
  } catch (error) {
    return res.status(500).json({error:'internal server error'})
  }
}