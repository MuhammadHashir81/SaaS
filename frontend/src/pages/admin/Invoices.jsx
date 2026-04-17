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
        return new Date(date).toLocaleString('en-GB', {
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
          <span className='text-blue-600 cursor-pointer font-primary font-medium'>View</span>
        </div>

      )
    },

  ];


  const handleGetAllInvoices = async () => {
    try {
      const response = await api.get(`/api/product/invoice/get-all`)
      setInvoices(response.data || [])
      console.log("these are all invoices", response.data)
    } catch (error) {
      console.log(error)

    }

  }


  useEffect(() => {
    handleGetAllInvoices()
  }, [])


  const handleEdit = (invoice) => {
    navigate(`/admin/edit-invoice/${invoice._id}`, {
      state: invoice
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
            <NavLink to='/admin/new-invoice' className='flex items-center gap-2 bg-blue-600 font-primary font-medium px-4 py-3 rounded-md text-white'>
              <FaPlus />
              Create Invoice
            </NavLink>
          </div>

          {/* the uppper div */}
          <div className='bg-white shadow-md grid  grid-cols-7 px-2 py-3 my-4 rounded-md gap-4'>
            <input
              type="text"
              className='outline-1 px-2 outline-gray-100 focus:outline-black rounded-sm' placeholder='Customer name'
              value={filters.customer}
              onChange={handleChange("customer")}

            />

            <DatePicker
              value={filters.startDate ? dayjs(filters.startDate) : null}
              onChange={handleDateChange("startDate")}
              needConfirm />

            <DatePicker
              value={filters.endDate ? dayjs(filters.endDate) : null}
              onChange={handleDateChange("endDate")}
              needConfirm />
            <input
              type="number"
              value={filters.minTotal}
              onChange={handleChange("minTotal")}
              className='outline-1 px-2 outline-gray-100 focus:outline-black rounded-sm' />

            <input
              type="number"
              value={filters.maxTotal}
              onChange={handleChange("maxTotal")}
              className='outline-1 px-2 outline-gray-100 focus:outline-black rounded-sm' />
            <button onClick={()=>handleSearchInvoices(filters)} className='cursor-pointer font-primary font-medium bg-blue-500 text-white rounded-md py-2'>search</button>
            <button onClick={handleResetFilters} className='cursor-pointer font-primary font-medium bg-gray-200 rounded-md'>reset</button>
          </div>


          {/* table  */}

          <Table columns={columns} dataSource={invoices} size="middle" pagination={false} />


        </div>

      </div>
    </ConfigProvider>
  )
}

export default Invoices
