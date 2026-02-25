import React from 'react'
import { Radio, Select } from 'antd';
import { useState } from 'react';
import { MdHome } from "react-icons/md";
import { DatePicker, Space } from 'antd';

const { RangePicker } = DatePicker;


const Dashboard = () => {

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
    <div>
      <div className='flex items-center gap-1 mb-4'>

        <MdHome size={15} />
        <h6 className='font-primary font-medium'>Home</h6>
      </div>
      <h2 className='font-primary text-xl font-bold mb-2'>Dashboard</h2>
      <div className='rounded-lg bg-white shadow-sm px-4 py-4'>

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

          <button className=' bg-blue-500 px-6 py-3 text-white font-primary font-medium rounded-md'>Apply Filters</button>
          <button className=' bg-gray-200 text-black px-6 py-3  font-primary font-medium rounded-md'>Clear Filters</button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
