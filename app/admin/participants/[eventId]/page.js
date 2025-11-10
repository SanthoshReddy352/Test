'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card' 
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ArrowLeft, Download, ShieldAlert, Loader2 } from 'lucide-react' 
import { format } from 'date-fns'
import { useAuth } from '@/context/AuthContext' 
import { supabase } from '@/lib/supabase/client' 

function ParticipantsContent() {
  const params = useParams()
  const router = useRouter()
  const [event, setEvent] = useState(null)
  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(true)
  const [dynamicFields, setDynamicFields] = useState([]) 
  const { user, isSuperAdmin, loading: authLoading } = useAuth() 

  useEffect(() => {
    if (params.eventId && user) { 
      fetchData()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.eventId, user?.id]) 

  const fetchData = async () => {
    // (Fetch logic remains unchanged)
  }

  const getParticipantResponseValue = (participant, field) => {
    // (Unchanged)
  };

  const exportToCSV = () => {
    // (Unchanged)
  }

  if ((authLoading || loading) && participants.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red"></div> {/* CHANGED */}
      </div>
    )
  }

  const canManage = event && user && (isSuperAdmin || event.created_by === user.id);
  if (!loading && !authLoading && event && !canManage) {
    // (Unchanged)
  }
  
  const fixedHeaders = [
    { label: 'S.No', key: 'index', className: 'w-12' }, 
    { label: 'Registration Date', key: 'created_at', className: 'w-40' }
  ];
  
  const allHeaders = [
    ...fixedHeaders,
    ...dynamicFields 
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
          <p className="text-gray-400 mt-2">{event?.title}</p> {/* CHANGED */}
        </div>
        {participants.length > 0 && (
          <Button
            onClick={exportToCSV}
            className="bg-brand-gradient text-white font-semibold hover:opacity-90 transition-opacity" // CHANGED
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={20} className="mr-2 animate-spin" />
            ) : (
              <Download size={20} className="mr-2" />
            )}
            {loading ? 'Refreshing...' : 'Export CSV'}
          </Button>
        )}
      </div>

      {participants.length === 0 && !loading ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-400"> {/* CHANGED */}
            <p>No approved participants yet</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Total Approved Registrations: {participants.length}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className={`overflow-x-auto ${loading ? 'opacity-50' : ''}`}>
              <Table>
                {/* (Table content unchanged) */}
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