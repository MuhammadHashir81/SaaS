import jwt from 'jsonwebtoken'


// admin access token 
export const adminAccessToken = (adminId) => {
         return jwt.sign({id:adminId},process.env.ADMIN_ACCESS_TOKEN_SECRET,{expiresIn:'15m'})  
    
 
}

// amdin refresh token 
export const adminRefreshToken = (adminId) => {
    return jwt.sign({id:adminId},process.env.ADMIN_ACCESS_TOKEN_SECRET,{expiresIn:'7d'})  
}

export const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
}


