import { useState, useEffect } from 'react'
import { MdHome } from 'react-icons/md'
import { DatePicker } from 'antd';
import { Table } from 'antd';
import { FaPlus } from 'react-icons/fa6';
import { ConfigProvider } from 'antd'
import { NavLink } from 'react-router-dom'
import { api } from '../../../api/api';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
const Invoices = () => {
  const navigate = useNavigate()
  const [invoices, setInvoices] = useState([])
  const [totalPages,setTotalPages] = useState('')
  const [page,setPage] = useState(1)
  const [totalInvoices,setTotalInvoices] = useState('')


  const [filters, setFilters] = useState({
    customer: "",
    startDate: "",
    endDate: "",
    minTotal: "",
    maxTotal: "",
  });


  // handle get all invoices


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
      render: (date) => {
        return new Date(date).toLocaleString(undefined, {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      }
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
      dataIndex: 'total',
    },
    {
      title: 'Actions',
      dataIndex: '',
      key: 'x',
      render: (invoice) => (
        <div className='flex gap-2'>

          <span onClick={() => handleEdit(invoice)} className='font-primary text-green-600 cursor-pointer font-medium' >Edit</span>
          <span  onClick={()=>handleView(invoice)} className='text-blue-600 cursor-pointer font-primary font-medium'>View</span>
        </div>

      )
    },

  ];
  
  // handle next page 

  const handleNextPage = () => {
    console.log('page')

    setPage(prev => prev + 1)
  }

  console.log(page)
  // handle previous page
  const handlePreviousPage = () => {
    setPage(prev => prev - 1)

  }



  const handleGetAllInvoices = async (page=1,limit=10) => {
    try {
      const response = await api.get(`/api/product/invoice/get-all?page=${page}&limit=${limit}`)
      setInvoices(response.data || [])
      setTotalPages(response.totalPages)
      setTotalInvoices(response.totalInvoices)
      console.log("these are all invoices", response.data)
    } catch (error) {
      console.log(error)
    }

  }


  useEffect(() => {
    handleGetAllInvoices(page)
  }, [page])


  

  const handleEdit = (invoice) => {
    navigate(`/admin/edit-invoice/${invoice._id}`, {
      state: invoice
    })
    console.log(invoice)
  }

  // view invoice to generate pdf

  const handleView = (invoice) =>{
    navigate(`/admin/bill/${invoice._id}`,{
      state:invoice
    })

    console.log(invoice)
  }

  // search invoices
  const handleSearchInvoices = async (filters) => {
    console.log("searching inovoices")
    try {
      const response = await api.get("/api/product/invoice/search", {
        params: filters,
      });

      console.log(response.data)
      setInvoices(response.data || [])
      return response.data;
    } catch (error) {
      console.log("Search invoices error:", error?.response?.data || error.message);
      throw error;
    }
  };

  // handle change
const handleChange = (field) => (e) => {
  setFilters((prev) => ({
    ...prev,
    [field]: e.target.value,
  }));
};

const handleDateChange = (field) => (date, dateString) => {
  setFilters((prev) => ({
    ...prev,
    [field]: dateString,
  }));
};

const handleResetFilters = () => {
  console.log("reseting all the filters....")
  setFilters({
    customer: "",
    startDate: "",
    endDate: "",
    minTotal: "",
    maxTotal: "",
  });
  handleGetAllInvoices();
};

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

        <div>
          <div className='flex items-center gap-1 mb-4'>

            <MdHome size={15} />
            <h6 className='font-primary font-medium'>Home</h6>
          </div>
          <div className='flex items-center justify-between'>

            <h2 className='font-primary text-xl font-bold mb-2'>Invoices</h2>
            <NavLink to='/admin/new-invoice' className='flex items-center gap-2 bg-blue-600 font-primary font-medium px-3 py-2 rounded-md text-white'>
              <FaPlus size={12}/>
              Create Invoice
            </NavLink>
          </div>

          {/* the uppper div */}
          <div className='bg-white shadow-md grid grid-cols-6 px-2 py-3 my-4 rounded-md gap-4'>
            <input
              type="text"
              className=' outline-1 px-2 outline-gray-100 focus:outline-black rounded-sm' placeholder='Customer name'
              value={filters.customer}
              onChange={handleChange("customer")}

            />

            <DatePicker
              value={filters.startDate ? dayjs(filters.startDate) : null}
              placeholder='start date'
              onChange={handleDateChange("startDate")}
              needConfirm />

            <DatePicker
              value={filters.endDate ? dayjs(filters.endDate) : null}
              placeholder='end date'
              onChange={handleDateChange("endDate")}
              needConfirm />

            <input
              type="number"
              placeholder='min total'
              value={filters.minTotal}
              onChange={handleChange("minTotal")}
              className='font-primary outline-1 px-2 outline-gray-100 focus:outline-black rounded-sm' />

            <input
              type="number"
              placeholder='max total'
              value={filters.maxTotal}
              onChange={handleChange("maxTotal")}
              className='font-primary outline-1 px-2 outline-gray-100 focus:outline-black rounded-sm' />

              <div className='flex gap-3'>
            <button onClick={()=>handleSearchInvoices(filters)} className='w-[50%]  cursor-pointer font-primary font-medium bg-blue-500 text-white rounded-md py-1.5'>search</button>
            <button onClick={handleResetFilters} className='w-[50%] cursor-pointer font-primary   font-medium bg-gray-200 rounded-md'>reset</button>
              </div>

          </div>


          {/* table  */}

          <div className='font-primary rounded-lg bg-white shadow-sm text-sm font-medium px-4 py-5 my-10 '>


          <Table columns={columns} dataSource={invoices} size="middle" pagination={false} />

          
          <div className='mt-5 flex justify-between gap-3 text-gray-600'>
            <div>
              <p> Total Invoices {totalInvoices}</p>
            </div>
            <div className={`flex gap-2 items-center flex`}>
              <button disabled={page === 1} onClick={handlePreviousPage} className=' border-1 border-gray-100  rounded-sm px-4 py-1 cursor-pointer hover:bg-gray-50'>previous</button>
              <p> page {page} of {totalPages} </p>
              <button disabled={page === totalPages} onClick={handleNextPage} className=' border-1 border-gray-100  rounded-sm px-4 py-1 cursor-pointer hover:bg-gray-50'>next</button>
            </div>

          </div>


          </div>
        </div>

      </div>
    </ConfigProvider>
  )
}

export default Invoices
