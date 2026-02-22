import jwt from 'jsonwebtoken'


// admin access token 
export const userAccessToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.USER_ACCESS_TOKEN, { expiresIn: '15m' })

}

// amdin refresh token 
export const userRefreshToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.USER_REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

export const adminAccessToken = (adminId) => {
    return jwt.sign({ id: adminId }, process.env.USER_ACCESS_TOKEN, { expiresIn: '15m' })
}


// amdin refresh token 
export const adminRefreshToken = (adminId) => {
    return jwt.sign({ id: adminId }, process.env.USER_REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}


export const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
}


