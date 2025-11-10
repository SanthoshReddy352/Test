// components/ProtectedRoute.js
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext' // IMPORT useAuth

export default function ProtectedRoute({ children }) {
  const router = useRouter()
  // Get auth state directly from context
  const { user, isAdmin, loading } = useAuth() 

  // --- START OF FIX: Depend on user.id ---
  useEffect(() => {
    // This check runs *after* the context is loaded
    if (!loading) {
      if (!user || !isAdmin) {
        // If user is not logged in OR is not an admin, redirect
        router.push('/admin/login')
      }
    }
  }, [user?.id, isAdmin, loading, router])
  // --- END OF FIX ---

  // While context is loading, show a spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#00629B]"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If user is logged in AND is an admin, show the protected content
  if (user && isAdmin) {
    return children
  }

  // Otherwise, render null (as redirect is in progress)
  return null
}