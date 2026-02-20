import { Admin } from "../models/admin.auth.model.js"
import bcrypt from 'bcryptjs'
import { adminAuthSchema } from "../validations/admin.auth.validation.js"
import { adminAccessToken, adminRefreshToken, cookieOptions } from "../utils/Genereate_Token.js"

// seed admin 
export const seedAdmin = async (req, res) => {
    try {
        const username = 'admin'
        const password = 'admin123admin'
        const hashedPassword = await bcrypt.hash(password, 10)
        const createAdmin = await Admin.create({ username, password: hashedPassword })

    } catch (error) {
        console.log(error)
    }
}

// admin auth controller
export const adminAuth = async (req, res) => {
    try {
        const { username, password } = req.body
        console.log(username, password)
        const result = adminAuthSchema.safeParse(req.body)

        if (!result.success) {
 
            const err = result.error.issues.map((e)=>e.message)

            return res.status(400).json({
                success: false,
                error: err
            })
        }

        const admin = await Admin.findOne({ username })

        if (admin) {
            const adminPassword = await bcrypt.compare(password, admin.password)

            if (!adminPassword) {
                return res.status(400).json({ error: 'invalid password' })
            }
            else {
                const accessToken = adminAccessToken(admin._id)
                const refreshToken = adminRefreshToken(admin._id)

                res.cookie('adminAccessToken', accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 })
                res.cookie('adminRefreshToken', refreshToken, cookieOptions)

                return res.status(200).json({ success: 'admin logged in successfully' })
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

        const admin = await Admin.findById(decoded.id)

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
        const admin = await Admin.findById(adminId)

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