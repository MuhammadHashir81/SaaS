import React from "react";
import { MdHome } from "react-icons/md";
import { ConfigProvider, DatePicker } from "antd";
import { Select } from 'antd';
import { FaPlus } from "react-icons/fa6";
import {  Table } from 'antd';
const onChange = (date, dateString) => {
    console.log(date, dateString);
};


const columns = [
  {
    title: 'Date',
    dataIndex: 'date',
  },
  {
    title: 'Category',
    dataIndex: 'category',
  },
{
    title: 'Description',
    dataIndex: 'description',
  },
{
    title: 'Amount',
    dataIndex: 'amount',
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
    address: 'New York No. 1 Lake Park',
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
const Outflows = () => {
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

        <div className="p-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1 mb-4 text-gray-600">
                <MdHome size={16} />
                <h6 className="font-primary font-medium">Home</h6>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-primary text-xl font-bold">
                    Outflows Management
                </h2>

            </div>

            {/* Filter Card */}
            <div className="bg-white shadow-md rounded-md p-5 grid grid-cols-4 gap-5">

                {/* Search */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="search" className="text-sm font-medium text-gray-600">
                        Search
                    </label>
                    <input
                        type="text"
                        id="search"
                        placeholder="Search..."
                        className="h-[40px] px-3 rounded-sm border border-1 border-gray-300 focus:outline-none focus:border-black hover:border-black"
                    />
                </div>

                {/* From Date */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="fromDate" className="text-sm font-medium text-gray-600">
                        From Date
                    </label>
                    <DatePicker
                        onChange={onChange}
                        className="h-[40px] w-full"
                        id="fromDate"
                    />
                </div>

                {/* To Date */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="toDate" className="text-sm font-medium text-gray-600">
                        To Date
                    </label>
                    <DatePicker
                        onChange={onChange}
                        className="h-[40px] w-full "
                        id="toDate"
                    />
                </div>

                {/* Filter Button */}
                <div className="flex items-end">
                    <button className="h-[40px] w-[80px] font-primary font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md transition     ">
                        Filter
                    </button>
                </div>

            </div>

            <div className="rounded-md bg-white shadow-md p-5 my-5">
                <h2 className='font-primary text-base font-semibold'> Add New Outflow</h2>
                <div className="flex items-center gap-4 my-5">

                    <div className="w-[50%] flex flex-col gap-1">
                        <label htmlFor="outflowDate" className="font-primary font-base font-semibold rounded-none ">Date</label>
                        <DatePicker
                            onChange={onChange}
                            className="h-[40px] w-full "
                            id="outflowDate"
                        />
                    </div>

                    <div className="w-[50%] flex flex-col gap-1">
                        <label htmlFor="outflowCategory" className="font-primary font-base font-semibold rounded-none ">Category</label>
                        <Select
                            placeholder="Select an option"
                            showSearch={{
                                optionFilterProp: ['label', 'otherField'],
                            }}
                            id="outflowCategory"
                            options={[
                                { value: 'a11', label: 'a11', otherField: 'c11' },
                                { value: 'b22', label: 'b22', otherField: 'b11' },
                                { value: 'c33', label: 'c33', otherField: 'b33' },
                                { value: 'd44', label: 'd44', otherField: 'd44' },
                            ]}
                            className="h-[40px] w-full outline-2"
                        />

                    </div>


                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="outflowTextarea"  className="font-primary font-base font-semibold rounded-none ">Description</label>

                    <textarea name="outflowTextarea" id="outflowTextarea" 
                    className="outline-1 outline-gray-200 focus:outline-black px-3 py-4 hover:outline-black rounded-sm"  rows={2} >

                    </textarea>
                </div>
                <div className="flex flex-col gap-1 mt-4">

                    <label htmlFor="outflowAmount" className="font-primary font-base font-semibold rounded-none ">Amount</label>
                    <input 
                    id="outflowAmount"
                    type="number"
                    className="outline-1 outline-gray-200  outline-1 hover:outline-black rounded-sm focus:outline-black px-4 py-1 w-96 h-9" />
                    <button className="cursor-pointer hover:cursor-pointer hover:bg-green-700 transition ease-in-out duration-75 bg-green-600 font-primary w-32 rounded-sm py-2 mt-3
                    text-white text-sm" >Add outflow</button>

                </div>

            </div>
                <Table columns={columns} dataSource={data} size="middle" className="mt-8"/>
        </div>
        </ConfigProvider>

    );
};

export default Outflows;