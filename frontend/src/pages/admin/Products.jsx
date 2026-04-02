import { useState } from 'react'
import { MdHome } from 'react-icons/md'
import { Table } from 'antd';
import { api } from '../../../api/api';



const Products = () => {
  const [products, setProducts] = useState([])
  const [productDetails, setProductDetails] = useState({
    name: '',
    packing: '',
    batchNo: '',
    barcode: ''
  })

  // handle add products

  const handleAddProducts = async () => {
    const response = await api.post('/api/products/add', {
      name,
      packing,
      batchNo,
      barcode
    })
    

  }

  // handle change 

  const handleChange = (e) => {
    const { name, value } = e.target

    setProductDetails((prev) => ({
        ...prev,
      [name]: value
      }))

}


const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Packing',
    dataIndex: 'packing',
  },
  {
    title: 'Batch No',
    dataIndex: 'batchno',
  },
  {
    title: 'Barcode',
    dataIndex: 'barcode',
  },

  {
    title: 'Actions',
    dataIndex: '',
    key: 'x',
    render: () => (
                <div className='flex gap-2'>

                <a className='font-primary cursor-pointer font-medium'>edit</a>
                <span className='text-red-600 cursor-pointer font-primary font-medium'>delete</span>
                </div>

    )
  },
];

return (
  <div>

    <div className='flex items-center gap-1 mb-4'>

      <MdHome size={15} />
      <h6 className='font-primary font-medium'>Home</h6>
    </div>

    <h2 className='font-primary text-xl font-bold mb-2'>Products Management</h2>

    {/* search products */}
    <div className="font-primary rounded-lg bg-white shadow-sm text-sm font-medium px-4 py-5 my-10">
      <label htmlFor='search'>Search Products</label>
      <div className='flex items-center justify-between gap-4 mt-2'>

        <input type="text" placeholder='Search by name, product or bar number'
          className='w-full px-4 py-2 outline-1 outline-neutral-300 rounded-sm focus:outline-2 focus:outline-black'
          id='search'
        />
        <button className='bg-blue-500 px-4 py-2 rounded-md text-white text-sm font-primary'>Search</button>
      </div>

    </div>

    {/* add new product */}

    <div className='font-primary rounded-lg bg-white shadow-sm text-sm font-medium px-4 py-5 my-10 '>
      <h2 className='font-primary text-base font-semibold'> Add New Product</h2>
      <form onSubmit={handleAddProducts}>

      <div className="grid grid-cols-2 gap-4 my-4">
        <div className="flex flex-col gap-2">

          <label htmlFor="name">Name</label>
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

      </form>

      <button className=' bg-green-600 px-4 py-2.5 text-white font-primary rounded-md hover:bg-green-700 cursor-pointer '>Add Product</button>
      <div className='my-8'>

        <Table columns={columns} dataSource={products} size="middle" />
      </div>


    </div>
  </div>
)
}

export default Products
