'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignIn() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Hardcoded credentials
    const hardcodedUsername = 'admin'
    const hardcodedPassword = 'adminpanja01'

    // Check if username and password are correct
    if (username === hardcodedUsername && password === hardcodedPassword) {
      // Redirect to /admin/dashboard
      router.push('/admin/dashboard')
    } else {
      // Display error message if credentials are incorrect
      setError('Invalid username or password')
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Welcome Back</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg  text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          {error && (
            <div className="mb-4 text-sm text-red-600 text-center">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Sign In
          </button>
        </form>      
      </div>
    </div>
  )
}