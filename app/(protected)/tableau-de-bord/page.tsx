'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { Loader2 } from 'lucide-react'
import { UserDashboard } from '@/components/dashboard/user-dashboard'
import { AdminDashboard } from '@/components/dashboard/admin-dashboard'

export default function DashboardPage() {
    const [user, setUser] = useState<SupabaseUser | null>(null)
    const [userRole, setUserRole] = useState<string>('gratuit')
    const [loading, setLoading] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/connexion')
                return
            }
            setUser(user)

            // Fetch public user profile for role
            const { data: profile } = await supabase
                .from('users')
                .select('role')
                .eq('id', user.id)
                .single()

            if (profile) {
                setUserRole(profile.role)
            }

            setLoading(false)
        }

        getUser()
    }, [router, supabase])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
        )
    }

    if (userRole === 'admin') {
        return <AdminDashboard user={user} />
    }

    return <UserDashboard user={user} />
}
