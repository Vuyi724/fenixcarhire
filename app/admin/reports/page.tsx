'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface ReportData {
  totalRevenue: number
  totalBookings: number
  totalInvoices: number
  totalPayments: number
  pendingAmount: number
  averageInvoiceValue: number
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData>({
    totalRevenue: 0,
    totalBookings: 0,
    totalInvoices: 0,
    totalPayments: 0,
    pendingAmount: 0,
    averageInvoiceValue: 0,
  })
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30days')

  useEffect(() => {
    fetchReportData()
  }, [dateRange])

  const fetchReportData = async () => {
    try {
      // Fetch total bookings
      const { count: bookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })

      // Fetch invoices
      const { data: invoiceData } = await supabase
        .from('invoices')
        .select('amount, status')

      // Fetch payments
      const { data: paymentData } = await supabase
        .from('payments')
        .select('amount, status')

      const totalInvoices = invoiceData?.length || 0
      const invoiceAmount = invoiceData?.reduce((sum, inv) => sum + (inv.amount || 0), 0) || 0
      const paidAmount = paymentData?.filter(p => p.status === 'completed').reduce((sum, p) => sum + (p.amount || 0), 0) || 0

      setReportData({
        totalRevenue: paidAmount,
        totalBookings: bookings || 0,
        totalInvoices: totalInvoices,
        totalPayments: paymentData?.length || 0,
        pendingAmount: invoiceAmount - paidAmount,
        averageInvoiceValue: totalInvoices > 0 ? invoiceAmount / totalInvoices : 0,
      })
    } catch (error) {
      console.error('Error fetching report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatBox = ({ title, value, subtitle }: { title: string; value: string | number; subtitle?: string }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-gray-600 text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-2">{subtitle}</p>}
    </div>
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-2">Financial reports and business insights</p>
      </div>

      {/* Date Range Filter */}
      <div className="mb-6 flex gap-2">
        {['7days', '30days', '90days', 'all'].map((range) => (
          <button
            key={range}
            onClick={() => setDateRange(range)}
            className={`px-4 py-2 rounded-lg transition ${
              dateRange === range
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {range === '7days' && 'Last 7 Days'}
            {range === '30days' && 'Last 30 Days'}
            {range === '90days' && 'Last 90 Days'}
            {range === 'all' && 'All Time'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Generating report...</p>
        </div>
      ) : (
        <>
          {/* Revenue Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatBox
              title="Total Revenue"
              value={`E$ ${reportData.totalRevenue.toFixed(2)}`}
              subtitle="Completed payments"
            />
            <StatBox
              title="Pending Payments"
              value={`E$ ${reportData.pendingAmount.toFixed(2)}`}
              subtitle="Outstanding invoices"
            />
            <StatBox
              title="Average Invoice Value"
              value={`E$ ${reportData.averageInvoiceValue.toFixed(2)}`}
              subtitle="Per invoice"
            />
            <StatBox
              title="Total Invoices"
              value={reportData.totalInvoices}
              subtitle="Issued invoices"
            />
            <StatBox
              title="Total Bookings"
              value={reportData.totalBookings}
              subtitle="All time"
            />
            <StatBox
              title="Total Payments"
              value={reportData.totalPayments}
              subtitle="Processed payments"
            />
          </div>

          {/* Financial Summary */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Financial Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Total Invoiced Amount</span>
                <span className="font-semibold text-gray-900">
                  E$ {(reportData.totalRevenue + reportData.pendingAmount).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Total Paid</span>
                <span className="font-semibold text-green-600">E$ {reportData.totalRevenue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Outstanding</span>
                <span className="font-semibold text-red-600">E$ {reportData.pendingAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Business Metrics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Business Metrics</h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Payment Collection Rate</span>
                <span className="font-semibold text-gray-900">
                  {reportData.totalRevenue + reportData.pendingAmount > 0
                    ? ((reportData.totalRevenue / (reportData.totalRevenue + reportData.pendingAmount)) * 100).toFixed(1)
                    : 0}%
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Average Booking Value</span>
                <span className="font-semibold text-gray-900">
                  E$ {reportData.totalBookings > 0 ? ((reportData.totalRevenue + reportData.pendingAmount) / reportData.totalBookings).toFixed(2) : '0.00'}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Invoices Per Booking</span>
                <span className="font-semibold text-gray-900">
                  {reportData.totalBookings > 0 ? (reportData.totalInvoices / reportData.totalBookings).toFixed(2) : '0.00'}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
