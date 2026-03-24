'use client'

import Link from 'next/link'
import { Mail, CheckCircle } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-100 flex items-center justify-center px-6">
      <div className="absolute top-6 left-6">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Fenix
        </Link>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-blue-100 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Check Your Email</h1>
        <p className="text-gray-600 mb-6">
          We have sent a confirmation link to your email address. Please click the link to verify your account before signing in.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-blue-700">
            <Mail className="w-5 h-5" />
            <span className="font-medium">Confirmation email sent</span>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-6">
          Did not receive the email? Check your spam folder or try signing up again.
        </p>

        <Link 
          href="/login" 
          className="inline-block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-md"
        >
          Go to Sign In
        </Link>

        <p className="text-center text-gray-600 mt-6">
          <Link href="/" className="text-blue-600 font-semibold hover:text-blue-800 transition">
            Back to Home
          </Link>
        </p>
      </div>
    </main>
  )
}
