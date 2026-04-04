import { customerSchema } from "../validations/customer.validation.js"
import { Customer } from "../models/customer.model.js"


// get all customers
const handleGetAllCustomers = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1
        console.log(page)
        const limit = Number(req.query.limit) || 10
        const skip = (page - 1) * 10
        const customers = await Customer.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const totalCustomers = await Customer.countDocuments()
        const totalPages = Math.ceil(totalCustomers / limit)


        if (!customers) {
            return res.status(404).json({
                success: false,
                data: 'no customers yet',
            })
        }
        return res.status(200).json({
            success: true,
            data: customers,
            totalPages: totalPages,
            totalCustomers: totalCustomers
        })

    } catch (error) {
        res.status(500).json({ error })

    }
}

// add customers
const handleAddCustomers = async (req, res) => {
    try {
        const { name, location, email, phone, strn, ntn } = req.body
        console.log(name, location, email, phone, strn, ntn)
        const result = customerSchema.safeParse(req.body)
        // if (!result.success) {
        //     const firstError = result.error.issues[0].message  // ← only first error
        //     return res.status(400).json({
        //         success: false,
        //         error: { message: firstError }
        //     })
        // }
        const firstIssue = result.error.issues[0]
        return res.status(400).json({
            success: false,
            error: { message: firstIssue.message, field: firstIssue.path[0] }
        })

        const customers = await Customer.create({
            name,
            location,
            email,
            phone,
            strn,
            ntn
        })


        res.status(201).json({
            success: true,
            message: 'Customer created successfully',
            data: customers
        })
        console.log(name, email)

    } catch (error) {
        res.status(500).json({ message: 'something went wrong' })

    }

}
// update customer
const handleUpdateCustomers = async (req, res) => {
    const { name, location, email, phone, strn, ntn } = req.body

    const updateData = {}

    if (name) updateData.name = name
    if (location) updateData.location = location
    if (email) updateData.email = email
    if (phone) updateData.phone = phone
    if (strn) updateData.strn = strn
    if (ntn) updateData.ntn = ntn


    const { id } = req.params
    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(
            id,
            updateData
        )
        res.status(200).json({
            success: true,
            message: 'customer updated successfully',
            data: updatedCustomer
        })
    } catch (error) {
        res.status(500).json({ error })
    }

}

// delete customer
const handleDeleteCustomer = async (req, res) => {
    const { id } = req.params
    try {
        const deletedCustomer = await Customer.findByIdAndDelete(id)
        res.status(200).json({
            success: true,
            message: 'customer deleted successfully',
            data: deletedCustomer
        })
    } catch (error) {
        res.status(500).json({ error })
    }

}








// handle search customers 
const handleSearchedCustomers = async (req, res) => {
    try {
        // const search = req.query.q

    } catch (error) {

    }

}

export { handleAddCustomers, handleGetAllCustomers, handleUpdateCustomers, handleDeleteCustomer }