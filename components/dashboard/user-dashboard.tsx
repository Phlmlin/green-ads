'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Settings, LogOut, Package, MessageSquare, CreditCard, Loader2, CheckCircle, X, Heart, Clock, Eye } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { AdBanner } from '@/components/ui/ad-banner'
import Image from 'next/image'

interface UserDashboardProps {
    user: any
    initialActiveTab?: string
}

export function UserDashboard({ user, initialActiveTab = 'ads' }: UserDashboardProps) {
    const [activeTab, setActiveTab] = useState(initialActiveTab)
    const [userAds, setUserAds] = useState<any[]>([])
    const [loadingAds, setLoadingAds] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        fetchUserAds()
    }, [user])

    const fetchUserAds = async () => {
        if (!user) return

        const { data, error } = await supabase
            .from('ads')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(5)

        if (data) {
            setUserAds(data)
        }
        setLoadingAds(false)
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/connexion')
        router.refresh()
    }

    const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Utilisateur'
    const userEmail = user?.email || ''
    const userInitial = userName.charAt(0).toUpperCase()
    const memberSince = user?.created_at
        ? new Date(user.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
        : ''

    const stats = {
        activeAds: userAds.filter(ad => ad.status === 'approved').length,
        expiredAds: userAds.filter(ad => ad.status === 'expired' || ad.status === 'rejected').length, // Approximating expired for now
        messages: 0, // Placeholder
        views: userAds.reduce((acc, curr) => acc + (curr.views || 0), 0)
    }

    return (
        <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Navigation */}
            <aside className="md:w-64 flex-shrink-0">
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-2xl mb-4">
                            {userInitial}
                        </div>
                        <h2 className="font-bold text-gray-900">{userName}</h2>
                        <p className="text-sm text-gray-500">{userEmail}</p>
                        {memberSince && (
                            <p className="text-xs text-gray-400 mt-1">Membre depuis {memberSince}</p>
                        )}
                    </div>

                    <nav className="p-2 space-y-1">
                        <button
                            onClick={() => setActiveTab('ads')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeTab === 'ads' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <Package size={18} />
                            Mes annonces
                        </button>
                        <button
                            onClick={() => setActiveTab('messages')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeTab === 'messages' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <MessageSquare size={18} />
                            Messages
                        </button>
                        <button
                            onClick={() => setActiveTab('favorites')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeTab === 'favorites' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <Heart size={18} />
                            Favoris
                        </button>
                        <button
                            onClick={() => setActiveTab('subscription')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeTab === 'subscription' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <CreditCard size={18} />
                            Abonnement
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeTab === 'settings' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <Settings size={18} />
                            Paramètres
                        </button>
                    </nav>

                    <div className="p-2 border-t border-gray-100 mt-2">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                            <LogOut size={18} />
                            Déconnexion
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Tableau de bord
                    </h1>
                    <Link href="/publier">
                        <Button className="bg-green-600 hover:bg-green-700 gap-2">
                            <Plus size={18} /> Publier une annonce
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-sm mb-1">Annonces actives</p>
                        <p className="text-3xl font-bold text-green-700">{stats.activeAds}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-sm mb-1">Annonces expirées</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.expiredAds}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-sm mb-1">Messages reçus</p>
                        <p className="text-3xl font-bold text-amber-500">{stats.messages}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-sm mb-1">Vues totales</p>
                        <p className="text-3xl font-bold text-blue-600">{stats.views}</p>
                    </div>
                </div>

                {/* Premium Banner */}
                <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-6 text-white flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold mb-1">Passez en Premium pour plus de visibilité</h3>
                        <p className="text-gray-300 text-sm">Boostez vos ventes en plaçant vos annonces en tête de liste et accédez à des statistiques avancées.</p>
                    </div>
                    <Link href="/tarifs">
                        <Button variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                            Voir les offres
                        </Button>
                    </Link>
                </div>

                {/* Success Message */}
                {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('success') === 'true' && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                        <CheckCircle size={20} />
                        <p>Votre annonce a été publiée avec succès ! Elle est en cours de validation.</p>
                        <button
                            onClick={() => router.replace('/tableau-de-bord')}
                            className="ml-auto text-green-600 hover:text-green-800"
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}

                {/* Mes dernières annonces */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-900">Mes dernières annonces</h2>
                        <Button variant="ghost" size="sm" onClick={() => setActiveTab('ads')}>Voir tout</Button>
                    </div>

                    {loadingAds ? (
                        <div className="p-8 flex justify-center">
                            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                        </div>
                    ) : userAds.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {userAds.map((ad) => (
                                <div key={ad.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                                    <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 relative">
                                        {ad.images && ad.images[0] ? (
                                            <Image
                                                src={ad.images[0]}
                                                alt={ad.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <Package size={24} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{ad.title}</h3>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Clock size={12} />
                                                {new Date(ad.created_at).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Eye size={12} />
                                                {ad.views || 0} vues
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${ad.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                ad.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {ad.status === 'approved' ? 'Active' :
                                                ad.status === 'rejected' ? 'Refusée' : 'En attente'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <Package size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-1">Aucune annonce récente</h3>
                            <p className="text-gray-500 mb-6">Vous n'avez pas encore publié d'annonce.</p>
                            <Link href="/publier">
                                <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                                    Commencer à vendre
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Small Ad Banner */}
                <AdBanner variant="small" />
            </div>
        </div>
    )
}
