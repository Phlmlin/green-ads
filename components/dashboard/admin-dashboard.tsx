'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Check, Ban, Upload, Image as ImageIcon, Trash2, X } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { AdminSidebar } from './admin-sidebar'

interface AdminDashboardProps {
    user: any
}

export function AdminDashboard({ user }: AdminDashboardProps) {
    const [activeTab, setActiveTab] = useState('dashboard')
    const [pendingAds, setPendingAds] = useState<any[]>([])
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        fetchPendingAds()
    }, [])

    const fetchPendingAds = async () => {
        const { data, error } = await supabase
            .from('ads')
            .select('*')
            .eq('status', 'pending')
            .order('created_at', { ascending: false })

        if (data) {
            setPendingAds(data)
        }
    }

    const handleUpdateAdStatus = async (adId: string, newStatus: 'approved' | 'rejected') => {
        const { error } = await supabase
            .from('ads')
            .update({ status: newStatus })
            .eq('id', adId)

        if (!error) {
            // Update local state by removing the processed ad
            setPendingAds(pendingAds.filter(ad => ad.id !== adId))
            router.refresh()
        }
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/connexion')
        router.refresh()
    }

    const renderDashboardContent = () => (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Marketplace Manager</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pending Ads Widget */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        Annonces en attente ({pendingAds.length})
                    </h2>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto">
                        {pendingAds.length > 0 ? (
                            pendingAds.map((ad) => (
                                <div key={ad.id} className="border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-sm">{ad.title}</h3>
                                            <p className="text-xs text-gray-500">{ad.category} • {ad.location}</p>
                                            <p className="text-xs font-medium text-green-700 mt-1">{ad.price} {ad.currency}</p>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button
                                                size="icon"
                                                className="h-8 w-8 bg-green-100 text-green-700 hover:bg-green-200"
                                                onClick={() => handleUpdateAdStatus(ad.id, 'approved')}
                                            >
                                                <Check size={14} />
                                            </Button>
                                            <Button
                                                size="icon"
                                                className="h-8 w-8 bg-red-100 text-red-700 hover:bg-red-200"
                                                onClick={() => handleUpdateAdStatus(ad.id, 'rejected')}
                                            >
                                                <Ban size={14} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 text-center py-4">Aucune annonce en attente.</p>
                        )}
                    </div>
                    {pendingAds.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                            <button
                                onClick={() => setActiveTab('ads')}
                                className="text-sm text-blue-600 hover:underline font-medium"
                            >
                                Voir toutes les annonces
                            </button>
                        </div>
                    )}
                </div>

                {/* Banner Management Widget */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            Gestion des Publicités
                        </h2>
                    </div>

                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer mb-6">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Upload size={20} />
                        </div>
                        <p className="text-sm font-medium text-gray-900">Ajouter une nouvelle bannière</p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG ou GIF (max. 5MB)</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                    {/* Placeholder for banner preview */}
                                    <div className="w-full h-full bg-gradient-to-r from-purple-500 to-indigo-500"></div>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Promo Automne 2023</p>
                                    <p className="text-xs text-green-600 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                        Active • Accueil top
                                    </p>
                                </div>
                            </div>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-red-500">
                                <Trash2 size={14} />
                            </Button>
                        </div>

                        <div className="bg-blue-50 p-3 rounded-md">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-blue-700 font-medium">Statut Actuel</span>
                                <span className="text-blue-700">75%</span>
                            </div>
                            <div className="w-full bg-blue-100 rounded-full h-1.5">
                                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                            </div>
                            <p className="text-xs text-blue-600 mt-1">Quota de bannières utilisé</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    const renderActiveTabContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return renderDashboardContent()
            case 'users':
                return <div className="p-8 text-center text-gray-500">Gestion des utilisateurs (Bientôt disponible)</div>
            case 'ads':
                return <div className="p-8 text-center text-gray-500">Gestion complète des annonces (Bientôt disponible)</div>
            case 'banners':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-900">Gestion de l'inventaire publicitaire</h1>
                            <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                                <Upload size={18} /> Créer une campagne
                            </Button>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900">Campagnes actives</h2>
                                <p className="text-sm text-gray-500">Gérez vos emplacements publicitaires et suivez les performances.</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-gray-900 font-semibold border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4">Campagne</th>
                                            <th className="px-6 py-4">Client</th>
                                            <th className="px-6 py-4">Statut</th>
                                            <th className="px-6 py-4">Affichages</th>
                                            <th className="px-6 py-4">Clics</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {/* Mock Data for now */}
                                        <tr className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">Promo Automne 2023</td>
                                            <td className="px-6 py-4 text-gray-500">Orange CI</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                    Active
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">12,450</td>
                                            <td className="px-6 py-4 text-gray-500">845</td>
                                            <td className="px-6 py-4 text-right">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-red-500">
                                                    <Trash2 size={16} />
                                                </Button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">Black Friday</td>
                                            <td className="px-6 py-4 text-gray-500">Jumia</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>
                                                    Programmée
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">-</td>
                                            <td className="px-6 py-4 text-gray-500">-</td>
                                            <td className="px-6 py-4 text-right">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-red-500">
                                                    <Trash2 size={16} />
                                                </Button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-4 border-t border-gray-100 text-center text-sm text-gray-500">
                                Affichage de 1 à 2 sur 2 résultats
                            </div>
                        </div>
                    </div>
                )
            default:
                return <div className="p-8 text-center text-gray-500">Module en construction</div>
        }
    }

    return (
        <div className="flex flex-col md:flex-row gap-8">
            <AdminSidebar
                user={user}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                handleLogout={handleLogout}
            />
            <div className="flex-1">
                {renderActiveTabContent()}
            </div>
        </div>
    )
}
