import { useEffect, useState } from 'react'
import { Input, Select } from 'antd';
import { FaPlus } from 'react-icons/fa6';
import { MdHome } from 'react-icons/md'
import { Divider, Table } from 'antd';
import { ConfigProvider } from 'antd'
import { api } from '../../../api/api';


const NewInvoice = () => {
  const [invoiceItems, setInvoiceItems] = useState([
    {
      id: 1,
      product: '',
      qty: '',
      rate: '',
    }
  ]);

  const [customers, setCustomers] = useState([])
  const [customerSearch, setCustomerSearch] = useState('')
  const [productSearch, setProductSearch] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState('')
  const [selectedProduct,setSelectedProduct] = useState('')
  const [products,setProducts] = useState([])

  // handle searched customers
  const handleSearchedCustomers = async () => {
    try {
      const response = await api.get(`/api/customer/search?q=${customerSearch}`)
      console.log("handleSearchedCustomers", response)
      setCustomers(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const searchTimer = setTimeout(() => {
      handleSearchedCustomers()
    }, 1000);

    return () => {
      clearTimeout(searchTimer)
    }
  }, [customerSearch])


  // handle searched prodcuts 
  const handleSearchedProducts = async () => {
    try {
      const response = await api.get(`/api/product/get-all${productSearch}`)
      console.log('products are ',response.data)
      setProducts(response.data)
      console.log(response)
    } catch (error) {
      console.log(error)
    }

  }

  useEffect(() => {
    handleSearchedProducts()
  }, [productSearch]
  )


  // handle customer select 

  const handleCustomerSelect = (option) => {
    setSelectedCustomer(option)
  }

  // handle product select

  const handleProductSelect = (option) => {
    setSelectedProduct(option)
  }



  const columns = [
    {
      title: 'Product',
      dataIndex: 'product',
      render: () => (

        <Select
          style={{ width: '100%' }}
          value={selectedProduct}
          placeholder="Select an option"
          showSearch={{
            optionFilterProp: ['label'],
          }}
          onSelect={handleProductSelect}
          options={products.map((product) => (
            { value: `${product._id}`, label: `${product.name}` }
          ))}
        />

      )
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      render: () => (
        <Input
          type="number"
          style={{ width: '20%' }}
        />

      )
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
      key: 'rate',
      render: () => (
        <Input
          type="number"
          // handle 
          placeholder="rate"
          style={{ width: '20%' }}
        />
      ),
    },
  ];




  return (
    <ConfigProvider
      theme={{
        components: {
          DatePicker: {
            activeBorderColor: 'black',
            hoverBorderColor: 'black',
            lineWidth: 1,
            borderRadius: 4
          },

          Select: {
            activeBorderColor: 'black',
            hoverBorderColor: 'black',
            lineWidth: 1,
            borderRadius: 4
          }
        }
      }}
    >

      <div>
        <div className='flex items-center gap-1 mb-4'>

          <MdHome size={15} />
          <h6 className='font-primary font-medium'>Home</h6>
        </div>
        <h2 className='font-primary text-base font-bold mb-2'>New Invoice</h2>

        {/*  */}

        <div className="rounded-lg bg-white shadow-sm px-8 py-10 my-10">
          <h2 className='font-primary font-semibold text-lg'>Customer Information</h2>
          <div className='flex mt-3 mb-5 justify-between w-[600px]'>


            <Select
              style={{ width: 250 }}
              placeholder="Select an option"
              value={selectedCustomer}
              showSearch={{
                optionFilterProp: ['label'],
              }}
              onSelect={handleCustomerSelect}
              options={customers.map((customer) => (
                { value: `${customer._id}`, label: `${customer.name}` }
              ))}
            />
            <button className='font-primary  flex items-center gap-2 text-blue-500 cursor-pointer'>
              <FaPlus />
              Add New Customer
            </button>
          </div>

          {/* Invoice items div */}

          <div>
            <h2 className='font-primary font-bold text-base'>Invoice Items</h2>
          </div>

          <Table columns={columns} dataSource={invoiceItems} size="middle" pagination={false} />
          <span className='text-blue-500 flex items-center gap-1 cursor-pointer'><FaPlus/> Add Item</span>


        </div>

      </div>
    </ConfigProvider>
  )
}

export default NewInvoice


