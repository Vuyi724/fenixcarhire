'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Quotation {
  id: string
  quote_number: string
  vehicle_type: string
  rental_days: number
  estimated_cost: number
  status: string
  valid_until: string
  users: any
}

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    customer_id: '',
    vehicle_type: '',
    rental_days: '',
    estimated_cost: '',
  })
  const [customers, setCustomers] = useState<any[]>([])

  useEffect(() => {
    fetchQuotations()
    fetchCustomers()
  }, [])

  const fetchQuotations = async () => {
    try {
      const { data, error } = await supabase
        .from('quotations')
        .select('*, users(id, email, full_name)')
        .order('created_at', { ascending: false })

      if (error) throw error
      setQuotations(data || [])
    } catch (error) {
      console.error('Error fetching quotations:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, full_name')
        .eq('is_admin', false)

      if (error) throw error
      setCustomers(data || [])
    } catch (error) {
      console.error('Error fetching customers:', error)
    }
  }

  const handleEdit = (quotation: Quotation) => {
    setEditingId(quotation.id)
    setFormData({
      customer_id: quotation.users?.id || '',
      vehicle_type: quotation.vehicle_type,
      rental_days: quotation.rental_days.toString(),
      estimated_cost: quotation.estimated_cost.toString(),
    })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/quotations${editingId ? `/${editingId}` : ''}`, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: formData.customer_id,
          vehicle_type: formData.vehicle_type,
          rental_days: parseInt(formData.rental_days),
          estimated_cost: parseFloat(formData.estimated_cost),
        }),
      })

      if (!response.ok) throw new Error(`Failed to ${editingId ? 'update' : 'create'} quotation`)

      setFormData({
        customer_id: '',
        vehicle_type: '',
        rental_days: '',
        estimated_cost: '',
      })
      setEditingId(null)
      setShowForm(false)
      fetchQuotations()
    } catch (error) {
      console.error('Error creating quotation:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-blue-100 text-blue-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'expired':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quotations & Invoices</h1>
          <p className="text-gray-600 mt-2">Create and manage customer quotations</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm)
            if (showForm) setEditingId(null)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {showForm ? 'Cancel' : 'Create Quotation'}
        </button>
      </div>

      {/* Create Form - Quotation Invoice Format */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-8 mb-6 max-w-4xl">
          <form onSubmit={handleSubmit}>
            {/* Header with Company Logo */}
            <div className="flex justify-between items-center mb-8 pb-6 border-b-2">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Fenix Car Hire</h2>
                <p className="text-gray-600 text-sm">For All Your Rental Problems</p>
              </div>
              <div className="text-right text-sm text-gray-600">
                <p>Contact: (+268) 768 29797</p>
                <p>Email: reception@fenix.co.sz</p>
              </div>
            </div>

            {/* Customer & Quote Info */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Customer</label>
                <select
                  required
                  value={formData.customer_id}
                  onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.full_name || customer.email}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1">Date</label>
                    <input type="date" className="w-full px-2 py-1 border border-gray-300 rounded text-sm" defaultValue={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-900 mb-1">Quotation #</label>
                    <input type="text" className="w-full px-2 py-1 border border-gray-300 rounded text-sm" placeholder="QUO-001" />
                  </div>
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Rental Items</h3>
              <table className="w-full border-collapse mb-4">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left text-xs font-bold text-gray-900 py-2">Description</th>
                    <th className="text-right text-xs font-bold text-gray-900 py-2 w-24">Rate/Day</th>
                    <th className="text-right text-xs font-bold text-gray-900 py-2 w-20">Qty</th>
                    <th className="text-right text-xs font-bold text-gray-900 py-2 w-20">Days</th>
                    <th className="text-right text-xs font-bold text-gray-900 py-2 w-24">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3">
                      <input type="text" placeholder="e.g., Fortuner" className="w-full px-2 py-1 border border-gray-300 rounded text-sm" />
                    </td>
                    <td className="text-right py-3">
                      <input type="number" placeholder="400.00" step="0.01" className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-right" />
                    </td>
                    <td className="text-right py-3">
                      <input type="number" placeholder="1" className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-right" defaultValue="1" />
                    </td>
                    <td className="text-right py-3">
                      <input
                        type="number"
                        placeholder="7"
                        value={formData.rental_days}
                        onChange={(e) => setFormData({ ...formData, rental_days: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-right"
                      />
                    </td>
                    <td className="text-right py-3 pr-2">
                      <input
                        type="number"
                        placeholder="2800.00"
                        step="0.01"
                        value={formData.estimated_cost}
                        onChange={(e) => setFormData({ ...formData, estimated_cost: e.target.value })}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm text-right"
                      />
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3">Contract Fee</td>
                    <td className="text-right py-3">E 100.00</td>
                    <td className="text-right py-3">1</td>
                    <td className="text-right py-3">-</td>
                    <td className="text-right py-3 pr-2">E 100.00</td>
                  </tr>
                  <tr>
                    <td className="py-3">Deposit (Refundable)</td>
                    <td className="text-right py-3">E 5000.00</td>
                    <td className="text-right py-3">1</td>
                    <td className="text-right py-3">-</td>
                    <td className="text-right py-3 pr-2">E 5000.00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-64">
                <div className="flex justify-between py-2 border-t-2 border-gray-300">
                  <span className="font-semibold text-gray-900">Subtotal:</span>
                  <span className="text-gray-900">E [Auto]</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-semibold text-gray-900">VAT (15%):</span>
                  <span className="text-gray-900">E [Auto]</span>
                </div>
                <div className="flex justify-between py-2 border-t-2 border-gray-900 font-bold text-lg">
                  <span>Total:</span>
                  <span>E [Auto]</span>
                </div>
              </div>
            </div>

            {/* Banking Details */}
            <div className="mb-8 p-4 bg-gray-50 rounded">
              <h4 className="font-bold text-gray-900 mb-2">Banking Details</h4>
              <p className="text-sm text-gray-600">Account Name: Semperf Investments (Pty) Bank</p>
              <p className="text-sm text-gray-600">Branch Code: 663164</p>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Create Quotation
            </button>
          </form>
        </div>
      )}

      {/* Quotations List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading quotations...</p>
          </div>
        ) : quotations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No quotations yet</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Quote #</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Customer</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Vehicle</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Valid Until</th>
              </tr>
            </thead>
            <tbody>
              {quotations.map((quotation) => (
                <tr key={quotation.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{quotation.quote_number}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{quotation.users?.full_name || quotation.users?.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{quotation.vehicle_type}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">E {quotation.estimated_cost.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(quotation.status)}`}>
                      {quotation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(quotation.valid_until).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleEdit(quotation)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
