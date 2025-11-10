'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Users, FileEdit } from 'lucide-react'
import { format } from 'date-fns'
import { useAuth } from '@/context/AuthContext' 
import { supabase } from '@/lib/supabase/client' 

function AdminEventsContent() {
  const router = useRouter()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const { user, isSuperAdmin } = useAuth() 

  useEffect(() => {
    // --- START OF FIX: Depend on user.id, not the user object ---
    if (user) {
      fetchEvents()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, isSuperAdmin]) // Add isSuperAdmin to dependency array
  // --- END OF FIX ---

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      const data = await response.json()
      if (data.success) {
        // --- START OF FIX: Filter events based on role ---
        const allEvents = data.events;
        if (isSuperAdmin) {
          setEvents(allEvents); // Super admin sees all events
        } else {
          // Normal admin sees only their own events
          const myEvents = allEvents.filter(event => event.created_by === user.id);
          setEvents(myEvents);
        }
        // --- END OF FIX ---
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        alert('Authentication error. Please log in again.');
        return;
      }

      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${session.access_token}`
        }
      })

      const data = await response.json()
      if (data.success) {
        fetchEvents()
      } else {
        alert(`Failed to delete event: ${data.error}`)
      }
    } catch (error) {
      console.error('Error deleting event:', error)
      alert('An error occurred')
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#00629B]"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Manage Events</h1>
          <p className="text-gray-600 mt-2">Create and manage hackathon events</p>
        </div>
        <Link href="/admin/events/new">
          <Button className="bg-[#00629B] hover:bg-[#004d7a]">
            <Plus size={20} className="mr-2" />
            Create Event
          </Button>
        </Link>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            {/* --- START OF FIX: Context-aware message --- */}
            <p className="text-gray-500 mb-4">
              {isSuperAdmin ? "No events found in the system." : "You have not created any events yet."}
            </p>
            {/* --- END OF FIX --- */}
            <Link href="/admin/events/new">
              <Button className="bg-[#00629B] hover:bg-[#004d7a]">
                Create Your First Event
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            // This logic is now redundant for filtering but still good for disabling buttons
            // in a theoretical edge case, so we'll keep it.
            const canManage = isSuperAdmin || (user && event.created_by === user.id);
            
            const now = new Date();
            const eventEndDate = event.event_end_date ? new Date(event.event_end_date) : null;
            const isCompleted = eventEndDate && now > eventEndDate;
            
            return (
              <Card key={event.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <div className="flex gap-2">
                      {isCompleted ? (
                        <Badge className="bg-gray-500">Completed</Badge>
                      ) : event.is_active ? (
                        <Badge className="bg-green-500">Active</Badge>
                      ) : (
                        <Badge variant="outline">Inactive</Badge>
                      )}
                      
                      {!isCompleted && event.registration_open && (
                        <Badge className="bg-blue-500">Open</Badge>
                      )}
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {event.description || 'No description'}
                  </CardDescription>
                  {event.event_date && (
                    <p className="text-sm text-gray-500 mt-2">
                      {format(new Date(event.event_date), 'MMMM dd, yyyy')}
                    </p>
                  )}
                </CardHeader>
                <CardFooter className="mt-auto flex flex-col gap-2">
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <Link href={`/admin/events/${event.id}`} className="w-full">
                      <Button variant="outline" className="w-full" size="sm" disabled={!canManage}>
                        <Edit size={16} className="mr-1" />
                        Edit
                      </Button>
                    </Link>
                    
                    <Link href={`/admin/events/${event.id}/form-builder`} className="w-full">
                      <Button variant="outline" className="w-full" size="sm" disabled={!canManage}>
                        <FileEdit size={16} className="mr-1" />
                        Form
                      </Button>
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-2 w-full">
                    <Link href={`/admin/participants/${event.id}`} className="w-full">
                      <Button variant="outline" className="w-full" size="sm" disabled={!canManage}>
                        <Users size={16} className="mr-1" />
                        Participants
                      </Button>
                    </Link>
                    
                    <Button
                      variant="destructive"
                      className="w-full"
                      size="sm"
                      onClick={() => handleDelete(event.id)}
                      disabled={!canManage}
                    >
                      <Trash2 size={16} className="mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function AdminEventsPage() {
  return (
    <ProtectedRoute>
      <AdminEventsContent />
    </ProtectedRoute>
  )
}