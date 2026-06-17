import React, { useEffect, useState } from 'react'
import { api } from '../../api/api'
import Swal from "sweetalert2";
const Membership = () => {
  const [loading, setLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [plan, setPlan] = useState('')
  const [status, setStatus] = useState('')
  const [currentPeriodStart, setCurrentPeriodStart] = useState('')
  const [currentPeriodEnd, setCurrentPeriodEnd] = useState('')
  const [trialStartDate,setTrialStartDate] = useState('')
  const [trialEndDate,setTrialEndDate] = useState('')
  
  const fetchUserDetails = async () => {
    try {
      setLoading(true)
      const response = await api.get('/api/payment/get-user-details')
      console.log(response)
      setUsername(response.name)
      setEmail(response.email)
      setPlan(response.plan)
      setStatus(response.status)

      if(response.plan === 'free_trial' && response.trialStartDate && response.currentPeriodStart == null){
        setTrialStartDate(response.trialStartDate)
      }

      if(response.plan === 'free_trial' && response.trialEndDate && response.currentPeriodEnd == null){
        setTrialEndDate(response.trialStartDate)
      }
      
      setCurrentPeriodStart(response.currentPeriodStart)
      setCurrentPeriodEnd(response.currentPeriodEnd)
    } catch (error) {
      console.log('error occurred fetching user details', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async() => {
    console.log("canceling...")
    try {
        const response = await api.post('/api/payment/cancel-subscription')
        console.log("cancel response",response)

        if(response.message) {
            Swal.fire(response.message)
        }
        
        if(response.error){
            Swal.fire(response.error)
        }
    } catch (error) {
        console.log("error while canceling your plan",error?.response?.data?.error)
        Swal.fire(error?.response?.data?.error)
    }

  }

  useEffect(() => {
    fetchUserDetails()
  }, [])

  const initials = username
    ? username.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??'

  const isActive = status?.toLowerCase() === 'active'

  const formatDate = (ts) => {
    if (!ts) return '—'
    return new Date(ts).toLocaleDateString('en-PK', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading membership…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto">

        {/* Section label */}
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">
          Your membership
        </p>

        {/* Header: avatar + name */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium text-base flex-shrink-0">
            {initials}
          </div>
          <div>
            <p className="font-medium text-gray-900 text-lg leading-tight">{username}</p>
            <p className="text-sm text-gray-400">{email}</p>
          </div>
        </div>

        {/* Plan card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Current plan</p>
              <p className="text-2xl font-medium text-gray-900">{plan || '—'}</p>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full ${
                isActive
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-600'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isActive ? 'bg-green-500 animate-pulse' : 'bg-red-400'
                }`}
              />
              {status ? status.charAt(0).toUpperCase() + status.slice(1) : '—'}
            </span>
          </div>
        </div>

        {/* Date cards */}
        <div className="grid grid-cols-2 gap-2.5 mb-3">
          <div className="bg-gray-100 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              Billing started
            </p>
            <p className="text-sm font-medium text-gray-800">{formatDate(currentPeriodStart ? currentPeriodStart : trialStartDate)}</p>
          </div>
          <div className="bg-gray-100 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="9 16 11 18 15 14"/>
              </svg>
              Next renewal
            </p>
            <p className="text-sm font-medium text-gray-800">{formatDate(currentPeriodEnd ? currentPeriodEnd : trialEndDate)}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2.5 mt-1">
          <button onClick={handleCancel} className="flex-1 py-2.5 rounded-xl text-sm border border-red-200 bg-transparent text-red-500 hover:bg-red-50 transition-colors">
            Cancel plan
          </button>
        </div>

      </div>
    </div>
  )
}

export default Membership