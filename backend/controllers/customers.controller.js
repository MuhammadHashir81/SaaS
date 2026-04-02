import { customerSchema } from "../validations/customer.validation.js"
import { Customer } from "../models/customer.model.js"


// get all customers
const handleGetAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find()
        res.status(200).json({
            success:true,
            data:customers
        })

    } catch (error) {
        res.status(500).json({error})

    }
}

// add customers
const handleAddCustomers = async (req, res) => {
    try {
        const { name, location, email, phone, strn, ntn } = req.body
        console.log(name, location, email, phone, strn, ntn)
        const result = customerSchema.safeParse(req.body)

        if (!result.success) {
            const err = result.error.issues.map((e) => e.message)
            console.log(err)
            return res.status(400).json({
                success: false,
                error: err
            })
        }

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
const handleUpdateCustomers = async (req,res)=>{
    const {name, location, email, phone, strn, ntn} = req.body
    
    const updateData = {}

    if(name) updateData.name = name
    if(location) updateData.location = location
    if(email) updateData.email = email
    if(phone) updateData.phone = phone
    if(strn) updateData.strn = strn
    if(ntn) updateData.ntn = ntn


    const { id } = req.params
    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(
            id,
            updateData
        )
        res.status(200).json({
            success:true,
            message:'customer updated successfully',
            data: updatedCustomer
        })
    } catch (error) {
        res.status(500).json({error})
    }

}

// delete customer

const handleDeleteCustomer = async (req,res) => {
    const { id } = req.params
    try {
        const deletedCustomer = await Customer.findByIdAndDelete(id)
    } catch (error) {
        
    }

}

export { handleAddCustomers, handleGetAllCustomers, handleUpdateCustomers, handleDeleteCustomer }