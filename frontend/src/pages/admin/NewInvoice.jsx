import React from 'react'
import { Select } from 'antd';
import { FaPlus } from 'react-icons/fa6';
import { MdHome } from 'react-icons/md'
import { Divider, Table } from 'antd';


const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
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
const NewInvoice = () => {
  return (
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
            style={{ width: 250, backgroundColor: '#f5f5f5' }}

    placeholder="Select an option"
    showSearch={{
      optionFilterProp: ['label', 'otherField'],
    }}
    options={[
      { value: 'a11', label: 'a11', otherField: 'c11' },
      { value: 'b22', label: 'b22', otherField: 'b11' },
      { value: 'c33', label: 'c33', otherField: 'b33' },
      { value: 'd44', label: 'd44', otherField: 'd44' },
    ]}
    />
    <button className='font-primary  flex items-center gap-2 text-blue-500 cursor-pointer'>
        <FaPlus/>
        Add New Customer
        </button>
    </div>
    
        {/* Invoice items div */}

        <div>
            <h2 className='font-primary font-bold text-base'>Invoice Items</h2>
        </div>

            <Table columns={columns} dataSource={data} size="middle" />

        </div>


            
    </div>
  )
}

export default NewInvoice
