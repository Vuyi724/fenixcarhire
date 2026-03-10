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
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    booking_id: '',
    check_type: 'pre_rental',
    vehicle_registration: '',
    plate_number: '',
    odometer_reading: '',
    fuel_level: 'full',
    tire_condition: '',
    exterior_damage: '',
    interior_condition: '',
    windows_mirrors: '',
    lights_working: '',
    wipers_working: '',
    ac_working: '',
    checked_by: '',
    signature: '',
    damage_notes: '',
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

  const handleEdit = (checkSheet: CheckSheet) => {
    setEditingId(checkSheet.id)
    setFormData({
      booking_id: checkSheet.bookings?.id || '',
      check_type: checkSheet.check_type,
      vehicle_registration: '',
      plate_number: '',
      odometer_reading: checkSheet.mileage?.toString() || '',
      fuel_level: checkSheet.fuel_level,
      tire_condition: '',
      exterior_damage: '',
      interior_condition: '',
      windows_mirrors: '',
      lights_working: '',
      wipers_working: '',
      ac_working: '',
      checked_by: user?.user_metadata?.full_name || '',
      signature: '',
      damage_notes: checkSheet.damage_report || '',
    })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/checksheets${editingId ? `/${editingId}` : ''}`, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: formData.booking_id,
          check_type: formData.check_type,
          vehicle_registration: formData.vehicle_registration,
          plate_number: formData.plate_number,
          odometer_reading: formData.odometer_reading,
          fuel_level: formData.fuel_level,
          tire_condition: formData.tire_condition,
          exterior_damage: formData.exterior_damage,
          interior_condition: formData.interior_condition,
          windows_mirrors: formData.windows_mirrors,
          lights_working: formData.lights_working,
          wipers_working: formData.wipers_working,
          ac_working: formData.ac_working,
          checked_by: formData.checked_by,
          damage_notes: formData.damage_notes,
        }),
      })

      if (!response.ok) throw new Error(`Failed to ${editingId ? 'update' : 'create'} check sheet`)

      setFormData({
        booking_id: '',
        check_type: 'pre_rental',
        vehicle_registration: '',
        plate_number: '',
        odometer_reading: '',
        fuel_level: 'full',
        tire_condition: '',
        exterior_damage: '',
        interior_condition: '',
        windows_mirrors: '',
        lights_working: '',
        wipers_working: '',
        ac_working: '',
        checked_by: '',
        signature: '',
        damage_notes: '',
      })
      setEditingId(null)
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
          onClick={() => {
            setShowForm(!showForm)
            if (showForm) setEditingId(null)
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {showForm ? 'Cancel' : 'Create Check Sheet'}
        </button>
      </div>

      {/* Create Form - Vehicle Check Sheet */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-8 mb-6 max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">VEHICLE CHECK SHEET</h2>
          <p className="text-center text-sm text-gray-600 mb-6">Fenix Car Hire - Pre & Post Rental Inspection</p>
          
          <form onSubmit={handleSubmit}>
            {/* Vehicle & Check Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 border border-gray-300">
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1">Vehicle Registration</label>
                <input type="text" className="w-full px-2 py-1 border border-gray-300 rounded text-sm" placeholder="ABE 123" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1">Plate Number</label>
                <input type="text" className="w-full px-2 py-1 border border-gray-300 rounded text-sm" placeholder="BW 123" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1">Check Type</label>
                <select
                  value={formData.check_type}
                  onChange={(e) => setFormData({ ...formData, check_type: e.target.value })}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="pre_rental">Pre-Rental</option>
                  <option value="post_rental">Post-Rental</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-1">Odometer</label>
                <input
                  type="number"
                  value={formData.odometer_reading}
                  onChange={(e) => setFormData({ ...formData, odometer_reading: e.target.value })}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  placeholder="KM"
                />
              </div>
            </div>

            {/* Condition Checks - Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Left Column */}
              <div className="border border-gray-300 p-4">
                <h3 className="font-bold text-gray-900 mb-4">Pre-Rental Inspection</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <label className="text-sm font-medium text-gray-700 mr-3 flex-1">Fuel Level</label>
                    <div className="flex gap-2">
                      {['Full', '3/4', 'Half', '1/4', 'Empty'].map((level) => (
                        <label key={level} className="flex items-center">
                          <input type="radio" name="fuel_pre" className="mr-1" />
                          <span className="text-xs">{level}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Tire Condition</label>
                    <input type="text" className="w-full px-2 py-1 border border-gray-300 rounded text-sm mt-1" placeholder="Good/Fair/Poor" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Exterior Damage</label>
                    <textarea className="w-full px-2 py-1 border border-gray-300 rounded text-sm mt-1" rows={2} placeholder="Describe any damage..." />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Windows & Mirrors</label>
                    <input type="text" className="w-full px-2 py-1 border border-gray-300 rounded text-sm mt-1" placeholder="OK/Damaged" />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="border border-gray-300 p-4">
                <h3 className="font-bold text-gray-900 mb-4">Vehicle Condition</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Interior Condition</label>
                    <input type="text" className="w-full px-2 py-1 border border-gray-300 rounded text-sm mt-1" placeholder="Clean/Dirty/Excellent" />
                  </div>
                  <div className="flex items-center">
                    <label className="text-sm font-medium text-gray-700 flex-1">Lights Working</label>
                    <div className="flex gap-3">
                      <label><input type="radio" name="lights" /> Yes</label>
                      <label><input type="radio" name="lights" /> No</label>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <label className="text-sm font-medium text-gray-700 flex-1">Wipers Working</label>
                    <div className="flex gap-3">
                      <label><input type="radio" name="wipers" /> Yes</label>
                      <label><input type="radio" name="wipers" /> No</label>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <label className="text-sm font-medium text-gray-700 flex-1">AC Working</label>
                    <div className="flex gap-3">
                      <label><input type="radio" name="ac" /> Yes</label>
                      <label><input type="radio" name="ac" /> No</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Comments Section */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-900 mb-2">Additional Comments</label>
              <textarea
                value={formData.damage_notes}
                onChange={(e) => setFormData({ ...formData, damage_notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                placeholder="Any additional observations..."
                rows={3}
              />
            </div>

            {/* Signature Section */}
            <div className="grid grid-cols-2 gap-8 mb-6 p-4 border border-gray-300">
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-2">Checked By (Name)</label>
                <input
                  type="text"
                  value={formData.checked_by}
                  onChange={(e) => setFormData({ ...formData, checked_by: e.target.value })}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm mb-3"
                  placeholder="Inspector Name"
                />
                <label className="block text-xs font-bold text-gray-900 mb-1">Signature</label>
                <div className="border-2 border-gray-400 h-16 flex items-center justify-center text-gray-400 text-sm">
                  Signature / Initial
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-900 mb-2">Date</label>
                <input type="date" className="w-full px-2 py-1 border border-gray-300 rounded text-sm mb-3" defaultValue={new Date().toISOString().split('T')[0]} />
                <label className="block text-xs font-bold text-gray-900 mb-1">Time</label>
                <input type="time" className="w-full px-2 py-1 border border-gray-300 rounded text-sm" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
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
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleEdit(sheet)}
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
