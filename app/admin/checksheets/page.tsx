'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/app/auth-context'

interface CheckSheet {
  id: string
  check_type: string
  car_condition: string
  fuel_level: string
  mileage: number
  damage_report: string
  checked_date: string
  bookings: any
  users: any
}

export default function CheckSheetsPage() {
  const { user } = useAuth()
  const [checkSheets, setCheckSheets] = useState<CheckSheet[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    booking_id: '',
    check_type: 'pre_rental',
    car_condition: '',
    fuel_level: '',
    mileage: '',
    damage_report: '',
  })
  const [bookings, setBookings] = useState<any[]>([])

  useEffect(() => {
    fetchCheckSheets()
    fetchBookings()
  }, [])

  const fetchCheckSheets = async () => {
    try {
      const { data, error } = await supabase
        .from('check_sheets')
        .select('*, bookings(id, vehicle_type), users(full_name)')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCheckSheets(data || [])
    } catch (error) {
      console.error('Error fetching check sheets:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('id, vehicle_type, users(full_name)')
        .order('created_at', { ascending: false })

      if (error) throw error
      setBookings(data || [])
    } catch (error) {
      console.error('Error fetching bookings:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/checksheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: formData.booking_id,
          check_type: formData.check_type,
          car_condition: formData.car_condition,
          fuel_level: formData.fuel_level,
          mileage: formData.mileage ? parseInt(formData.mileage) : null,
          damage_report: formData.damage_report,
          checked_by: user?.id,
        }),
      })

      if (!response.ok) throw new Error('Failed to create check sheet')

      setFormData({
        booking_id: '',
        check_type: 'pre_rental',
        car_condition: '',
        fuel_level: '',
        mileage: '',
        damage_report: '',
      })
      setShowForm(false)
      fetchCheckSheets()
    } catch (error) {
      console.error('Error creating check sheet:', error)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Check Sheets</h1>
          <p className="text-gray-600 mt-2">Pre & post rental vehicle inspection records</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {showForm ? 'Cancel' : 'Create Check Sheet'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Check Sheet</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Booking</label>
                <select
                  required
                  value={formData.booking_id}
                  onChange={(e) => setFormData({ ...formData, booking_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a booking</option>
                  {bookings.map((booking) => (
                    <option key={booking.id} value={booking.id}>
                      {booking.vehicle_type} - {booking.users?.full_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check Type</label>
                <select
                  value={formData.check_type}
                  onChange={(e) => setFormData({ ...formData, check_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pre_rental">Pre-Rental</option>
                  <option value="post_rental">Post-Rental</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Level</label>
                <input
                  type="text"
                  value={formData.fuel_level}
                  onChange={(e) => setFormData({ ...formData, fuel_level: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Full, 3/4, Half, 1/4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mileage</label>
                <input
                  type="number"
                  value={formData.mileage}
                  onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="KM"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Car Condition</label>
                <textarea
                  value={formData.car_condition}
                  onChange={(e) => setFormData({ ...formData, car_condition: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the overall condition..."
                  rows={3}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Damage Report</label>
                <textarea
                  value={formData.damage_report}
                  onChange={(e) => setFormData({ ...formData, damage_report: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Note any damages or issues..."
                  rows={3}
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Create Check Sheet
            </button>
          </form>
        </div>
      )}

      {/* Check Sheets Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading check sheets...</p>
          </div>
        ) : checkSheets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No check sheets yet</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Vehicle</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Fuel Level</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Mileage</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Checked By</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
              </tr>
            </thead>
            <tbody>
              {checkSheets.map((sheet) => (
                <tr key={sheet.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      sheet.check_type === 'pre_rental' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {sheet.check_type === 'pre_rental' ? 'Pre-Rental' : 'Post-Rental'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{sheet.bookings?.vehicle_type}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{sheet.fuel_level || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{sheet.mileage ? `${sheet.mileage} KM` : '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{sheet.users?.full_name || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(sheet.checked_date).toLocaleDateString()}
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
