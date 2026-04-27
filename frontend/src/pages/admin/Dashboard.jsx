import { useEffect, useState } from 'react';
import { Card, Col, ConfigProvider, DatePicker, Row, Select, Space, Statistic } from 'antd';
import {NavLink} from 'react-router-dom'
import { MdHome } from 'react-icons/md';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { api } from '../../../api/api';

const DEFAULT_RANGE = 'Last 30 Days';
const QUICK_RANGES = [
  'Today',
  'Last 7 Days',
  'Last 30 Days',
  'This Month',
  'Last Month',
  'Last 3 Months',
  'Last 6 Months',
  'Last 9 Months',
  'Last 12 Months',
  'This year',
  'Last year',
  'All Time',
];

const formatRequestDate = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value.toISOString === 'function') {
    return value.toISOString();
  }

  return value;
};

const formatCompactLabel = (value = '') => {
  if (value.length <= 14) {
    return value;
  }

  return `${value.slice(0, 14)}...`;
};

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedRange, setSelectedRange] = useState(DEFAULT_RANGE);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [totalInflow, setTotalInflow] = useState(0);
  const [totalOutflow, setTotalOutflow] = useState(0);
  const [netCashFlow, setNetCashFlow] = useState(0);
  const [cashFlowTrend, setCashFlowTrend] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);

  const buildPayload = (overrides = {}) => ({
    range: overrides.range ?? selectedRange,
    startDate: formatRequestDate(overrides.startDate ?? startDate),
    endDate: formatRequestDate(overrides.endDate ?? endDate),
    product: overrides.product ?? selectedProduct,
    customer: overrides.customer ?? selectedCustomer,
  });

  const fetchDashboardData = async (overrides = {}) => {
    try {
      const payload = buildPayload(overrides);

      const [summaryResponse, topProductsResponse, topCustomersResponse] = await Promise.all([
        api.post('/api/dashboard/summary', payload),
        api.post('/api/dashboard/top-products', payload),
        api.post('/api/dashboard/top-customers', payload),
      ]);

      setTotalInflow(summaryResponse?.totals?.totalInflow || 0);
      setTotalOutflow(summaryResponse?.totals?.totalOutflow || 0);
      setNetCashFlow(summaryResponse?.totals?.netCashFlow || 0);
      setCashFlowTrend(
        (summaryResponse?.trend || []).map((item) => ({
          label: item.label,
          inflow: item.inflow,
          outflow: item.outflow,
        })),
      );
      setTopProducts(topProductsResponse?.topProducts || []);
      setTopCustomers(topCustomersResponse?.data || []);
    } catch (error) {
      console.log(error);
      setCashFlowTrend([]);
      setTopProducts([]);
      setTopCustomers([]);
    }
  };

  const handleApplyFilters = () => {
    fetchDashboardData();
  };

  const handleClearFilters = () => {
    setSelectedRange(DEFAULT_RANGE);
    setStartDate(null);
    setEndDate(null);
    setSelectedProduct('');
    setSelectedCustomer('');
    fetchDashboardData({
      range: DEFAULT_RANGE,
      startDate: null,
      endDate: null,
      product: '',
      customer: '',
    });
  };

  const handleSearchProducts = async () => {
    try {
      const response = await api.get(`/api/product/search?q=${productSearch}`);
      setProducts(response?.data || []);
    } catch (error) {
      console.log(error);
      setProducts([]);
    }
  };

  const handleSearchCustomers = async () => {
    try {
      const response = await api.get(`/api/customer/search?q=${customerSearch}`);
      setCustomers(response?.data || []);
    } catch (error) {
      console.log(error);
      setCustomers([]);
    }
  };

  useEffect(() => {
    handleSearchProducts();
  }, [productSearch]);

  useEffect(() => {
    handleSearchCustomers();
  }, [customerSearch]);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedRange]);

  return (
    <ConfigProvider
      theme={{
        components: {
          DatePicker: {
            activeBorderColor: 'black',
            hoverBorderColor: 'black',
            lineWidth: 1,
            borderRadius: 4,
          },
          Select: {
            activeBorderColor: 'black',
            hoverBorderColor: 'black',
            lineWidth: 1,
            borderRadius: 4,
          },
        },
      }}
    >
      <div>
        <div>
          <div className='flex items-center gap-1 mb-4'>
            <MdHome size={15} />
            <h6 className='font-primary font-medium'>Home</h6>
          </div>

          <h2 className='font-primary text-xl font-bold mb-2'>Dashboard</h2>

          <div className='rounded-lg bg-white shadow-sm px-4 py-4 my-4'>
            <div>
              <h3 className='font-primary font-semibold text-lg mb-4'>Filters</h3>
              <h4 className='font-primary font-medium'>Quick Date Ranges</h4>
            </div>

            <div className='flex gap-3 flex-wrap my-5'>
              {QUICK_RANGES.map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedRange(range)}
                  className={`cursor-pointer font-primary w-fit px-3 py-1 rounded-md ${selectedRange === range ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                >
                  {range}
                </button>
              ))}
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-1'>
                <h2 className='font-primary font-medium'>Start Date</h2>
                <Space vertical size={12}>
                  <DatePicker
                    value={startDate}
                    className='w-full'
                    onChange={(date) => setStartDate(date)}
                  />
                </Space>
              </div>

              <div className='flex flex-col gap-1'>
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
                  value={selectedProduct || undefined}
                  placeholder='Products'
                  style={{ width: '100%' }}
                  showSearch
                  optionFilterProp='label'
                  filterOption={false}
                  onSearch={setProductSearch}
                  onSelect={(value) => setSelectedProduct(value)}
                  allowClear
                  onClear={() => setSelectedProduct('')}
                  options={products.map((product) => ({
                    value: product._id,
                    label: product.name,
                  }))}
                />
              </div>

              <div className='flex flex-col gap-1'>
                <h2 className='font-primary font-medium'>Filter by Customer</h2>
                <Select
                  value={selectedCustomer || undefined}
                  placeholder='Customers'
                  style={{ width: '100%' }}
                  showSearch
                  optionFilterProp='label'
                  filterOption={false}
                  onSearch={setCustomerSearch}
                  onSelect={(value) => setSelectedCustomer(value)}
                  allowClear
                  onClear={() => setSelectedCustomer('')}
                  options={customers.map((customer) => ({
                    value: customer._id,
                    label: customer.name,
                  }))}
                />
              </div>
            </div>

            <div className='mt-7 flex gap-4'>
              <button
                onClick={handleApplyFilters}
                className='bg-blue-500 px-6 py-3 text-white font-primary font-medium rounded-md cursor-pointer hover:bg-blue-600'
              >
                Apply Filters
              </button>
              <button
                onClick={handleClearFilters}
                className='bg-gray-200 hover:bg-gray-300 cursor-pointer text-black px-6 py-3 font-primary font-medium rounded-md'
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        <div>
          <Row gutter={16}>
            <Col span={8}>
              <Card variant='borderless'>
                <Statistic
                  title='Total Inflow'
                  value={totalInflow}
                  precision={2}
                  suffix='PKR'
                  styles={{
                    content: {
                      color: 'blue',
                      fontWeight: 'bold',
                      fontFamily: 'var(--font-primary)',
                      fontSize: '30px',
                    },
                    title: {
                      fontFamily: 'var(--font-primary)',
                      fontWeight: 'bolder',
                      fontSize: '15px',
                    },
                  }}
                />
              </Card>
            </Col>

            <Col span={8}>
              <Card variant='borderless'>
                <Statistic
                  title='Total Outflow'
                  value={totalOutflow}
                  precision={2}
                  suffix='PKR'
                  styles={{
                    content: {
                      color: '#cf1322',
                      fontFamily: 'var(--font-primary)',
                      fontWeight: 'bold',
                      fontSize: '30px',
                    },
                    title: {
                      fontFamily: 'var(--font-primary)',
                      fontWeight: 'bolder',
                      fontSize: '15px',
                    },
                  }}
                />
              </Card>
            </Col>

            <Col span={8}>
              <Card variant='borderless'>
                <Statistic
                  title='Net Cash Flow'
                  value={netCashFlow}
                  suffix='PKR'
                  styles={{
                    content: {
                      color: 'blue',
                      fontWeight: 'bold',
                      fontFamily: 'var(--font-primary)',
                      fontSize: '30px',
                    },
                    title: {
                      fontFamily: 'var(--font-primary)',
                      fontWeight: 'bolder',
                      fontSize: '15px',
                    },
                  }}
                />
              </Card>
            </Col>
          </Row>
        </div>

        <div>
          <div className='bg-white my-5 rounded-md px-4 py-7'>
            <h2 className='font-primary font-medium text-xl'>Cash Flow Trend</h2>
            <ResponsiveContainer width='100%' height={350}>
              <AreaChart data={cashFlowTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id='inflowGrad' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='#22c55e' stopOpacity={0.4} />
                    <stop offset='95%' stopColor='#22c55e' stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id='outflowGrad' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='#ef4444' stopOpacity={0.4} />
                    <stop offset='95%' stopColor='#ef4444' stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='label' />
                <YAxis />
                <Tooltip />
                <Legend verticalAlign='top' align='center' />
                <Area
                  type='monotone'
                  dataKey='inflow'
                  stroke='#22c55e'
                  fill='url(#inflowGrad)'
                  strokeWidth={2}
                />
                <Area
                  type='monotone'
                  dataKey='outflow'
                  stroke='#ef4444'
                  fill='url(#outflowGrad)'
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className='bg-white my-5 rounded-md px-4 py-7'>
            <h2 className='font-primary font-medium text-xl'>Top 10 selling products</h2>
            <ResponsiveContainer width='100%' height={350}>
              <AreaChart data={topProducts} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id='productSalesGrad' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='5%' stopColor='#2563eb' stopOpacity={0.45} />
                    <stop offset='95%' stopColor='#2563eb' stopOpacity={0.05} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' tickFormatter={formatCompactLabel} />
                <YAxis />
                <Tooltip />
                <Legend verticalAlign='top' align='center' />
                <Area
                  type='monotone'
                  dataKey='totalSales'
                  name='Sales'
                  stroke='#2563eb'
                  fill='url(#productSalesGrad)'
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <div className='flex justify-between gap-3'>
            <div className='bg-white my-5 rounded-md px-4 py-7 w-[50%] min-h-[300px]'>
              <div className='flex justify-between items-center mb-4'>
                <h3 className='font-primary text-lg font-semibold'>Top Products</h3>
                <NavLink to='/admin/products' className='bg-blue-500 font-primary px-3 py-2 rounded-md text-white font-medium'>
                  Manage Products
                </NavLink>
              </div>

              {topProducts.length ? (
                topProducts.map((product) => (
                  <div key={product.productId || product.name} className='flex items-center justify-between'>
                    <p className='font-primary font-medium my-1'>{product.name}</p>
                    <p className='font-primary font-medium text-green-500 my-1'>{product.totalSales}</p>
                  </div>
                ))
              ) : (
                <p className='font-primary text-gray-500'>No product data available for the selected filters.</p>
              )}
            </div>

            <div className='bg-white my-5 rounded-md px-4 py-7 w-[50%] min-h-[300px]'>
              <div className='flex justify-between items-center mb-4'>
                <h3 className='font-primary text-lg font-semibold'>Top Customers</h3>
                <NavLink to='/admin/customers' className='bg-blue-500 font-primary px-3 py-2 rounded-md text-white font-medium'>
                  Manage Customers
                </NavLink>
              </div>

              {topCustomers.length ? (
                topCustomers.map((customer) => (
                  <div key={customer.customerId || customer.name} className='flex items-center justify-between'>
                    <p className='font-primary font-medium my-1'>{customer.name}</p>
                    <p className='font-primary font-medium text-green-500 my-1'>{customer.totalSales}</p>
                  </div>
                ))
              ) : (
                <p className='font-primary text-gray-500'>No customer data available for the selected filters.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Dashboard;
