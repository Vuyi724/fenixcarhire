'use client'

import { ProtectedAdminRoute } from '@/components/ProtectedAdminRoute'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/customers', label: 'Customers', icon: '👥' },
    { href: '/admin/invoices', label: 'Invoices', icon: '📄' },
    { href: '/admin/quotations', label: 'Quotations', icon: '💼' },
    { href: '/admin/payments', label: 'Payments', icon: '💰' },
    { href: '/admin/checksheets', label: 'Check Sheets', icon: '✓' },
    { href: '/admin/reports', label: 'Reports', icon: '📈' },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 text-white shadow-lg">
          <div className="p-6 border-b border-gray-700">
            <h1 className="text-2xl font-bold">Fenix Admin</h1>
            <p className="text-sm text-gray-400 mt-1">Management Portal</p>
          </div>

          <nav className="mt-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-6 py-3 transition ${
                    isActive
                      ? 'bg-blue-600 border-l-4 border-blue-400'
                      : 'hover:bg-gray-800'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="absolute bottom-0 w-64 p-6 border-t border-gray-700">
            <Link href="/" className="text-sm text-gray-400 hover:text-gray-200">
              Back to Website
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="bg-white shadow">
            <div className="px-6 py-4">
              <h2 className="text-gray-700 text-sm">Admin Portal</h2>
            </div>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
  )
}
