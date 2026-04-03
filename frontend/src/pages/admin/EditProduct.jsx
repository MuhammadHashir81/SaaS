import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { MdHome } from 'react-icons/md'
import { useLocation } from 'react-router-dom'
import { api } from '../../../api/api'
const EditProduct = () => {
    const { id } = useParams()
    const location = useLocation()
    const state = location.state
    const [productDetails, setProductDetails] = useState({
        name: state?.name || '',
        packing: state?.packing || '',
        batchNo: state?.batchNo || '',
        barcode: state?.barcode || ''
    })

    //   handle change


    const handleChange = (e) => {
        const { name, value } = e.target

        setProductDetails((prev) => ({
            ...prev,
            [name]: value
        }))

    }

    // edit product
    const handleEditProduct = async (e) => {
        e.preventDefault()
        try {
            const response = await api.put(`/api/product/edit/${id}`, {
                name: productDetails.name,
                packing: productDetails.packing,
                batchNo: productDetails.batchNo,
                barcode: productDetails.barcode,
            })
            console.log(response.data)
            window.location.href = '/admin/products'
        } catch (error) {
            console.log(error.message)
        }


    }

    const handleCancel = (e) => {
        e.preventDefault()
        window.location.href = '/admin/products'

    }

    return (
        <div>
            <div className='flex items-center gap-1 mb-4'>

                <MdHome size={15} />
                <h6 className='font-primary font-medium'>Home</h6>
            </div>

            <h2 className='font-primary text-xl font-bold mb-2'>Products Management</h2>


            <div className='font-primary rounded-lg bg-white shadow-sm text-sm font-medium px-4 py-5 my-10 '>
                <h2 className='font-primary text-base font-semibold'> Add New Product</h2>
                <form >

                    <div className="grid grid-cols-2 gap-4 my-4">
                        <div className="flex flex-col gap-2">

                            <label htmlFor="name">Name*</label>
                            <input
                                className="outline-1 outline-neutral-300 px-4 py-2 focus:outline-2 focus:outline-black rounded-sm"
                                type="text"
                                value={productDetails.name}
                                onChange={handleChange}
                                id="name"
                                name="name"
                                placeholder="enter"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="packing">Packing</label>
                            <input
                                type="text"
                                value={productDetails.packing}
                                onChange={handleChange}
                                id="packing"
                                name="packing"
                                className="outline-1 outline-neutral-300 px-4 py-2 focus:outline-2 focus:outline-black rounded-sm"
                                placeholder="enter"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="batchNo">Batch No</label>
                            <input
                                type="text"
                                value={productDetails.batchNo}
                                onChange={handleChange}
                                id="batchNo"
                                name="batchNo"
                                className="outline-1 outline-neutral-300 px-4 py-2 focus:outline-2 focus:outline-black rounded-sm"
                                placeholder="enter"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="barcode">Barcode</label>
                            <input
                                type="text"
                                value={productDetails.barcode}
                                onChange={handleChange}
                                id="barcode"
                                name="barcode"
                                className="outline-1 outline-neutral-300 px-4 py-2 focus:outline-2 focus:outline-black rounded-sm"
                                placeholder="enter"
                            />
                        </div>
                    </div>

                    <div className='flex gap-2'>
                        <button onClick={handleEditProduct} className=' bg-yellow-800 px-4 py-2.5 text-white font-primary rounded-md cursor-pointer'>Edit Product</button>
                        <button onClick={handleCancel} type='button' className=' bg-gray-800 px-4 py-2.5 text-white font-primary rounded-md cursor-pointer'>Cancel</button>
                    </div>

                </form>


            </div>

        </div>
    )
}

export default EditProduct
