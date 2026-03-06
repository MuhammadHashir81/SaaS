import React from 'react'
import { MdHome } from 'react-icons/md'
import { Divider, Table } from 'antd';

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
        render: () => <a>Delete</a>,
            
    },
];

const data = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        packing: 'fsdf',
        batchno: 'fsd',
        barcode: 'ldfs'
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sydney No. 1 Lake Park',
    },
];


const Customers = () => {
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

            {/* add new product */}

            <div className='font-primary rounded-lg bg-white shadow-sm text-sm font-medium px-4 py-5 my-10'>
                <h2 className='font-primary text-base font-semibold'> Add New Customer</h2>
                <div className="grid grid-cols-2 gap-4 my-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="name1">Name</label>
                        <input
                            type="text"
                            id="name1"
                            className="outline-1 outline-neutral-300 px-4 py-2 focus:outline-2 focus:outline-black rounded-sm"
                            placeholder="enter"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="location">Location</label>
                        <input
                            type="text"
                            id="location"
                            className="outline-1 outline-neutral-300 px-4 py-2 focus:outline-2 focus:outline-black rounded-sm"
                            placeholder="enter"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="outline-1 outline-neutral-300 px-4 py-2 focus:outline-2 focus:outline-black rounded-sm"
                            placeholder="enter"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="Phone">Phone</label>
                        <input
                            type="tel"
                            id="Phone"
                            className="outline-1 outline-neutral-300 px-4 py-2 focus:outline-2 focus:outline-black rounded-sm"
                            placeholder="enter"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="strn">STRN</label>
                        <input
                            type="text"
                            id="strn"
                            className="outline-1 outline-neutral-300 px-4 py-2 focus:outline-2 focus:outline-black rounded-sm"
                            placeholder="enter"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="ntn">NTN</label>
                        <input
                            type="text"
                            id="ntn"
                            className="outline-1 outline-neutral-300 px-4 py-2 focus:outline-2 focus:outline-black rounded-sm"
                            placeholder="enter"
                        />
                    </div>
                </div>
                <button className=' bg-green-500 px-4 py-2.5 text-white font-primary rounded-md'>Add Product</button>
                <div className='my-8'>

                </div>


            </div>
                    <Table columns={columns} dataSource={data} size="middle" />
        </div>
    )
}

export default Customers
