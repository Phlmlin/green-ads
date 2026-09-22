'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'
import { AdminDashboard } from '@/components/dashboard/admin-dashboard'

export default function AdminPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadAdmin() {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (!currentUser) {
        router.replace('/connexion')
        return
      }

      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', currentUser.id)
        .single()

      if (!profile || profile.role !== 'admin') {
        router.replace('/tableau-de-bord')
        return
      }

      if (active) {
        setUser(currentUser)
        setLoading(false)
      }
    }

    loadAdmin()
    return () => {
      active = false
    }
  }, [router, supabase])

  if (loading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#f26b4f]" aria-label="Chargement de l’administration" />
      </div>
    )
  }

  return <AdminDashboard user={user} />
}
