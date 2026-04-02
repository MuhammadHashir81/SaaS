    import React, { useEffect } from 'react'
    import { MdHome } from 'react-icons/md'
    import { Divider, Table } from 'antd';
    import { api } from '../../../api/api';
    import { useState } from 'react';
    import { Navigate } from 'react-router-dom';
    import { useNavigate } from 'react-router-dom';



    const Customers = () => {
        const navigate = useNavigate()
        const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Location',
            dataIndex: 'location',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
        },

        {
            title: 'Actions',   
            dataIndex: '',
            key: 'x',
            render: (customer) => (
                <div className='flex gap-2'>

                <a className='font-primary cursor-pointer font-medium' onClick={()=>handleEdit(customer)} >edit</a>
                <span className='text-red-600 cursor-pointer font-primary font-medium' onClick={()=>handleDelete(customer)}>delete</span>
                </div>
            ),

        },
    ];

        const [customers, setCustomers] = useState([])
        const [userCredentials, setUserCredentials] = useState({
            name: '',
            location: '',
            email: '',
            phone: '',
            strn: '',
            ntn: ''
        })

        // handle api calls

        // create customer
        const handleSubmit = async (e) => {
            e.preventDefault()
            const response = await api.post(`/api/customer/add`, {
                name: userCredentials.name,
                location: userCredentials.location,
                email: userCredentials.email,
                phone: userCredentials.phone,
                strn: userCredentials.strn,
                ntn: userCredentials.ntn
            })
            setCustomers(prev => [...prev, response.data]) // Add new customer to existing list

        }

        // get all customers 

        const handleGetCustomers = async () => {
            try {
                const response = await api.get('/api/customer/get-all')
                console.log(response)
                setCustomers(response.data)
            } catch (error) {
                console.log(error)
            }

        }


        useEffect(() => {
            handleGetCustomers()
        }, [])

        // handleChange
        const handleChange = (e) => {
            const { name, value } = e.target

            setUserCredentials((prev) => ({
                ...prev, [name]: value
            }))

        }
        
    // perform actions

    // handle delete 

    const handleDelete = (customer) => {
        console.log(customer._id)
    }

    // handle edit

    const handleEdit = (customer) => {
        navigate(`/admin/edit/${customer._id}`,{
            state:customer 
        })

    }

        return (
            <div>

                <div className='flex items-center gap-1 mb-4'>

                    <MdHome size={15} />
                    <h6 className='font-primary font-medium'>Home</h6>
                </div>

                <h2 className='font-primary text-xl font-bold mb-2'>Customers</h2>

                {/* search products */}
                <div className="font-primary rounded-lg bg-white shadow-sm text-sm font-medium px-4 py-5 my-10">
                    <label htmlFor='search'>Search Customers</label>
                    <div className='flex items-center justify-between gap-4 mt-2'>

                        <input type="text" placeholder='Search by name, product or bar number'
                            className='w-full px-2 py-2 outline-1 outline-neutral-300 rounded-md '
                            id='search'
                        />
                        <button className='bg-blue-500 px-4 py-2 rounded-md text-white text-sm font-primary'>Search</button>
                    </div>

                </div>

                {/* add new custmer inputs*/}

                <div className='font-primary rounded-lg bg-white shadow-sm text-sm font-medium px-4 py-5 my-10'>
                    <h2 className='font-primary text-base font-semibold'> Add New Customer</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4 my-4">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="name">Name<span>*</span></label>
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
                                <label htmlFor="location">Location <span>*</span></label>
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
                        <button className=' bg-green-500 px-4 py-2.5 text-white font-primary rounded-md cursor-pointer'>Add Customer</button>
                    </form>
                    <div className='my-8'>

                    </div>


                </div>
                {/* table data */}

                <Table columns={columns} dataSource={customers} size="middle" />
            </div>
        )
    }

    export default Customers
