import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Card, Col, ConfigProvider, DatePicker, Empty, Row, Select, Statistic } from 'antd';
import { MdHome } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
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

const { RangePicker } = DatePicker;

const QUICK_RANGES = [
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

const DEFAULT_DASHBOARD_DATA = {
  summary: {
    totalInflow: 0,
    totalOutflow: 0,
    netCashFlow: 0,
  },
  cashFlowTrend: [],
  productTrend: [],
  productSeries: [],
  topProducts: [],
  topCustomers: [],
  granularity: 'month',
};

const currencyFormatter = new Intl.NumberFormat('en-PK', {
  style: 'currency',
  currency: 'PKR',
  maximumFractionDigits: 0,
});

const formatCurrency = (value = 0) => currencyFormatter.format(Number(value) || 0);

const formatLabel = (value = '') =>
  value
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const getQuickRangeDates = (range) => {
  const today = dayjs();

  switch (range) {
    case 'Today':
      return [today.startOf('day'), today.endOf('day')];
    case 'Last 7 Days':
      return [today.subtract(6, 'day').startOf('day'), today.endOf('day')];
    case 'Last 30 Days':
      return [today.subtract(29, 'day').startOf('day'), today.endOf('day')];
    case 'This Month':
      return [today.startOf('month'), today.endOf('month')];
    case 'Last Month': {
      const previousMonth = today.subtract(1, 'month');
      return [previousMonth.startOf('month'), previousMonth.endOf('month')];
    }
    case 'Last 3 Months':
      return [today.subtract(2, 'month').startOf('month'), today.endOf('month')];
    case 'Last 6 Months':
      return [today.subtract(5, 'month').startOf('month'), today.endOf('month')];
    case 'Last 9 Months':
      return [today.subtract(8, 'month').startOf('month'), today.endOf('month')];
    case 'Last 12 Months':
      return [today.subtract(11, 'month').startOf('month'), today.endOf('month')];
    case 'This year':
      return [today.startOf('year'), today.endOf('year')];
    case 'Last year': {
      const previousYear = today.subtract(1, 'year');
      return [previousYear.startOf('year'), previousYear.endOf('year')];
    }
    case 'All Time':
      return null;
    default:
      return [today.subtract(29, 'day').startOf('day'), today.endOf('day')];
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(DEFAULT_DASHBOARD_DATA);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    products: [],
    customers: [],
  });
  const [filters, setFilters] = useState({
    quickRange: 'Last 30 Days',
    range: getQuickRangeDates('Last 30 Days'),
    products: [],
    customers: [],
  });

  const buildDashboardParams = (currentFilters) => {
    const params = {};

    if (currentFilters.range && currentFilters.range.length === 2) {
      params.startDate = currentFilters.range[0].format('YYYY-MM-DD');
      params.endDate = currentFilters.range[1].format('YYYY-MM-DD');
    }

    if (currentFilters.products.length > 0) {
      params.products = currentFilters.products.join(',');
    }

    if (currentFilters.customers.length > 0) {
      params.customers = currentFilters.customers.join(',');
    }

    return params;
  };

  const handleGetDashboardData = async (currentFilters, isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setLoading(true);
      } else {
        setFilterLoading(true);
      }

      const response = await api.get('/api/dashboard/summary', {
        params: buildDashboardParams(currentFilters),
      });

      setDashboardData(response.data || DEFAULT_DASHBOARD_DATA);
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Unable to load dashboard data');
    } finally {
      setLoading(false);
      setFilterLoading(false);
    }
  };

  const handleLoadFilterOptions = async () => {
    try {
      const [productResponse, customerResponse] = await Promise.all([
        api.get('/api/product/get-all?page=1&limit=1000'),
        api.get('/api/customer/get-all?page=1&limit=1000'),
      ]);

      setFilterOptions({
        products: (productResponse.data || []).map((product) => ({
          value: product._id,
          label: formatLabel(product.name),
        })),
        customers: (customerResponse.data || []).map((customer) => ({
          value: customer._id,
          label: formatLabel(customer.name),
        })),
      });
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Unable to load dashboard filters');
    }
  };

  useEffect(() => {
    const initializeDashboard = async () => {
      const defaultFilters = {
        quickRange: 'Last 30 Days',
        range: getQuickRangeDates('Last 30 Days'),
        products: [],
        customers: [],
      };

      await Promise.all([
        handleLoadFilterOptions(),
        handleGetDashboardData(defaultFilters, true),
      ]);
    };

    initializeDashboard();
  }, []);

  const handleQuickRangeSelect = (range) => {
    setFilters((prev) => ({
      ...prev,
      quickRange: range,
      range: getQuickRangeDates(range),
    }));
  };

  const handleRangeChange = (dates) => {
    setFilters((prev) => ({
      ...prev,
      quickRange: '',
      range: dates && dates.length === 2 ? dates : null,
    }));
  };

  const handleApplyFilters = async () => {
    await handleGetDashboardData(filters);
  };

  const handleClearFilters = async () => {
    const resetFilters = {
      quickRange: 'Last 30 Days',
      range: getQuickRangeDates('Last 30 Days'),
      products: [],
      customers: [],
    };

    setFilters(resetFilters);
    await handleGetDashboardData(resetFilters);
  };

  const summary = dashboardData.summary || DEFAULT_DASHBOARD_DATA.summary;

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
        <Toaster />

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
                onClick={() => handleQuickRangeSelect(range)}
                className={`cursor-pointer font-primary w-fit px-3 py-1 rounded-md ${filters.quickRange === range ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}
              >
                {range}
              </button>
            ))}
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='flex flex-col gap-1'>
              <h2 className='font-primary font-medium'>Start Date - End Date</h2>
              <RangePicker
                value={filters.range}
                onChange={handleRangeChange}
                className='w-full'
              />
            </div>

            <div className='flex flex-col gap-1'>
              <h2 className='font-primary font-medium'>Filter by Product</h2>
              <Select
                mode="multiple"
                allowClear
                style={{ width: '100%' }}
                placeholder="Select products"
                value={filters.products}
                onChange={(value) => setFilters((prev) => ({ ...prev, products: value }))}
                options={filterOptions.products}
                maxTagCount="responsive"
              />
            </div>

            <div className='flex flex-col gap-1'>
              <h2 className='font-primary font-medium'>Filter by Customer</h2>
              <Select
                mode="multiple"
                allowClear
                style={{ width: '100%' }}
                placeholder="Select customers"
                value={filters.customers}
                onChange={(value) => setFilters((prev) => ({ ...prev, customers: value }))}
                options={filterOptions.customers}
                maxTagCount="responsive"
              />
            </div>
          </div>

          <div className='mt-7 flex gap-4'>
            <button
              onClick={handleApplyFilters}
              disabled={filterLoading}
              className='bg-blue-500 px-6 py-3 text-white font-primary font-medium rounded-md cursor-pointer hover:bg-blue-600 disabled:opacity-70'
            >
              {filterLoading ? 'Applying...' : 'Apply Filters'}
            </button>
            <button
              onClick={handleClearFilters}
              className='bg-gray-200 hover:bg-gray-300 cursor-pointer text-black px-6 py-3 font-primary font-medium rounded-md'
            >
              Clear Filters
            </button>
          </div>
        </div>

        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Card variant="borderless">
              <Statistic
                title="Total Inflow"
                value={summary.totalInflow}
                formatter={(value) => formatCurrency(value)}
                styles={{
                  content: {
                    color: '#2563eb',
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

          <Col xs={24} md={8}>
            <Card variant="borderless">
              <Statistic
                title="Total Outflow"
                value={summary.totalOutflow}
                formatter={(value) => formatCurrency(value)}
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

          <Col xs={24} md={8}>
            <Card variant="borderless">
              <Statistic
                title="Net Cash Flow"
                value={summary.netCashFlow}
                formatter={(value) => formatCurrency(value)}
                styles={{
                  content: {
                    color: summary.netCashFlow >= 0 ? '#2563eb' : '#cf1322',
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

        <div>
          <div className='bg-white my-5 rounded-md px-4 py-7'>
            <h2 className='font-primary font-medium text-xl'>Cash Flow Trend</h2>
            {loading ? (
              <p className='font-primary text-gray-500 mt-4'>Loading dashboard...</p>
            ) : dashboardData.cashFlowTrend.length === 0 ? (
              <div className='py-8'>
                <Empty description="No inflow or outflow data found for these filters" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={dashboardData.cashFlowTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="dashboardInflow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="dashboardOutflow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [formatCurrency(value), formatLabel(name)]} />
                  <Legend verticalAlign="top" align="center" />
                  <Area
                    type="monotone"
                    dataKey="inflow"
                    name="Inflow"
                    stroke="#22c55e"
                    fill="url(#dashboardInflow)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="outflow"
                    name="Outflow"
                    stroke="#ef4444"
                    fill="url(#dashboardOutflow)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className='bg-white my-5 rounded-md px-4 py-7'>
            <h2 className='font-primary font-medium text-xl'>Product Sales Trend (Top 10 Products)</h2>
            {loading ? (
              <p className='font-primary text-gray-500 mt-4'>Loading dashboard...</p>
            ) : dashboardData.productSeries.length === 0 || dashboardData.productTrend.length === 0 ? (
              <div className='py-8'>
                <Empty description="No product sales trend available for these filters" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={dashboardData.productTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [formatCurrency(value), formatLabel(name)]} />
                  <Legend verticalAlign="top" align="center" />
                  {dashboardData.productSeries.map((series) => (
                    <Area
                      key={series.key}
                      type="monotone"
                      dataKey={series.key}
                      name={formatLabel(series.name)}
                      stroke={series.color}
                      fill={series.color}
                      fillOpacity={0.08}
                      strokeWidth={2}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div>
          <div className='flex flex-col xl:flex-row justify-between gap-3'>
            <div className='bg-white my-5 rounded-md px-4 py-7 w-full xl:w-[50%] min-h-[300px]'>
              <div className='flex justify-between items-center mb-4'>
                <h3 className='font-primary text-lg font-semibold'>Top Products</h3>
                <button
                  onClick={() => navigate('/admin/products')}
                  className='bg-blue-500 font-primary px-3 py-2 rounded-md text-white font-medium cursor-pointer'
                >
                  Manage Products
                </button>
              </div>

              {dashboardData.topProducts.length === 0 ? (
                <Empty description="No product data available" />
              ) : (
                dashboardData.topProducts.map((product) => (
                  <div key={product.productId || product.name} className='flex items-center justify-between border-b border-gray-100 py-2'>
                    <div>
                      <p className='font-primary font-medium my-1 capitalize'>{product.name}</p>
                      <p className='font-primary text-sm text-gray-500'>Qty sold: {product.qty}</p>
                    </div>
                    <p className='font-primary font-medium text-green-600 my-1'>{formatCurrency(product.sales)}</p>
                  </div>
                ))
              )}
            </div>

            <div className='bg-white my-5 rounded-md px-4 py-7 w-full xl:w-[50%] min-h-[300px]'>
              <div className='flex justify-between items-center mb-4'>
                <h3 className='font-primary text-lg font-semibold'>Top Customers</h3>
                <button
                  onClick={() => navigate('/admin/customers')}
                  className='bg-blue-500 font-primary px-3 py-2 rounded-md text-white font-medium cursor-pointer'
                >
                  Manage Customers
                </button>
              </div>

              {dashboardData.topCustomers.length === 0 ? (
                <Empty description="No customer data available" />
              ) : (
                dashboardData.topCustomers.map((customer) => (
                  <div key={customer.customerId || customer.name} className='flex items-center justify-between border-b border-gray-100 py-2'>
                    <div>
                      <p className='font-primary font-medium my-1 capitalize'>{customer.name}</p>
                      <p className='font-primary text-sm text-gray-500'>Units sold: {customer.qty}</p>
                    </div>
                    <p className='font-primary font-medium text-green-600 my-1'>{formatCurrency(customer.sales)}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Dashboard;
