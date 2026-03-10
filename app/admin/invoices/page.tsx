'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/app/auth-context'

interface Invoice {
  id: string
  invoice_number: string
  amount: number
  status: string
  issue_date: string
  due_date: string
  bookings: any
}

export default function InvoicesPage() {
  const { user } = useAuth()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    booking_id: '',
    customer_name: '',
    invoice_number: '',
    purchase_order: '',
    contact_person: '',
    contact_number: '',
    email: '',
    invoice_date: new Date().toISOString().split('T')[0],
    due_date: '',
    vehicle_type: '',
    rate_per_day: '',
    quantity: '1',
    kms_per_day: '',
    days: '',
    excess: '0',
    contract_fee: '200',
    excess_kms_details: '',
  })
  const [bookings, setBookings] = useState<any[]>([])

  useEffect(() => {
    fetchInvoices()
    fetchBookings()
  }, [])

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*, bookings(id, vehicle_type, user_id)')
        .order('created_at', { ascending: false })

      if (error) throw error
      setInvoices(data || [])
    } catch (error) {
      console.error('Error fetching invoices:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('id, vehicle_type, user_id, users(full_name)')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBookings(data || [])
    } catch (error) {
      console.error('Error fetching bookings:', error)
    }
  }

  const handleEdit = (invoice: Invoice) => {
    setEditingId(invoice.id)
    setFormData({
      booking_id: '',
      customer_name: '',
      invoice_number: invoice.invoice_number,
      purchase_order: '',
      contact_person: '',
      contact_number: '',
      email: '',
      invoice_date: new Date().toISOString().split('T')[0],
      due_date: invoice.due_date || '',
      vehicle_type: '',
      rate_per_day: '',
      quantity: '1',
      kms_per_day: '',
      days: '',
      excess: '0',
      contract_fee: '200',
      excess_kms_details: '',
    })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Calculate total amount
      const vehicleRental = (parseFloat(formData.rate_per_day) || 0) * (parseInt(formData.quantity) || 1) * (parseInt(formData.days) || 0)
      const contractFee = parseFloat(formData.contract_fee) || 0
      const excessCharge = parseFloat(formData.excess) || 0
      const subtotal = vehicleRental + contractFee + excessCharge
      const vat = subtotal * 0.15
      const totalAmount = subtotal + vat

      const response = await fetch(`/api/invoices${editingId ? `/${editingId}` : ''}`, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: formData.booking_id,
          customer_name: formData.customer_name,
          vehicle_type: formData.vehicle_type,
          rental_days: parseInt(formData.days),
          estimated_cost: totalAmount,
          status: 'issued',
        }),
      })

      if (!response.ok) throw new Error(`Failed to ${editingId ? 'update' : 'create'} invoice`)

      setFormData({
        booking_id: '',
        customer_name: '',
        invoice_number: '',
        purchase_order: '',
        contact_person: '',
        contact_number: '',
        email: '',
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: '',
        vehicle_type: '',
        rate_per_day: '',
        quantity: '1',
        kms_per_day: '',
        days: '',
        excess: '0',
        contract_fee: '200',
        excess_kms_details: '',
      })
      setEditingId(null)
      setShowForm(false)
      fetchInvoices()
    } catch (error) {
      console.error('Error creating invoice:', error)
    }
  }

  // Get status color for invoice display
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800'
      case 'issued':
        return 'bg-blue-100 text-blue-800'
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to delete all invoices? This action cannot be undone.')) {
      try {
        const response = await fetch('/api/invoices/clear-all', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
        if (!response.ok) throw new Error('Failed to clear invoices')
        fetchInvoices()
      } catch (error) {
        console.error('Error clearing invoices:', error)
      }
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600 mt-2">Manage customer invoices</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleClearAll}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Clear All
          </button>
          <button
            onClick={() => {
              setShowForm(!showForm)
              if (showForm) setEditingId(null)
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {showForm ? 'Cancel' : 'Create Invoice'}
          </button>
        </div>
      </div>

      {/* Create Form - Professional Tax Invoice */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-8 mb-6 max-w-5xl">
          {/* Header with Branding */}
          <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-blue-300">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">FENIX CAR HIRE</h2>
              <p className="text-gray-700 text-sm">For All Your Rental Problems</p>
              <p className="text-gray-600 text-xs mt-2">P.O. Box 7900 Mbabane, Eswatini</p>
              <p className="text-gray-600 text-xs">Ulanga Complex, Utsamba Street, Sidwashini</p>
            </div>
            <div className="text-right text-sm text-gray-600">
              <p>Cell (+268) 768 29797 / 798 46935</p>
              <p>Telf (+268) 2422 1045</p>
              <p>Email: reception@fenix.co.sz</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Customer & Invoice Details */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">Customer:</h3>
                <input
                  type="text"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  className="w-full px-2 py-1 border-0 border-b border-gray-300 text-gray-900 font-medium focus:outline-none"
                  placeholder="Customer Name"
                />
              </div>
              <div>
                <table className="w-full text-sm border border-gray-400">
                  <tbody>
                    <tr className="border-b border-gray-400">
                      <td className="px-2 py-1 font-bold text-gray-900 w-32">Date</td>
                      <td className="px-2 py-1">
                        <input
                          type="date"
                          value={formData.invoice_date}
                          onChange={(e) => setFormData({ ...formData, invoice_date: e.target.value })}
                          className="w-full border-0 text-sm focus:outline-none"
                        />
                      </td>
                    </tr>
                    <tr className="border-b border-gray-400">
                      <td className="px-2 py-1 font-bold text-gray-900">Invoice number</td>
                      <td className="px-2 py-1">
                        <input type="text" className="w-full border-0 text-sm focus:outline-none" placeholder="INV-001" />
                      </td>
                    </tr>
                    <tr className="border-b border-gray-400">
                      <td className="px-2 py-1 font-bold text-gray-900">Purchase order number</td>
                      <td className="px-2 py-1">
                        <input
                          type="text"
                          value={formData.purchase_order}
                          onChange={(e) => setFormData({ ...formData, purchase_order: e.target.value })}
                          className="w-full border-0 text-sm focus:outline-none"
                          placeholder="PO"
                        />
                      </td>
                    </tr>
                    <tr className="border-b border-gray-400">
                      <td className="px-2 py-1 font-bold text-gray-900">Customer rental</td>
                      <td className="px-2 py-1">
                        <input type="text" className="w-full border-0 text-sm focus:outline-none" placeholder="Car Rental" defaultValue="Car Rental" />
                      </td>
                    </tr>
                    <tr className="border-b border-gray-400">
                      <td className="px-2 py-1 font-bold text-gray-900">Contact Person</td>
                      <td className="px-2 py-1">
                        <input
                          type="text"
                          value={formData.contact_person}
                          onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                          className="w-full border-0 text-sm focus:outline-none"
                        />
                      </td>
                    </tr>
                    <tr className="border-b border-gray-400">
                      <td className="px-2 py-1 font-bold text-gray-900">Contact Number</td>
                      <td className="px-2 py-1">
                        <input
                          type="text"
                          value={formData.contact_number}
                          onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                          className="w-full border-0 text-sm focus:outline-none"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="px-2 py-1 font-bold text-gray-900">Email address</td>
                      <td className="px-2 py-1">
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full border-0 text-sm focus:outline-none"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tax Invoice Title */}
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">TAX INVOICE</h3>

            {/* Line Items Table */}
            <table className="w-full border-2 border-gray-400 mb-6 text-sm">
              <thead>
                <tr className="bg-blue-100 border-b border-gray-400">
                  <th className="px-3 py-2 text-left font-bold text-gray-900">Description</th>
                  <th className="px-3 py-2 text-center font-bold text-gray-900 w-20">Rate/day</th>
                  <th className="px-3 py-2 text-center font-bold text-gray-900 w-16">Quantity</th>
                  <th className="px-3 py-2 text-center font-bold text-gray-900 w-16">Kms/day</th>
                  <th className="px-3 py-2 text-center font-bold text-gray-900 w-12">Days</th>
                  <th className="px-3 py-2 text-center font-bold text-gray-900 w-16">Excess</th>
                  <th className="px-3 py-2 text-right font-bold text-gray-900 w-24">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-400">
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={formData.vehicle_type}
                      onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
                      className="w-full border-0 focus:outline-none text-sm"
                      placeholder="e.g., Siata"
                    />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <input
                      type="number"
                      step="0.01"
                      value={formData.rate_per_day}
                      onChange={(e) => setFormData({ ...formData, rate_per_day: e.target.value })}
                      className="w-full border-0 text-center focus:outline-none text-sm"
                      placeholder="1800.00"
                    />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full border-0 text-center focus:outline-none text-sm"
                      defaultValue="1"
                    />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <input
                      type="number"
                      value={formData.kms_per_day}
                      onChange={(e) => setFormData({ ...formData, kms_per_day: e.target.value })}
                      className="w-full border-0 text-center focus:outline-none text-sm"
                      placeholder="300"
                    />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <input
                      type="number"
                      value={formData.days}
                      onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                      className="w-full border-0 text-center focus:outline-none text-sm"
                      placeholder="7"
                    />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <input
                      type="number"
                      step="0.01"
                      value={formData.excess}
                      onChange={(e) => setFormData({ ...formData, excess: e.target.value })}
                      className="w-full border-0 text-center focus:outline-none text-sm"
                      placeholder="0"
                    />
                  </td>
                  <td className="px-3 py-2 text-right">E 0.00</td>
                </tr>
                <tr className="border-b border-gray-400">
                  <td className="px-3 py-2">2. Contract fee</td>
                  <td colSpan={5} className="px-3 py-2"></td>
                  <td className="px-3 py-2 text-right">E 200.00</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">3. Excess KMs</td>
                  <td colSpan={5} className="px-3 py-2">
                    <input
                      type="text"
                      value={formData.excess_kms_details}
                      onChange={(e) => setFormData({ ...formData, excess_kms_details: e.target.value })}
                      className="w-full border-0 focus:outline-none text-sm text-gray-600"
                      placeholder="e.g., MR187GP - 117KM"
                    />
                  </td>
                  <td className="px-3 py-2 text-right">E 0.00</td>
                </tr>
              </tbody>
            </table>

            {/* Banking & Totals */}
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div className="border-2 border-gray-400 p-4">
                <h4 className="font-bold text-gray-900 mb-2">Banking details:</h4>
                <p className="text-xs text-gray-700">Account Name: Semperf Investments (Pty)</p>
                <p className="text-xs text-gray-700">Bank Name: Standard Bank Swaziland</p>
                <p className="text-xs text-gray-700">Branch code: 663164</p>
                <p className="text-xs text-gray-700">Account Number: 9110005889573</p>
              </div>
              <div className="flex flex-col justify-end">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className="border-t-2 border-gray-400">
                      <td className="px-3 py-2 font-semibold text-gray-900">Subtotal</td>
                      <td className="px-3 py-2 text-right text-gray-900">E 6 781.00</td>
                    </tr>
                    <tr>
                      <td className="px-3 py-2 font-semibold text-gray-900">VAT - 15%</td>
                      <td className="px-3 py-2 text-right text-gray-900">E 1 017.15</td>
                    </tr>
                    <tr className="border-t-2 border-gray-900 font-bold text-lg">
                      <td className="px-3 py-2 text-gray-900">Total</td>
                      <td className="px-3 py-2 text-right text-gray-900">E 7 798.15</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Create Invoice
            </button>
          </form>
        </div>
      )}

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading invoices...</p>
          </div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No invoices yet</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Invoice #</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Booking</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm">
                    <input
                      type="text"
                      defaultValue={invoice.invoice_number}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      disabled
                    />
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <input
                      type="text"
                      defaultValue={invoice.bookings?.vehicle_type || ''}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      disabled
                    />
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <input
                      type="number"
                      step="0.01"
                      defaultValue={invoice.amount.toFixed(2)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <select
                      defaultValue={invoice.status}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="draft">Draft</option>
                      <option value="issued">Issued</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <input
                      type="date"
                      defaultValue={new Date(invoice.issue_date).toISOString().split('T')[0]}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleEdit(invoice)}
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
