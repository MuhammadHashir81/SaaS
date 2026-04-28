import React, { useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GenerateBillPdf = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const state = location.state

  const [customer, setCustomer] = useState(state?.customer)
  const [date, setDate] = useState(state?.date)
  const [address, setAddress] = useState(state?.location)
  const [packing, setPacking] = useState(state?.packing)
  const [ntn, setNtn] = useState(state?.ntn)
  const [strn, setStrn] = useState(state?.strn)
  const [product, setProduct] = useState(state?.product)
  const [qty, setQty] = useState(state?.qty)
  const [batchNo, setBatchNo] = useState(state?.batchNo)
  const [rate, setRate] = useState(state?.rate)
  const [total, setTotal] = useState(state?.total)
  const [discount, setDiscount] = useState(state?.discount)
  const [subTotal, setSubtotal] = useState(state?.subTotal)


  
const apiUrl = import.meta.env.VITE_API_URL
  const handleGeneratePDF = async () => {
    try {
      const res = await axios.post(
        `${apiUrl}/api/product/invoice/generate-bill`,
        {
          id,
          customer,
          date,
          address,
          ntn,
          strn,
          product,
          packing,
          qty,
          batchNo,
          rate,
          total,
          discount,   // ✅ was missing
          subTotal    // ✅ was missing
        },
        
        {
          withCredentials:true,
          responseType: 'arraybuffer'   // 🔥 CRITICAL FIX
        },
      )

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "invoice.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error(error)
      alert('Error generating PDF')
    }
  }

  return (
    <div className="p-10 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Invoice</h2>
        <div className="flex gap-3 font-light">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 cursor-pointer bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
          >
            <FaArrowLeft size={12} />
            Back
          </button>
          <button className="cursor-pointer px-4 py-1 bg-green-200 rounded">Edit</button>
          <button
            onClick={handleGeneratePDF}
            className="cursor-pointer px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Print / PDF
          </button>
        </div>
      </div>

      {/* Customer Info */}
      <div className="bg-white shadow rounded p-6 mb-6">
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-gray-500 text-sm">Customer Name</p>
            <h3 className="font-semibold">{customer}</h3>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Date</p>
            <h3 className="font-semibold">
              {date ? new Date(date).toLocaleDateString(undefined, {
                day: '2-digit', month: 'short', year: 'numeric'
              }) : '-'}
            </h3>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Address</p>
            <h3 className="font-semibold">{address}</h3>
          </div>
          <div>
            <p className="text-gray-500 text-sm">NTN</p>
            <h3 className="font-semibold">{ntn || "-"}</h3>
          </div>
          <div>
            <p className="text-gray-500 text-sm">STRN</p>
            <h3 className="font-semibold">{strn || "-"}</h3>
          </div>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <table className="w-full text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border">Product</th>
              <th className="p-2 border">Packing</th>
              <th className="p-2 border">Batch</th>
              <th className="p-2 border">Qty</th>
              <th className="p-2 border">Rate</th>
              <th className="p-2 border">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border">1</td>
              <td className="p-2 border">{product}</td>
              <td className="p-2 border">{packing}</td>
              <td className="p-2 border">{batchNo}</td>
              <td className="p-2 border">{qty}</td>
              <td className="p-2 border">{rate}</td>
              <td className="p-2 border">{subTotal}</td> {/* qty * rate */}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="bg-white shadow rounded p-6 w-80">
          <div className="flex justify-between mb-2">
            <span>Sub Total</span>
            <span>{subTotal}</span>   {/* ✅ was showing total */}
          </div>
          <div className="flex justify-between mb-2">
            <span>Discount (Rs)</span>
            <span>{discount}</span>   {/* ✅ was showing hardcoded value */}
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{total}</span>
          </div>
        </div>
      </div>

    </div>
  )
}

export default GenerateBillPdf