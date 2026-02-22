import { adminAccessToken, adminRefreshToken, cookieOptions, userAccessToken, userRefreshToken } from "../utils/Genereate_Token.js"
import bcrypt from 'bcryptjs'
import { adminAuthSchema } from "../validations/admin.auth.validation.js"
import { User } from '../models/user.auth.model.js'

// seed admin 
export const seedAdmin = async (req, res) => {
    try {
        const username = 'admin'
        const password = 'admin123admin'
        const hashedPassword = await bcrypt.hash(password, 10)
        const createAdmin = await User.create({
            username,
            password: hashedPassword,
            role: 'admin'
        })

    } catch (error) {
        console.log(error)
    }
}

// admin auth controller
export const loginUser = async (req, res) => {
    try {
        const { username, email, password } = req.body
        console.log(username, password)
        const result = adminAuthSchema.safeParse(req.body)

        if (!result.success) {
            const err = result.error.issues.map((e) => e.message)
            return res.status(400).json({
                success: false,
                error: err
            })
        }

        const user = await User.findOne({ username })
        console.log(user)

        if (user) {
            const userPassword = await bcrypt.compare(password, user.password)

            if (!userPassword) {
                return res.status(400).json({ error: 'invalid password' })
            }
            if (user.role === 'user') {
                const accessToken = userAccessToken(user._id)
                const refreshToken = userRefreshToken(user._id)

                res.cookie('acessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
                res.cookie('refreshToken', refreshToken, cookieOptions)

                return res.status(200).json({
                    success: 'log in successfully',
                    role: user.role,
                    user: user
                })
            }
            if (user.role === 'admin') {

                const adminToken = adminAccessToken(user._id)
                const adminRfrshToken = adminRefreshToken(user._id)

                res.cookie('adminAccessToken', adminToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
                res.cookie('adminRefreshToken', adminRfrshToken, cookieOptions)

                return res.status(200).json({ success: 'admin logged in successfully', role: user.role })

            }

        }
        else {
            return res.status(400).json({ error: 'invalid credentials' })
        }



    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'internal server error ' })

    }
}

// refresh access token 
export const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.adminRefreshToken

        if (!refreshToken) {
            return res.status(400).json({ error: 'login please' })
        }

        const decoded = jwt.verify(refreshToken, process.env.ADMIN_REFRESH_TOKEN_SECRET)

        const admin = await User.findById(decoded.id)

        if (!admin) {
            return res.status(400).json({ error: 'admin does not exist please login' })
        }
        const accessToken = adminAccessToken(admin._id)

        res.cookie('adminAccessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })

        return res.status(200).json({ success: 'admin access token refreshed successfully' })

    } catch (error) {
        return res.status(500).json({ error: 'internal server error' })
    }

}


// checking Auth 
export const checkingAdminAuth = async (req, res) => {
    try {
        const { adminId } = req
        const admin = await User.findById(adminId)

        if (!findAdmin) {
            return res.status(400).json({ error: 'please login' })

        }

        setTimeout(() => {
            return res.status(200).json({ admin })
        }, 2000);



    } catch (error) {
        return res.status(500).json({ error: 'intenal server error' })

    }
}