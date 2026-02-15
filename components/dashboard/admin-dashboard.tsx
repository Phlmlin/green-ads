'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Check, Ban, Upload, Image as ImageIcon, Trash2, X, Plus, Settings, CreditCard, BarChart3, TrendingUp, ShoppingBag, Activity } from 'lucide-react'
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
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h1>
                            <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                                <Plus size={18} /> Ajouter un utilisateur
                            </Button>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900">Comptes enregistrés</h2>
                                <p className="text-sm text-gray-500">Gérez les accès et les rôles des utilisateurs de la plateforme.</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-gray-900 font-semibold border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4">Utilisateur</th>
                                            <th className="px-6 py-4">Rôle</th>
                                            <th className="px-6 py-4">Statut</th>
                                            <th className="px-6 py-4">Inscription</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {/* Mock Data for now */}
                                        <tr className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">M</div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">Maman</p>
                                                        <p className="text-xs text-gray-500">maman@greenads.com</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-700">Admin</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                    Active
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">14 fév. 2026</td>
                                            <td className="px-6 py-4 text-right">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400">
                                                    <Settings size={16} />
                                                </Button>
                                            </td>
                                        </tr>
                                        <tr className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center font-bold">J</div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">Jean Dupont</p>
                                                        <p className="text-xs text-gray-500">jean.dupont@email.com</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700">Utilisateur</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                    Active
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">10 fév. 2026</td>
                                            <td className="px-6 py-4 text-right">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400">
                                                    <Settings size={16} />
                                                </Button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )
            case 'ads':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-900">Inventaire des annonces</h1>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-gray-900">Toutes les annonces</h2>
                                <p className="text-sm text-gray-500">Surveillez et modérez l'ensemble des annonces publiées sur la plateforme.</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-gray-900 font-semibold border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4">Annonce</th>
                                            <th className="px-6 py-4">Vendeur</th>
                                            <th className="px-6 py-4">Prix</th>
                                            <th className="px-6 py-4">Statut</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {/* Mock Data for now */}
                                        <tr className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-gray-900">Toyota Camry 2018</p>
                                                <p className="text-xs text-gray-500">Véhicules</p>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">Jean-Marc Ondou</td>
                                            <td className="px-6 py-4 font-medium">8,500,000 F CFA</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Approuvée</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400">
                                                    <Ban size={16} />
                                                </Button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )
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
            case 'subscription':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-900">Gestion des abonnements</h1>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { name: 'Gratuit', price: '0 F CFA', ads: '5 Annonces', color: 'bg-gray-100' },
                                { name: 'Premium', price: '5,000 F CFA', ads: '10 Annonces', color: 'bg-green-100' },
                                { name: 'À la une', price: '10,000 F CFA', ads: '15 Annonces', color: 'bg-blue-100' }
                            ].map((plan) => (
                                <div key={plan.name} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                    <div className={`w-12 h-12 ${plan.color} rounded-lg flex items-center justify-center mb-4`}>
                                        <CreditCard size={24} className="text-gray-700" />
                                    </div>
                                    <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                                    <p className="text-2xl font-bold text-gray-900 mb-4">{plan.price}</p>
                                    <ul className="text-sm text-gray-500 space-y-2 mb-6">
                                        <li>• {plan.ads}</li>
                                        <li>• Durée: 30-90 jours</li>
                                        <li>• Visibilité standard</li>
                                    </ul>
                                    <Button variant="outline" className="w-full">Modifier les tarifs</Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            case 'stats':
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-900">Statistiques de la plateforme</h1>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="bg-white">Les 7 derniers jours</Button>
                                <Button variant="outline" size="sm" className="bg-white">Rapport PDF</Button>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { title: 'Revenu Total', value: '450,000 F CFA', change: '+12%', icon: CreditCard, color: 'text-green-600', bg: 'bg-green-50' },
                                { title: 'Nouveaux Utilisateurs', value: '124', change: '+18%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                                { title: 'Annonces Publiées', value: '1,542', change: '+5%', icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-50' },
                                { title: 'Taux de Conversion', value: '3.2%', change: '-1%', icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50' }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                                            <stat.icon size={20} />
                                        </div>
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {stat.change}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                                    <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Distribution by Category */}
                            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <BarChart3 size={20} className="text-gray-400" />
                                    Performance par Catégorie
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { cat: 'Véhicules', count: 450, percent: 75, color: 'bg-blue-500' },
                                        { cat: 'Immobilier', count: 320, percent: 55, color: 'bg-green-500' },
                                        { cat: 'Électronique', count: 280, percent: 45, color: 'bg-purple-500' },
                                        { cat: 'Mode', count: 180, percent: 30, color: 'bg-amber-500' }
                                    ].map((cat, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-medium text-gray-700">{cat.cat}</span>
                                                <span className="text-gray-500">{cat.count} annonces</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-2">
                                                <div className={`${cat.color} h-2 rounded-full`} style={{ width: `${cat.percent}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <TrendingUp size={20} className="text-gray-400" />
                                    Activité Récente
                                </h3>
                                <div className="space-y-6">
                                    {[
                                        { user: 'Admin', action: 'Prix "Premium" modifié', time: 'Il y a 2h' },
                                        { user: 'Système', action: 'Vérification bannières', time: 'Il y a 5h' },
                                        { user: 'Admin', action: 'Nouvelle catégorie: Art', time: 'Hier' },
                                        { user: 'Système', action: 'Backup de la base', time: 'Hier' }
                                    ].map((act, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="w-1 h-10 bg-gray-100 rounded-full flex-shrink-0 relative">
                                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-500"></div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{act.action}</p>
                                                <p className="text-xs text-gray-500">{act.user} • {act.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
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
