import Link from 'next/link'

export default function SignUpSuccessPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-100 flex items-center justify-center px-6">
      <div className="absolute top-6 left-6">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Fenix
        </Link>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-blue-100 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Check Your Email</h1>
        <p className="text-gray-600 mb-6">
          We have sent a confirmation link to your email address. Please click the link to verify your account before signing in.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            Did not receive the email? Check your spam folder or try signing up again.
          </p>
        </div>

        <Link 
          href="/login"
          className="inline-block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-md"
        >
          Go to Login
        </Link>
      </div>
    </main>
  )
}
