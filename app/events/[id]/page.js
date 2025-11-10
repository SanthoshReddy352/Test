'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import DynamicForm from '@/components/DynamicForm'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card' 
import { Button } from '@/components/ui/button'
import { Calendar, Clock, ArrowLeft, Loader2, FileClock, XCircle, CheckCircle } from 'lucide-react'
import { parseISO } from 'date-fns'; 
import { formatInTimeZone } from 'date-fns-tz'; 
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client' 
import { useAuth } from '@/context/AuthContext' 

// (Helper functions unchanged)

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true) 
  const [submitted, setSubmitted] = useState(false)
  const { user, loading: authLoading } = useAuth() 
  const [isRegistered, setIsRegistered] = useState(false) 
  const [registrationStatus, setRegistrationStatus] = useState(null)
  const [regCheckLoading, setRegCheckLoading] = useState(false) 
  const storageKey = `formData-${params.id}`;
  
  const [formData, setFormData] = useState(() => {
    // (Unchanged)
  });

  const setAndStoreFormData = (newData) => {
    // (Unchanged)
  };

  const checkRegistrationStatus = useCallback(async (userId, eventId) => {
    // (Unchanged, but now includes setters in dep array)
  }, [setIsRegistered, setRegistrationStatus, setRegCheckLoading]) 

  useEffect(() => {
    // (Fetch event data unchanged)
  }, [params.id]);

  useEffect(() => {
    if (loading || authLoading || !event) return; 

    if (user) {
        checkRegistrationStatus(user.id, event.id);
    } else {
        setIsRegistered(false);
        setRegistrationStatus(null);
        setRegCheckLoading(false); 
    }
  }, [user?.id, event?.id, loading, authLoading, checkRegistrationStatus]); 

  const handleSubmit = async (submitData) => {
    // (Unchanged)
  }

  if (loading && !authLoading) {
     return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div> {/* CHANGED */}
              <p className="mt-4 text-gray-400">Loading event...</p> {/* CHANGED */}
            </div>
        </div>
     )
  }

  // (Date/status logic unchanged)
  
  const registrationContent = () => {
      if (authLoading) {
          return (
              <Card>
                  <CardContent className="py-12 text-center">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-brand-red" /> {/* CHANGED */}
                      <p className="mt-4 text-gray-400">Checking session...</p> {/* CHANGED */}
                  </CardContent>
              </Card>
          )
      }
      
      if (isCompleted) {
           return (
              <Card>
                  <CardContent className="py-12 text-center text-gray-500">
                      <CheckCircle size={48} className="mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-semibold mb-2">Event Completed</p>
                      <p>This event has already finished.</p>
                  </CardContent>
              </Card>
          )
      }
      if (isRegistered) {
          // (All status cards are unchanged, they use green/orange/red which is fine)
      }
      if (!isRegistrationAvailable) {
          // (Unchanged)
      }
      if (!user) {
          return (
              <Card className="border-yellow-500">
                  <CardHeader>
                    <CardTitle>Sign in to Register</CardTitle>
                    <CardDescription>You must be logged in to access the registration form for this event.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                      <Link href={`/auth?redirect=${params.id}`}>
                        <Button className="w-full bg-brand-gradient text-white font-semibold hover:opacity-90 transition-opacity"> {/* CHANGED */}
                          Login or Register
                        </Button>
                      </Link>
                  </CardContent>
              </Card>
          )
      }
      if (submitted) {
          // (Unchanged, orange pending card is fine)
      }

      // 6. Show Form
      return (
          <Card>
              <CardHeader>
                  <CardTitle>Registration Form</CardTitle>
                  <CardDescription>Logged in as: {user?.email || 'Loading...'}</CardDescription>
              </CardHeader>
              <CardContent className="relative">
                  {regCheckLoading && (
                      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm"> {/* CHANGED */}
                          <Loader2 className="mx-auto h-8 w-8 animate-spin text-brand-red" /> {/* CHANGED */}
                          <p className="mt-4 text-gray-400">Checking registration status...</p> {/* CHANGED */}
                      </div>
                  )}
                  
                  <fieldset disabled={regCheckLoading}>
                      <DynamicForm
                          fields={event.form_fields || []}
                          onSubmit={handleSubmit}
                          eventId={params.id}
                          formData={formData} 
                          onFormChange={setAndStoreFormData} 
                      />
                  </fieldset>
              </CardContent>
          </Card>
      )
  }

  if (!loading && !authLoading && !event) {
    // (Unchanged, error state is fine)
  }

  return (
    <div className="min-h-screen bg-background"> {/* CHANGED */}
      <div className="w-full h-64 bg-brand-gradient relative"> {/* CHANGED */}
        {event?.banner_url && (
          <img
            src={event.banner_url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10 pb-12">
        <div className="max-w-4xl mx-auto">
          <Link href="/events">
            <Button 
                variant="ghost" 
                className="mb-4 text-white hover:text-gray-200 hover:bg-white/10"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Events
            </Button>
          </Link>

          {event && (
            <>
              <Card className="mb-8">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-3xl mb-2">{event.title}</CardTitle>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400"> {/* CHANGED */}
                        <div className="flex items-center">
                          <Calendar size={16} className="mr-2 text-brand-red" /> {/* CHANGED */}
                          <span>{formattedDate}</span>
                        </div>
                        {formattedTime && (
                          <div className="flex items-center">
                            <Clock size={16} className="mr-2 text-brand-red" /> {/* CHANGED */}
                            <span>{formattedTime}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {statusBadge}
                  </div>
                </CardHeader>
                <CardContent>
                  <Card className="mb-6 bg-background"> {/* CHANGED */}
                    <CardHeader>
                      <CardTitle className="text-lg">Registration Timeline</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium w-20">Starts:</span>
                        <span className="text-gray-300">{formattedRegStart}</span> {/* CHANGED */}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium w-20">Ends:</span>
                        <span className="text-gray-300">{formattedRegEnd}</span> {/* CHANGED */}
                      </div>
                    </CardContent>
                  </Card>
                
                  <h3 className="font-bold text-xl mb-2">Description</h3>
                  <p className="text-gray-300 whitespace-pre-wrap"> {/* CHANGED */}
                    {event.description || 'No description available'}
                  </p>
                </CardContent>
              </Card>

              {registrationContent()}
            </>
          )}
        </div>
      </div>
    </div>
  )
}