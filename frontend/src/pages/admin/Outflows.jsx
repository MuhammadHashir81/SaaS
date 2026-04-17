import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { MdHome } from "react-icons/md";
import { ConfigProvider, DatePicker, Select, Table } from "antd";
import { toast, Toaster } from "react-hot-toast";
import { api } from "../../../api/api";

const OUTFLOW_CATEGORIES = [
  { value: 'transport', label: 'Transport' },
  { value: 'salary', label: 'Salary' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'office', label: 'Office' },
  { value: 'tax', label: 'Tax' },
  { value: 'miscellaneous', label: 'Miscellaneous' },
];

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

const Outflows = () => {
  const [outflows, setOutflows] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    startDate: null,
    endDate: null,
    category: '',
  });
  const [formData, setFormData] = useState({
    date: dayjs(),
    category: '',
    description: '',
    amount: '',
  });

  const handleGetOutflows = async (currentFilters = filters, isInitialLoad = false) => {
    try {
      if (isInitialLoad) {
        setLoading(true);
      }

      const params = {};

      if (currentFilters.search.trim()) {
        params.q = currentFilters.search.trim();
      }

      if (currentFilters.startDate) {
        params.startDate = currentFilters.startDate.format('YYYY-MM-DD');
      }

      if (currentFilters.endDate) {
        params.endDate = currentFilters.endDate.format('YYYY-MM-DD');
      }

      if (currentFilters.category) {
        params.category = currentFilters.category;
      }

      const response = await api.get('/api/outflow/get-all', { params });
      setOutflows(response.data || []);
      setTotalAmount(response.totalAmount || 0);
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Unable to load outflows');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetOutflows(filters, true);
  }, []);

  const handleAddOutflow = async () => {
    try {
      await api.post('/api/outflow/add', {
        date: formData.date ? formData.date.format('YYYY-MM-DD') : '',
        category: formData.category,
        description: formData.description,
        amount: formData.amount,
      });

      toast.success('Outflow added successfully');
      setFormData({
        date: dayjs(),
        category: '',
        description: '',
        amount: '',
      });

      await handleGetOutflows();
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Unable to add outflow');
    }
  };

  const handleDeleteOutflow = async (outflow) => {
    try {
      await api.delete(`/api/outflow/delete/${outflow._id}`);
      toast.success('Outflow deleted successfully');
      await handleGetOutflows();
    } catch (error) {
      toast.error(error?.response?.data?.error || 'Unable to delete outflow');
    }
  };

  const handleResetFilters = async () => {
    const resetFilters = {
      search: '',
      startDate: null,
      endDate: null,
      category: '',
    };

    setFilters(resetFilters);
    await handleGetOutflows(resetFilters);
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      render: (value) =>
        new Date(value).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      render: (value) => formatLabel(value),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      render: (value) => value || '-',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      render: (value) => formatCurrency(value),
    },
    {
      title: 'Actions',
      dataIndex: '',
      key: 'x',
      render: (outflow) => (
        <button
          onClick={() => handleDeleteOutflow(outflow)}
          className="text-red-600 font-primary font-medium cursor-pointer"
        >
          Delete
        </button>
      ),
    },
  ];

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
      <div className="p-4">
        <Toaster />

        <div className="flex items-center gap-1 mb-4 text-gray-600">
          <MdHome size={16} />
          <h6 className="font-primary font-medium">Home</h6>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-primary text-xl font-bold">Outflows Management</h2>
          <div className="bg-white px-4 py-2 rounded-md shadow-sm">
            <p className="font-primary text-sm text-gray-500">Filtered Total Outflow</p>
            <p className="font-primary text-lg font-semibold text-red-600">{formatCurrency(totalAmount)}</p>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-md p-5 grid grid-cols-1 md:grid-cols-5 gap-5">
          <div className="flex flex-col gap-1 md:col-span-2">
            <label htmlFor="search" className="text-sm font-medium text-gray-600">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              placeholder="Search by category or description"
              className="h-[40px] px-3 rounded-sm border border-gray-300 focus:outline-none focus:border-black hover:border-black"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="fromDate" className="text-sm font-medium text-gray-600">
              From Date
            </label>
            <DatePicker
              value={filters.startDate}
              onChange={(value) => setFilters((prev) => ({ ...prev, startDate: value }))}
              className="h-[40px] w-full"
              id="fromDate"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="toDate" className="text-sm font-medium text-gray-600">
              To Date
            </label>
            <DatePicker
              value={filters.endDate}
              onChange={(value) => setFilters((prev) => ({ ...prev, endDate: value }))}
              className="h-[40px] w-full"
              id="toDate"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="filterCategory" className="text-sm font-medium text-gray-600">
              Category
            </label>
            <Select
              allowClear
              value={filters.category || null}
              onChange={(value) => setFilters((prev) => ({ ...prev, category: value || '' }))}
              placeholder="All categories"
              options={OUTFLOW_CATEGORIES}
              className="h-[40px] w-full"
              id="filterCategory"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={() => handleGetOutflows()}
            className="h-[40px] w-[90px] font-primary font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
          >
            Filter
          </button>
          <button
            onClick={handleResetFilters}
            className="h-[40px] w-[90px] font-primary font-medium bg-gray-200 hover:bg-gray-300 text-black rounded-md transition"
          >
            Reset
          </button>
        </div>

        <div className="rounded-md bg-white shadow-md p-5 my-5">
          <h2 className='font-primary text-base font-semibold'>Add New Outflow</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
            <div className="flex flex-col gap-1">
              <label htmlFor="outflowDate" className="font-primary font-semibold">Date</label>
              <DatePicker
                value={formData.date}
                onChange={(value) => setFormData((prev) => ({ ...prev, date: value }))}
                className="h-[40px] w-full"
                id="outflowDate"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="outflowCategory" className="font-primary font-semibold">Category</label>
              <Select
                value={formData.category || null}
                onChange={(value) => setFormData((prev) => ({ ...prev, category: value || '' }))}
                placeholder="Select a category"
                options={OUTFLOW_CATEGORIES}
                id="outflowCategory"
                className="h-[40px] w-full"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="outflowTextarea" className="font-primary font-semibold">Description</label>
            <textarea
              name="outflowTextarea"
              id="outflowTextarea"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              className="outline-1 outline-gray-200 focus:outline-black px-3 py-4 hover:outline-black rounded-sm"
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-1 mt-4">
            <label htmlFor="outflowAmount" className="font-primary font-semibold">Amount</label>
            <input
              id="outflowAmount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
              className="outline-gray-200 hover:outline-black rounded-sm focus:outline-black px-4 py-1 w-full md:w-96 h-9 outline-1"
            />
            <button
              onClick={handleAddOutflow}
              className="cursor-pointer hover:bg-green-700 transition ease-in-out duration-75 bg-green-600 font-primary w-32 rounded-sm py-2 mt-3 text-white text-sm"
            >
              Add outflow
            </button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={outflows}
          size="middle"
          className="mt-8"
          loading={loading}
          pagination={false}
        />
      </div>
    </ConfigProvider>
  );
};

export default Outflows;
