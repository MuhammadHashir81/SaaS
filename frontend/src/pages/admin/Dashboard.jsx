import React from 'react'
import { Radio, Select } from 'antd';
import { useState } from 'react';
import { MdHome } from "react-icons/md";
import { DatePicker, Space } from 'antd';
import { Card, Col, Row, Statistic } from 'antd';


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

const { RangePicker } = DatePicker;



const Dashboard = () => {


  // Cash flow trend data

  const data = [
    { month: 'Jan', inflow: 4000, outflow: 1200 },
    { month: 'Feb', inflow: 3000, outflow: 900 },
    { month: 'Mar', inflow: 5000, outflow: 2000 },
    { month: 'Apr', inflow: 4500, outflow: 1800 },
    { month: 'May', inflow: 6000, outflow: 2500 },
    { month: 'Jun', inflow: 5500, outflow: 1600 },
    { month: 'Jul', inflow: 7000, outflow: 3000 },
    { month: 'Aug', inflow: 6500, outflow: 2200 },
  ];



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




  const [selected, setSelected] = useState("Last 30 Days");

  const options = [];
  for (let i = 10; i < 36; i++) {
    options.push({
      value: i.toString(36) + i,
      label: i.toString(36) + i,
    });
  }
  const handleChange = value => {
    console.log(`selected ${value}`);
  };

  return (
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
                onClick={() => setSelected(range)}
                className={` font-primary w-fit px-3 py-1 rounded-md color-white  ${selected === range ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
              >
                {range}
              </button>
            ))}

          </div>
          <div className=' grid grid-cols-3 gap-4'>


            <div className=''>
              <h2 className='font-primary font-medium'>Custom Start Date</h2>
              <Space vertical size={12}>
                <RangePicker />

              </Space>
            </div>

            <div className=''>
              <h2 className='font-primary font-medium'>Filter by Product</h2>
              <Select
                mode="tags"
                style={{ width: '100%' }}
                placeholder="Tags Mode"
                onChange={handleChange}
                options={options}
              />

            </div>
            <div className=''>
              <h2 className='font-primary font-medium'> Filter by Customer</h2>
              <Select
                mode="tags"
                style={{ width: '100%' }}
                placeholder="Tags Mode"
                onChange={handleChange}
                options={options}
              />

            </div>
          </div>

          <div className='mt-5 flex gap-4'>

            <button className=' bg-blue-500 px-6 py-3 text-white font-primary font-medium rounded-md cursor-pointer hover:bg-blue-600'>Apply Filters</button>
            <button className=' bg-gray-200 hover:bg-gray-300 cursor-pointer text-black px-6 py-3  font-primary font-medium rounded-md'>Clear Filters</button>
          </div>

        </div>
      </div>
      <div>

        <Row gutter={16}>

          <Col span={8}>
            <Card variant="borderless">
              <Statistic
                title="Total Inflow"
                value={11.28}
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
                suffix="%"
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card variant="borderless">
              <Statistic
                title="Total Outflow"
                value={9.3}
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
                suffix="%"
              />
            </Card>
          </Col>

          <Col span={8}>
            <Card variant="borderless">
              <Statistic

                title="Net Cash flow"
                value={1000}
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
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
            <AreaChart data={productTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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

              <h3 className=' font-primary text-lg font-bold '>Top Products</h3>
              <button className='bg-blue-500 font-primary  px-3 py-2 rounded-md'>Manage Products</button>
              </div>
              {
                topProducts.map((product)=>(
                  <div className='flex items-center justify-between'>
                  <p className='font-primary font-medium my-1'>{product.name}</p>
                  <p className='font-primary font-medium text-green-500 my-1'>{product.sales}</p>
                  </div>

                ))
              }
              
            </div>

            <div className='bg-white my-5 rounded-md px-4 py-7 w-[50%] h-[300px]'>
              <div className='flex justify-between items-center mb-4'>

              <h3 className=' font-primary text-xl font-semibold '>Top Products</h3>
              <button className='bg-blue-500 font-primary  px-3 py-2 rounded-md'>Manage Products</button>
              </div>
              {
                topProducts.map((product)=>(
                  <div className='flex items-center justify-between'>
                  <p className='font-primary font-light text-lg my-1 '>{product.name}</p>
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
  )
}

// Salteen
// SalteenPinkSalt
// SalteenPinkJar
// SalteenJar
// SalteenBlackSalt
// SalteenRefinedTabl

export default Dashboard
