'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ArrowLeft, Download } from 'lucide-react'
import { format } from 'date-fns'

function ParticipantsContent() {
  const params = useParams()
  const router = useRouter()
  const [event, setEvent] = useState(null)
  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(true)
  const [columnHeaders, setColumnHeaders] = useState([]) // NEW: To store dynamic column headers

  useEffect(() => {
    if (params.eventId) {
      fetchData()
    }
  }, [params.eventId])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [eventRes, participantsRes] = await Promise.all([
        // Fetch event details to get the form schema
        fetch(`/api/events/${params.eventId}`),
        // Fetch all participants
        fetch(`/api/participants/${params.eventId}`),
      ])

      const eventData = await eventRes.json()
      const participantsData = await participantsRes.json()
      
      let fields = [];

      if (eventData.success && eventData.event) {
          setEvent(eventData.event)
          fields = eventData.event.form_fields || []
      }
      
      if (participantsData.success && participantsData.participants) {
          setParticipants(participantsData.participants)
      }
      
      // Determine dynamic headers from the form schema
      const dynamicHeaders = fields.map(field => field.label)
      setColumnHeaders(dynamicHeaders)

    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    if (participants.length === 0) {
      alert('No participants to export')
      return
    }

    // Use the determined column headers (labels) for the CSV
    const headers = ['#', 'Registration Date', ...columnHeaders]
    
    const rows = participants.map((p, index) => {
      const row = [
        index + 1,
        new Date(p.created_at).toLocaleString(),
      ]
      
      // Map responses using the column headers (labels)
      columnHeaders.forEach((label) => {
        // Find the matching key in the responses object. 
        // NOTE: We assume the key in p.responses is the field label OR the field id.
        // Based on DynamicForm.js and FormBuilder.js, the key is the field.id || field.label. 
        // For simplicity, we stick to the LABEL, as it is unique and what the admin expects.
        let value = p.responses[label] || '';
        
        // Format boolean values
        if (typeof value === 'boolean') {
             value = value ? 'Yes' : 'No';
        }

        row.push(value)
      })
      return row
    })

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${event?.title || 'event'}-participants.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#00629B]"></div>
      </div>
    )
  }

  // --- RENDERING LOGIC ---
  
  // Base columns always shown
  const fixedHeaders = [
    { label: '#', key: 'index', className: 'w-12' },
    { label: 'Registration Date', key: 'created_at', className: 'w-40' }
  ];
  
  // Combine fixed and dynamic headers
  const allHeaders = [
    ...fixedHeaders,
    ...columnHeaders.map(label => ({ label, key: label })) // Using label as key for dynamic fields
  ];


  return (
    <div className="container mx-auto px-4 py-12">
      <Button
        variant="ghost"
        onClick={() => router.push('/admin/events')}
        className="mb-4"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Events
      </Button>

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Participants</h1>
          <p className="text-gray-600 mt-2">{event?.title}</p>
        </div>
        {participants.length > 0 && (
          <Button
            onClick={exportToCSV}
            className="bg-[#00629B] hover:bg-[#004d7a]"
          >
            <Download size={20} className="mr-2" />
            Export CSV
          </Button>
        )}
      </div>

      {participants.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            <p>No participants yet</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Total Registrations: {participants.length}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {allHeaders.map((header) => (
                        <TableHead key={header.key} className={header.className}>
                            {header.label}
                        </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participants.map((participant, index) => (
                    <TableRow key={participant.id}>
                      {/* Fixed Columns */}
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(participant.created_at), 'MMM dd, yyyy HH:mm')}
                      </TableCell>

                      {/* Dynamic Response Columns */}
                      {columnHeaders.map((label) => {
                          let value = participant.responses[label] || '';
                          
                          // Format boolean values for display
                          if (typeof value === 'boolean') {
                              value = value ? (
                                  <span className="text-green-600 font-medium">Yes</span>
                              ) : (
                                  <span className="text-red-600">No</span>
                              );
                          } else if (value === '') {
                              value = <span className="text-gray-400">-</span>;
                          }

                          return (
                              <TableCell key={`${participant.id}-${label}`} className="text-sm">
                                  {value}
                              </TableCell>
                          );
                      })}
                      
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function ParticipantsPage() {
  return (
    <ProtectedRoute>
      <ParticipantsContent />
    </ProtectedRoute>
  )
}