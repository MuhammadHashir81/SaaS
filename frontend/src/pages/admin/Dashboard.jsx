  import React from 'react'
  import { Radio, Select } from 'antd';
  import { useState } from 'react';
  import { MdHome } from "react-icons/md";
  import { DatePicker, Space } from 'antd';
  import { Card, Col, Row, Statistic } from 'antd';
  import { ConfigProvider } from "antd";
  import { api } from '../../../api/api';


  import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from 'recharts';
  import { useEffect } from 'react';
  import { set } from 'react-hook-form';

  const { RangePicker } = DatePicker;

  console.log(RangePicker)



  const Dashboard = () => {


    // product charts data

    const productTrendData = [

      {
        month: 'Jan',
        Salteen: 9000,
        SalteenPinkSalt: 3500,
        SalteenPinkJar: 550,
        SalteenJar: 9000,
        SalteenBlackSalt: 6000,
        SalteenRefinedTabl: 5500,
      },

      {
        month: 'Feb',
        Salteen: 4000,
        SalteenPinkSalt: 3000,
        SalteenPinkJar: 5000,
        SalteenJar: 4500,
        SalteenBlackSalt: 6000,
        SalteenRefinedTabl: 5500,

      },

      {
        month: 'Mar',
        Salteen: 4000,
        SalteenPinkSalt: 3000,
        SalteenPinkJar: 5000,
        SalteenJar: 4500,
        SalteenBlackSalt: 6000,
        SalteenRefinedTabl: 5500,

      },
      {
        month: 'Apr',
        Salteen: 4000,
        SalteenPinkSalt: 3000,
        SalteenPinkJar: 5000,
        SalteenJar: 4500,
        SalteenBlackSalt: 6000,
        SalteenRefinedTabl: 5500,

      },
      {
        month: 'May',
        Salteen: 4000,
        SalteenPinkSalt: 3000,
        SalteenPinkJar: 5000,
        SalteenJar: 4500,
        SalteenBlackSalt: 6000,
        SalteenRefinedTabl: 5500,

      },
      {
        month: 'Jun',
        Salteen: 4000,
        SalteenPinkSalt: 3000,
        SalteenPinkJar: 5000,
        SalteenJar: 4500,
        SalteenBlackSalt: 6000,
        SalteenRefinedTabl: 5500,

      },
      {
        month: 'Jul',
        Salteen: 2000,
        SalteenPinkSalt: 1000,
        SalteenPinkJar: 500,
        SalteenJar: 450,
        SalteenBlackSalt: 60,
        SalteenRefinedTabl: 550,
      },
      {
        month: 'Aug',
        Salteen: 4000,
        SalteenPinkSalt: 3000,
        SalteenPinkJar: 5000,
        SalteenJar: 4500,
        SalteenBlackSalt: 6000,
        SalteenRefinedTabl: 5500,
      },
    ]


    // top producsts

    const topProducts = [
      { name: "Salteen", sales: 9000 },
      { name: "SalteenPinkSalt", sales: 3500 },
      { name: "SalteenPinkJar", sales: 550 },
      { name: "SalteenJar", sales: 9000 },
      { name: "SalteenBlackSalt", sales: 6000 },
      { name: "SalteenRefinedTabl", sales: 5500 }
    ];

    const ranges = [
      "Today",
      "Last 7 Days",
      "Last 30 Days",
      "This Month",
      "Last Month",
      "Last 3 Months",
      "Last 6 Months",
      "Last 9 Months",
      "Last 12 Months",
      "This year",
      "Last year",
      "All Time",
    ];



    const [products, setProducts] = useState([])
    const [totalProducts, setTotalProducts] = useState([])
    const [isSearching, setIsSearching] = useState(false)
    const [search, setSearch] = useState('')
    const [productSearch, setProductSearch] = useState('')
    const [customers, setCustomers] = useState([])
    const [selectedCustomer, setSelectedCustomer] = useState('')
    const [customerSearch, setCustomerSearch] = useState('')
    const [selectedRange, setSelectedRange] = useState("Last 30 Days");
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [product, setProduct] = useState('')
    const [customer, setCustomer] = useState('')
    const [totalInflow, setTotalInflow] = useState('')
    const [totalOutflow, setTotalOutflow] = useState('')
    const [netCashFlow, setNetCashFlow] = useState('')
    const [cashFlowTrend, setCashFlowTrend] = useState([])
    const [topTrendProducts,setTopTrendProducts] = useState([])


    const options = [];
    for (let i = 10; i < 36; i++) {
      options.push({
        value: i.toString(36) + i,
        label: i.toString(36) + i,
      });
    }


    // filter api 

    const handleFilters = async () => {
      console.log("filtering data...")
      try {
        const response = await api.post(`/api/dashboard/summary`,
          {
            range: selectedRange,
            startDate: startDate,
            endDate: endDate,
            product: product,
            customer: selectedCustomer
          }
        )

        setTotalInflow(response.totals.totalInflow)
        setTotalOutflow(response.totals.totalOutflow)
        setNetCashFlow(response.totals.netCashFlow)
        const formatted = response.trend.map(item => ({
          month: new Date(item.date).toLocaleString('default', { month: 'short' }),
          inflow: item.inflow,
          outflow: item.outflow
        }));

        const formattedTopProducts = response.topProducts.map( item=>({
        month:new Date(item.date).toLocaleDateString('default', {month:'short' }),
        product:item.name,

      }))

        setCashFlowTrend(formatted);
        setTopTrendProducts(formattedTopProducts)



        console.log("this is total cashflow",response.trend)
        console.log("these are top products", response.topProducts)
      } catch (error) { 
        console.log(error)
      }
    }

    useEffect(() => {
      handleFilters()
    }, [selectedRange])


    // clear all filters

    const handleClearFilters = () => {
      console.log('clearing filters....')
      window.location.reload()
      setSelectedRange('')
      setStartDate('')
      setEndDate('')
      setProduct('')
      setSelectedCustomer('')
    }
    // handle product select

    const handleProductSelect = (value, record) => {
      const selectedProduct = products.find(product => product._id === value);
      console.log(selectedProduct._id)

      setProduct(selectedProduct._id)
    }



    //  search query 

    const handleSearchQuery = async () => {
      const response = await api.get(`/api/product/search?q=${productSearch}`)
      setProducts(response.data)
      setTotalProducts(response.totalProducts)
      console.log('searched response', response)
    }

    useEffect(() => {
      handleSearchQuery()
    }, [productSearch])


    // handle customer select 

    const handleCustomerSelect = (id) => {
      const customer = customers.find(cus => cus._id === id);
      console.log(customer)
      setSelectedCustomer(customer._id)
    }


    // handle searching customers


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
      handleSearchedCustomers()
    }, [customerSearch])



    // }
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
        <div className=''>
          <div className=''>

            <div className='flex items-center gap-1 mb-4'>

              <MdHome size={15} />
              <h6 className='font-primary font-medium'>Home</h6>
            </div>
            <h2 className='font-primary text-xl font-bold mb-2'>Dashboard</h2>
            <div className=' rounded-lg bg-white shadow-sm px-4 py-4 my-4'>

              <div className=''>

                <h3 className='font-primary font-semibold text-lg mb-4'>Filters</h3>
                <h4 className='font-primary font-medium'>Quick Date ranges</h4>
              </div>

              <div className='flex gap-3 flex-wrap my-5'>

                {ranges.map((range) => (
                  <button
                    onClick={() => setSelectedRange(range)}
                    className={` cursor-pointer font-primary w-fit px-3 py-1 rounded-md color-white  ${selectedRange === range ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
                  >
                    {range}
                  </button>
                ))}

              </div>
              <div className=' grid grid-cols-2  gap-4'>


                <div className='flex flex-col gap-1 '>
                  <h2 className='font-primary font-medium'>Start Date </h2>
                  <Space vertical size={12}>
                    <DatePicker
                      value={startDate}
                      className='w-full'
                      onChange={(date) => setStartDate(date)}
                    />
                  </Space>

                </div>
                <div className='flex flex-col gap-1 '>
                  <h2 className='font-primary font-medium'>End Date</h2>
                  <Space vertical size={12}>
                    <DatePicker
                      value={endDate}
                      className='w-full'
                      onChange={(date) => setEndDate(date)}
                    />
                  </Space>
                </div>

                <div className='flex flex-col gap-1'>
                  <h2 className='font-primary font-medium'>Filter by Product</h2>
                  <Select
                    style={{ width: '100%' }}
                    value={product}
                    placeholder="products"
                    showSearch={{
                      optionFilterProp: ['label'],
                    }}
                    onSelect={(value) => handleProductSelect(value)}
                    options={products.map((product) => (
                      { value: `${product._id}`, label: `${product.name}` }
                    ))}
                  />

                </div>
                <div className='flex flex-col gap-1'>
                  <h2 className='font-primary font-medium'>Filter by Customer</h2>
                  <Select
                    style={{ width: 250, }}
                    value={selectedCustomer}
                    placeholder="Select an option"
                    showSearch={{
                      optionFilterProp: ['label'],
                    }}
                    onSelect={(value) => handleCustomerSelect(value)}
                    options={customers.map((customer) => (
                      { value: `${customer._id}`, label: `${customer.name}` }
                    ))}
                  />
                </div>
              </div>

              <div className='mt-7 flex gap-4'>

                <button onClick={() => handleFilters()} className=' bg-blue-500 px-6 py-3 text-white font-primary font-medium rounded-md cursor-pointer hover:bg-blue-600'>Apply Filters</button>
                <button onClick={handleClearFilters} className=' bg-gray-200 hover:bg-gray-300 cursor-pointer text-black px-6 py-3  font-primary font-medium rounded-md'>Clear Filters</button>
              </div>

            </div>
          </div>
          <div>

            <Row gutter={16}>

              <Col span={8}>
                <Card variant="borderless">
                  <Statistic
                    title="Total Inflow"
                    value={totalInflow}
                    precision={2}
                    styles={{
                      content:
                      {
                        color: 'blue',
                        fontWeight: 'bold',
                        fontFamily: 'var(--font-primary)',
                        fontSize: '30px'

                      }
                      ,
                      title: {
                        fontFamily: 'var(--font-primary)',
                        fontWeight: 'bolder',
                        fontSize: '15px'
                      }
                    }}
                    suffix="PKR"
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card variant="borderless">
                  <Statistic
                    title="Total Outflow"
                    value={totalOutflow}
                    precision={2}
                    styles={
                      {
                        content: {
                          color: '#cf1322',
                          fontFamily: 'var(--font-primary)',
                          fontWeight: 'bold',
                          fontSize: '30px'

                        },
                        title: {
                          fontFamily: 'var(--font-primary)',
                          fontWeight: 'bolder',
                          fontSize: '15px'
                        }
                      }


                    }
                    suffix="PKR"
                  />
                </Card>
              </Col>

              <Col span={8}>
                <Card variant="borderless">
                  <Statistic

                    title="Net Cash flow"
                    value={netCashFlow}
                    styles={{
                      content:
                      {
                        color: 'blue',
                        fontWeight: 'bold',
                        fontFamily: 'var(--font-primary)',
                        fontSize: '30px'

                      }
                      ,
                      title: {
                        fontFamily: 'var(--font-primary)',
                        fontWeight: 'bolder',
                        fontSize: '15px'
                      }
                    }}
                    suffix="PKR"
                  />
                </Card>
              </Col>

            </Row>
          </div>


          {/* charts  */}
          {/*Cash flow trend charts */}
          <div>


            <div className='bg-white my-5 rounded-md px-4 py-7'>
              <h2 className='font-primary font-medium  text-xl'>Cash Flow Trend</h2>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={cashFlowTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="inflowGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="outflowGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend verticalAlign="top" align="center" />


                  <Area
                    type="monotone"
                    dataKey="inflow"
                    stroke="#22c55e"
                    fill="url(#inflowGrad)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="outflow"
                    stroke="#ef4444"
                    fill="url(#outflowGrad)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Product sales trend charts */}

            <div className='bg-white my-5 rounded-md px-4 py-7'>
              <h2 className='font-primary font-medium  text-xl'>Product Sales Trend(Top 10 products)</h2>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={topTrendProducts} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="inflowGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="outflowGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend verticalAlign="top" align="center" />


                  <Area
                    type="monotone"
                    dataKey="Salteen"
                    stroke="orange"
                    fill="url(#inflowGrad)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="SalteenPinkSalt"
                    stroke="black"
                    fill="url(#outflowGrad)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="SalteenPinkJar"
                    stroke="blue"
                    fill="url(#inflowGrad)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="SalteenJar"
                    stroke="purple"
                    fill="url(#outflowGrad)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="SalteenBlackSalt"
                    stroke="cyan"
                    fill="url(#outflowGrad)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="SalteenRefinedTabl"
                    stroke="#ef4444"
                    fill="url(#outflowGrad)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>


          {/* end of charts  */}


          <div>

            {/* footer */}

            <div >

              <div className='flex justify-between gap-3'>

                <div className='bg-white my-5 rounded-md px-4 py-7 w-[50%] h-[300px]'>
                  <div className='flex justify-between items-center mb-4'>

                    <h3 className=' font-primary text-lg font-semibold '>Top Products</h3>
                    <button className='bg-blue-500 font-primary  px-3 py-2 rounded-md text-white font-medium'>Manage Products</button>
                  </div>
                  {
                    topProducts.map((product) => (
                      <div className='flex items-center justify-between'>
                        <p className='font-primary font-medium my-1'>{product.name}</p>
                        <p className='font-primary font-medium text-green-500 my-1'>{product.sales}</p>
                      </div>

                    ))
                  }

                </div>

                <div className='bg-white my-5 rounded-md px-4 py-7 w-[50%] h-[300px]'>
                  <div className='flex justify-between items-center mb-4'>

                    <h3 className=' font-primary text-lg font-semibold '>Top Customers</h3>
                    <button className='bg-blue-500 font-primary  px-3 py-2 rounded-md text-white font-medium'>Manage Customers</button>
                  </div>
                  {
                    topProducts.map((product) => (
                      <div className='flex items-center justify-between'>
                        <p className='font-primary font-medium  my-1 '>{product.name}</p>
                        <p className='font-primary font-medium text-green-500 my-1'>{product.sales}</p>
                      </div>

                    ))
                  }

                </div>

              </div>

            </div>

            {/* end of footer  */}

          </div>



        </div>
      </ConfigProvider>
    )
  }

  export default Dashboard


