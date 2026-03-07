'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface DashboardStats {
  totalCustomers: number
  totalBookings: number
  totalInvoices: number
  totalPayments: number
  pendingInvoices: number
  completedPayments: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalBookings: 0,
    totalInvoices: 0,
    totalPayments: 0,
    pendingInvoices: 0,
    completedPayments: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Get customers count
      const { count: customers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

      // Get bookings count
      const { count: bookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })

      // Get invoices count
      const { count: invoices } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true })
        .catch(() => ({ count: 0 }))

      // Get payments count
      const { count: payments } = await supabase
        .from('payments')
        .select('*', { count: 'exact', head: true })
        .catch(() => ({ count: 0 }))

      // Get pending invoices
      const { count: pending } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'issued')
        .catch(() => ({ count: 0 }))

      // Get completed payments
      const { count: completed } = await supabase
        .from('payments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed')
        .catch(() => ({ count: 0 }))

      setStats({
        totalCustomers: customers || 0,
        totalBookings: bookings || 0,
        totalInvoices: invoices || 0,
        totalPayments: payments || 0,
        pendingInvoices: pending || 0,
        completedPayments: completed || 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon }: { title: string; value: number; icon: string }) => (
    <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  )

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to Fenix Car Hire Admin Panel</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading statistics...</p>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard title="Total Customers" value={stats.totalCustomers} icon="👥" />
            <StatCard title="Total Bookings" value={stats.totalBookings} icon="📋" />
            <StatCard title="Total Invoices" value={stats.totalInvoices} icon="📄" />
            <StatCard title="Total Payments" value={stats.totalPayments} icon="💰" />
            <StatCard title="Pending Invoices" value={stats.pendingInvoices} icon="⏳" />
            <StatCard title="Completed Payments" value={stats.completedPayments} icon="✅" />
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                href="/admin/invoices"
                className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition text-center"
              >
                <p className="text-2xl mb-2">📄</p>
                <p className="font-semibold text-gray-900">Create Invoice</p>
              </Link>
              <Link
                href="/admin/quotations"
                className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition text-center"
              >
                <p className="text-2xl mb-2">💼</p>
                <p className="font-semibold text-gray-900">Create Quotation</p>
              </Link>
              <Link
                href="/admin/payments"
                className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition text-center"
              >
                <p className="text-2xl mb-2">💰</p>
                <p className="font-semibold text-gray-900">Record Payment</p>
              </Link>
              <Link
                href="/admin/customers"
                className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition text-center"
              >
                <p className="text-2xl mb-2">👥</p>
                <p className="font-semibold text-gray-900">View Customers</p>
              </Link>
              <Link
                href="/admin/checksheets"
                className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition text-center"
              >
                <p className="text-2xl mb-2">✓</p>
                <p className="font-semibold text-gray-900">Check Sheet</p>
              </Link>
              <Link
                href="/admin/reports"
                className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition text-center"
              >
                <p className="text-2xl mb-2">📈</p>
                <p className="font-semibold text-gray-900">View Reports</p>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
