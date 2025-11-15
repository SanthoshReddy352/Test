// components/Navbar.js
'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu, X, LogIn, LogOut, User, Building } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/context/AuthContext'
import anime from 'animejs/lib/anime.es.js';

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter() // Keep router for other navigation
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const { user, isAdmin, isSuperAdmin } = useAuth() 

  const isActive = (path) => pathname === path
  
  const navRef = useRef(null)
  const logoRef = useRef(null)

  // Navbar entrance animation
  useEffect(() => {
    if (navRef.current) {
      anime({
        targets: navRef.current,
        translateY: [-100, 0],
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutExpo'
      })
    }
    
    if (logoRef.current) {
      anime({
        targets: logoRef.current,
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 600,
        delay: 200,
        easing: 'easeOutElastic(1, .8)'
      })
    }
  }, [])

  // --- START OF FIX: Aggressive Logout ---
  const handleLogout = async () => {
    setMobileMenuOpen(false); // Close menu immediately
    try {
      const { error } = await supabase.auth.signOut();
      if (error && error.message !== "Session from session_id claim in JWT does not exist") {
        console.error('Error logging out:', error.message);
      }
    } catch (error) {
      console.error('Error in signOut process:', error);
    } finally {
      // This is the aggressive part. Supabase stores its data in
      // localStorage. We will manually clear all keys related to Supabase
      // to ensure no stale session data remains.
      if (typeof window !== 'undefined' && window.localStorage) {
        const keysToRemove = [];
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          if (key && key.startsWith('sb-')) { // Supabase keys start with 'sb-'
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => window.localStorage.removeItem(key));
      }
      
      // Force a full page reload by navigating to the root.
      // This will clear all React state and force a re-initialization.
      window.location.href = '/'; 
    }
  }
  // --- END OF FIX ---
  
  return (
    <nav ref={navRef} className="bg-background border-b border-border shadow-sm sticky top-0 z-50" style={{ opacity: 0 }}> 
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20"> 
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img ref={logoRef} src="/logo.jpg" alt="EventX Logo" className="h-14 w-auto" style={{ opacity: 0 }} /> 
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`transition-colors hover:text-brand-orange ${ 
                isActive('/') ? 'text-brand-orange font-semibold' : 'text-gray-300'
              }`}
            >
              Home
            </Link>
            <Link
              href="/events"
              className={`transition-colors hover:text-brand-orange ${ 
                isActive('/events') ? 'text-brand-orange font-semibold' : 'text-gray-300'
              }`}
            >
              Events
            </Link>
            
            {user && !isAdmin && (
                <Link
                  href="/contact"
                  className={`transition-colors hover:text-brand-orange ${ 
                    isActive('/contact') ? 'text-brand-orange font-semibold' : 'text-gray-300'
                  }`}
                >
                  Contact
                </Link>
            )}

            {user ? (
              <>
                {/* User is logged in */}
                <Link href="/profile">
                  <Button 
                    variant="ghost" 
                    className={`text-gray-300 hover:text-brand-orange ${isActive('/profile') ? 'font-semibold' : ''}`}
                  >
                    <User size={16} className="mr-2" />
                    Profile
                  </Button>
                </Link>
                
                {isAdmin && !isSuperAdmin && (
                    <Link href="/admin/club-profile">
                      <Button 
                        variant="ghost" 
                        className={`text-gray-300 hover:text-brand-orange ${isActive('/admin/club-profile') ? 'font-semibold' : ''}`}
                      >
                        <Building size={16} className="mr-2" />
                        Club Profile
                      </Button>
                    </Link>
                )}
                
                {isAdmin && (
                    <Link href="/admin">
                      <Button variant="ghost" className="text-gray-300 hover:text-brand-orange">
                        {isSuperAdmin ? 'Super Admin Portal' : 'Admin Portal'}
                      </Button>
                    </Link>
                )}
                
                <Button variant="destructive" onClick={handleLogout}>
                  <LogOut size={16} className="mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                {/* User is logged out */}
                <Link href="/admin/login">
                  <Button variant="ghost" className="text-gray-300 hover:text-brand-orange">
                    Admin Login
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button variant="default" className="bg-brand-gradient text-white font-semibold hover:opacity-90 transition-opacity">
                    <LogIn size={16} className="mr-2" />
                    Login/Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3">
            <Link
              href="/"
              className="block py-2 text-gray-300 hover:text-brand-orange"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/events"
              className="block py-2 text-gray-300 hover:text-brand-orange"
              onClick={() => setMobileMenuOpen(false)}
            >
              Events
            </Link>
            
            {user && !isAdmin && (
                <Link
                  href="/contact"
                  className="block py-2 text-gray-300 hover:text-brand-orange"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
            )}

            {user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-gray-300 hover:text-brand-orange"
                >
                  Profile
                </Link>

                {isAdmin && !isSuperAdmin && (
                    <Link
                      href="/admin/club-profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 text-gray-300 hover:text-brand-orange"
                    >
                      Club Profile
                    </Link>
                )}
              
                {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-2 text-gray-300 hover:text-brand-orange"
                    >
                      {isSuperAdmin ? 'Super Admin Portal' : 'Admin Portal'}
                    </Link>
                )}
                
                <Button 
                  onClick={handleLogout}
                  className="w-full bg-brand-red hover:bg-brand-red/90"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button className="w-full bg-brand-gradient text-white font-semibold hover:opacity-90 transition-opacity">
                    <LogIn size={16} className="mr-2" />
                    Login/Register
                  </Button>
                </Link>
                <Link
                  href="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block pt-2 text-sm text-center text-gray-500 hover:text-brand-orange"
                >
                  Admin Login
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}