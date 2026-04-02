import {useState} from 'react'
import {  useLocation, useNavigate, useParams } from 'react-router-dom'
import { MdHome } from 'react-icons/md'
import { api } from '../../../api/api'
const EditCustomer = () => {
    const navigate = useNavigate()

    const { id } = useParams()
    const location = useLocation()
    const state = location.state
    console.log(state)
    const [userCredentials, setUserCredentials] = useState({
        name: state?.name|| '',
        location: state?.location || '' ,
        email: state?.email || '',
        phone: state?.phone || '',
        strn: state?.strn || '',
        ntn: state?.ntn || ''
    })

    // handle change

    const handleChange = (e) => {
        const { name, value } = e.target

        setUserCredentials((prev) => ({
            ...prev, [name]: value
        }))

    }
    // handle updation

    const handleUpdate = async (e) =>{
        e.preventDefault()
        const response = await api.put(`/api/customer/edit/${id}`,
            userCredentials
        )
        window.location.href = '/admin/customers'
    }

    // handle canel

    const handleCancel = () => {
        navigate('/admin/customers')
    }

    
    return (
        <div>
            {/* header */}

            <div className='flex items-center gap-1 mb-4'>

                <MdHome size={15} />
                <h6 className='font-primary font-medium'>Home</h6>
            </div>

            <h2 className='font-primary text-xl font-bold mb-2'>Customers Mangement</h2>

            {/* update customers inputs */}

            <div className='font-primary rounded-lg bg-white shadow-sm text-sm font-medium px-4 py-5 my-10'>
                <h2 className='font-primary text-base font-semibold'>Edit Customer</h2>
                <form >
                    <div className="grid grid-cols-2 gap-4 my-4">
                        <div className="flex flex-col gap-2">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                value={userCredentials.name}
                                name='name'
                                onChange={handleChange}
                                className="outline-1 outline-neutral-300 px-4 py-2 focus:outline-2 focus:outline-black rounded-sm"
                                placeholder="enter"
                            />
                        </div>


                        <div className="flex flex-col gap-2">
                            <label htmlFor="location">Location</label>
                            <input
                                value={userCredentials.location}
                                type="text"
                                id="location"
                                name='location'
                                onChange={handleChange}
                                className="outline-1 outline-neutral-300 px-4 py-2 focus:outline-2 focus:outline-black rounded-sm"
                                placeholder="enter"

                            />

                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="email" > Email</label>
                            <input
                                type="email"
                                id="email"
                                name='email'
                                value={userCredentials.email}
                                onChange={handleChange}
                                className="outline-1 outline-neutral-300 px-4 py-2 focus:outline-2 focus:outline-black rounded-sm"
                                placeholder="enter"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="phone">Phone</label>
                            <input
                                type="tel"
                                id="phone"
                                name='phone'
                                value={userCredentials.phone}
                                onChange={handleChange}
                                className="outline-1 outline-neutral-300 px-4 py-2 focus:outline-2 focus:outline-black rounded-sm"
                                placeholder="enter"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="strn">STRN</label>
                            <input
                                type="text"
                                id="strn"
                                name='strn'
                                value={userCredentials.strn}
                                onChange={handleChange}

                                className="outline-1 outline-neutral-300 px-4 py-2 focus:outline-2 focus:outline-black rounded-sm"
                                placeholder="enter"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="ntn">NTN</label>
                            <input
                                type="text"
                                id="ntn"
                                name='ntn'
                                value={userCredentials.ntn}
                                onChange={handleChange}
                                className="outline-1 outline-neutral-300 px-4 py-2 focus:outline-2 focus:outline-black rounded-sm"
                                placeholder="enter"
                            />
                        </div>

                    </div>
                    <div className='flex gap-2'>

                    <button type='button' onClick={handleUpdate} className=' bg-yellow-800 px-4 py-2.5 text-white font-primary rounded-md cursor-pointer'>Update Customer</button>
                    <button onClick={handleCancel} type='button' className=' bg-gray-800 px-4 py-2.5 text-white font-primary rounded-md cursor-pointer'>Cancel</button>
                    </div>

                </form>
                <div className='my-8'>

                </div>


            </div>


        </div>
    )
}

export default EditCustomer
