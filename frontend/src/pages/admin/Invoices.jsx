import {useState,useEffect} from 'react'
import { MdHome } from 'react-icons/md'
import { DatePicker } from 'antd';
import {  Table } from 'antd';
import { FaPlus } from 'react-icons/fa6';
import {ConfigProvider} from 'antd'
import {NavLink} from 'react-router-dom'
import { api } from '../../../api/api';
const onChange = (date, dateString) => {
  console.log(date, dateString);
};

const columns = [
  {
    title: 'Customer',
    dataIndex: 'customer',
  },
  {
    title: 'Location',
    dataIndex: 'location',
  },
{
    title: 'Date',
    dataIndex: 'date',
  },
{
    title: 'subtotal',
    dataIndex: 'subTotal',
  },
{
    title: 'Discount',
    dataIndex: 'discount',
  },
{
    title: 'Total',
    dataIndex: 'subTotal',
  },
  {
    title: 'Actions',
    dataIndex: 'actions',
  },

];

const Invoices = () => {
  const [invoices,setInvoices] = useState([])

  
// handle get all invoices

const handleGetAllInvoices = async() => {
  try {
     const response = await api.get(`/api/product/invoice/get-all`)
     setInvoices(response.data)
     console.log(response.data)
  } catch (error) {
    console.log(error)
    
  }

}

useEffect(()=>{
    handleGetAllInvoices()
},[])

  return (
      <ConfigProvider
            theme={{
                components:{
                    DatePicker:{
                        activeBorderColor:'black',
                        hoverBorderColor:'black',
                        lineWidth:1,
                        borderRadius:4
                    },
    
                    Select:{
                        activeBorderColor:'black',
                        hoverBorderColor:'black',
                        lineWidth:1,
                        borderRadius:4
                    }
                }
            }}
            >
    
    <div>

     <div>
              <div className='flex items-center gap-1 mb-4'>
      
                <MdHome size={15} />
                <h6 className='font-primary font-medium'>Home</h6>
              </div>
              <div className='flex items-center justify-between'>

        <h2 className='font-primary text-xl font-bold mb-2'>Invoices</h2>
        <NavLink to='/admin/new-invoice' className='flex items-center gap-2 bg-blue-600 font-primary font-medium px-4 py-3 rounded-md text-white'>
          <FaPlus/>
           Create Invoice
           </NavLink>
              </div>

              {/* the uppper div */}
              <div className='bg-white shadow-md grid  grid-cols-7 px-2 py-3 my-4 rounded-md gap-4'>
                 <input type="text" className='outline-1 px-2 outline-gray-100 focus:outline-black rounded-sm' placeholder='Customer name' />
                 <DatePicker onChange={onChange} needConfirm />
                 <DatePicker onChange={onChange} needConfirm />
                 <input type="number" placeholder='Min Total' className='outline-1 px-2 outline-gray-100 focus:outline-black rounded-sm'/>
                 <input type="number" placeholder='Max Total' className='outline-1 px-2 outline-gray-100 focus:outline-black rounded-sm' />
                 <button className='cursor-pointer font-primary font-medium bg-blue-500 text-white rounded-md py-2'>search</button>
                 <button className='cursor-pointer font-primary font-medium bg-gray-200 rounded-md'>reset</button>
              </div>


              {/* table  */}

       <Table columns={columns} dataSource={invoices} size="middle" pagination={false} />

      
      </div>      
      
    </div>
    </ConfigProvider>
  )
}

export default Invoices
