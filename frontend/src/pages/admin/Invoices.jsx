import React from 'react'
import { MdHome } from 'react-icons/md'
import { DatePicker } from 'antd';
import { Divider, Table } from 'antd';


const onChange = (date, dateString) => {
  console.log(date, dateString);
};

const columns = [
  {
    title: 'Customer',
    dataIndex: 'name',
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
{
    title: 'Date',
    dataIndex: 'date',
  },
{
    title: 'subtotal',
    dataIndex: 'subtotal',
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
    dataIndex: 'actions',
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

const Invoices = () => {
  return (
    <div>

     <div>
              <div className='flex items-center gap-1 mb-4'>
      
                <MdHome size={15} />
                <h6 className='font-primary font-medium'>Home</h6>
              </div>
              <div className='flex items-center justify-between'>

        <h2 className='font-primary text-xl font-bold mb-2'>Invoices</h2>
        <button className='bg-blue-600 font-primary font-medium px-4 py-2 rounded-md text-white'>Create Invoice</button>
              </div>

              {/* the uppper div */}
              <div className='bg-white shadow-md grid grid-cols-7 px-2 py-3 my-4 rounded-md gap-4'>
                 <input type="text" className='outline-1 px-2 outline-gray-100 focus:outline-black' placeholder='Customer name' />
                 <DatePicker onChange={onChange} needConfirm />
                 <DatePicker onChange={onChange} needConfirm />
                 <input type="number" placeholder='Min Total' className='outline-1 px-2 outline-gray-100 focus:outline-black'/>
                 <input type="number" placeholder='Max Total' className='outline-1 px-2 outline-gray-100 focus:outline-black' />
                 <button className='font-primary font-medium bg-blue-500 text-white rounded-md py-2'>search</button>
                 <button className='font-primary font-medium bg-gray-200 rounded-md'>reset</button>
              </div>


              {/* table  */}

       <Table columns={columns} dataSource={data} size="middle" />

      
      </div>      
      
    </div>
  )
}

export default Invoices
