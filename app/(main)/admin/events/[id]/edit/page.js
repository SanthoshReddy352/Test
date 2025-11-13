'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import GradientText from '@/components/GradientText'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase/client'

// Renamed component and added { params } prop
function EditEventPageContent({ params }) { 
  const router = useRouter()
  const { id } = params // Get event ID from URL

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [event_date, setEventDate] = useState('')
  const [event_end_date, setEventEndDate] = useState('')
  const [reg_start_date, setRegStartDate] = useState('')
  const [reg_end_date, setRegEndDate] = useState('')
  const [is_active, setIs_active] = useState(false)
  const [registration_open, setRegistration_open] = useState(false)
  const [banner_url, setBannerUrl] = useState('')
  const [location, setLocation] = useState('')
  const [prize_pool, setPrizePool] = useState('')
  const [contact_email, setContactEmail] = useState('')
  const [contact_phone, setContactPhone] = useState('')
  const [website, setWebsite] = useState('')
  const [team_size_min, setTeamSizeMin] = useState(1)
  const [team_size_max, setTeamSizeMax] = useState(1)
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true) // Loading state for fetch

  // Helper function to format ISO date strings for datetime-local input
  const formatDateTimeForInput = (dateString) => {
    if (!dateString) return '';
    try {
      // Slices to 'YYYY-MM-DDTHH:MM'
      return dateString.slice(0, 16);
    } catch (e) {
      console.error('Error formatting date:', e);
      return '';
    }
  };

  // --- NEW: useEffect to fetch event data ---
  useEffect(() => {
    if (id) {
      const fetchEvent = async () => {
        try {
          const response = await fetch(`/api/events/${id}`)
          const data = await response.json()

          if (data.success) {
            const event = data.event
            // Populate all form fields
            setTitle(event.title || '')
            setDescription(event.description || '')
            setEventDate(formatDateTimeForInput(event.event_date))
            setEventEndDate(formatDateTimeForInput(event.event_end_date))
            setRegStartDate(formatDateTimeForInput(event.reg_start_date))
            setRegEndDate(formatDateTimeForInput(event.reg_end_date))
            setIs_active(event.is_active || false)
            setRegistration_open(event.registration_open || false)
            setBannerUrl(event.banner_url || '')
            setLocation(event.location || '')
            setPrizePool(event.prize_pool || '')
            setContactEmail(event.contact_email || '')
            setContactPhone(event.contact_phone || '')
            setWebsite(event.website || '')
            setTeamSizeMin(event.team_size_min || 1)
            setTeamSizeMax(event.team_size_max || 1)
          } else {
            alert(`Failed to fetch event data: ${data.error}`)
            router.push('/admin/events')
          }
        } catch (error) {
          console.error('Error fetching event:', error)
          alert('An error occurred while fetching event data.')
        } finally {
          setLoading(false)
        }
      }

      fetchEvent()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, router])

  // --- MODIFIED: handleSubmit to UPDATE (PUT) ---
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session) {
      alert('Authentication error. Please log in again.')
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch(`/api/events/${id}`, { // Use ID in URL
        method: 'PUT', // Use PUT for update
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          title,
          description,
          event_date: event_date || null,
          event_end_date: event_end_date || null,
          reg_start_date: reg_start_date || null,
          reg_end_date: reg_end_date || null,
          is_active,
          registration_open,
          banner_url,
          location,
          prize_pool,
          contact_email,
          contact_phone,
          website,
          team_size_min,
          team_size_max
        })
      })

      const data = await response.json()
      if (data.success) {
        alert('Event updated successfully!')
        router.push('/admin/events')
      } else {
        alert(`Failed to update event: ${data.error}`)
      }
    } catch (error) {
      console.error('Error updating event:', error)
      alert('An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div>
        <p className="mt-4 text-gray-400">Loading Event Data...</p>
      </div>
    )
  }

  // --- MODIFIED: JSX with updated titles ---
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">
        <GradientText>Edit Event</GradientText>
      </h1>
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
          <CardDescription>Update the details for your event.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Event Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mega Hackathon 2025"
                  required
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Virtual or '123 Main St'"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your event..."
                rows={5}
              />
            </div>

            {/* Banner URL */}
            <div className="space-y-2">
              <Label htmlFor="banner_url">Banner Image URL</Label>
              <Input
                id="banner_url"
                value={banner_url}
                onChange={(e) => setBannerUrl(e.target.value)}
                placeholder="https://example.com/image.png"
              />
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Event Start Date */}
              <div className="space-y-2">
                <Label htmlFor="event_date">Event Start Date</Label>
                <Input
                  id="event_date"
                  type="datetime-local"
                  value={event_date}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </div>
              {/* Event End Date */}
              <div className="space-y-2">
                <Label htmlFor="event_end_date">Event End Date</Label>
                <Input
                  id="event_end_date"
                  type="datetime-local"
                  value={event_end_date}
                  onChange={(e) => setEventEndDate(e.target.value)}
                />
              </div>
              {/* Registration Start Date */}
              <div className="space-y-2">
                <Label htmlFor="reg_start_date">Registration Start Date</Label>
                <Input
                  id="reg_start_date"
                  type="datetime-local"
                  value={reg_start_date}
                  onChange={(e) => setRegStartDate(e.target.value)}
                />
              </div>
              {/* Registration End Date */}
              <div className="space-y-2">
                <Label htmlFor="reg_end_date">Registration End Date</Label>
                <Input
                  id="reg_end_date"
                  type="datetime-local"
                  value={reg_end_date}
                  onChange={(e) => setRegEndDate(e.target.value)}
                />
              </div>
            </div>

            {/* Team Size */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="team_size_min">Min Team Size</Label>
                <Input
                  id="team_size_min"
                  type="number"
                  value={team_size_min}
                  onChange={(e) => setTeamSizeMin(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team_size_max">Max Team Size</Label>
                <Input
                  id="team_size_max"
                  type="number"
                  value={team_size_max}
                  onChange={(e) => setTeamSizeMax(Math.max(team_size_min, parseInt(e.target.value) || 1))}
                  min={team_size_min}
                />
              </div>
            </div>

            {/* Other Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Prize Pool */}
              <div className="space-y-2">
                <Label htmlFor="prize_pool">Prize Pool</Label>
                <Input
                  id="prize_pool"
                  value={prize_pool}
                  onChange={(e) => setPrizePool(e.target.value)}
                  placeholder="e.g. $10,000 or 'Swag'"
                />
              </div>
              {/* Website */}
              <div className="space-y-2">
                <Label htmlFor="website">Event Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://my-event.com"
                />
              </div>
              {/* Contact Email */}
              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={contact_email}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="hello@event.com"
                />
              </div>
              {/* Contact Phone */}
              <div className="space-y-2">
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input
                  id="contact_phone"
                  type="tel"
                  value={contact_phone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is_active"
                  checked={is_active}
                  onCheckedChange={setIs_active}
                />
                <Label htmlFor="is_active">Event Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="registration_open"
                  checked={registration_open}
                  onCheckedChange={setRegistration_open}
                />
                <Label htmlFor="registration_open">Registration Open</Label>
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-brand-gradient text-white font-semibold hover:opacity-90 transition-opacity" disabled={isSubmitting}>
              {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

// Renamed default export and passing props
export default function EditEventPage({ params }) {
  return (
    <ProtectedRoute>
      <EditEventPageContent params={params} />
    </ProtectedRoute>
  )
}