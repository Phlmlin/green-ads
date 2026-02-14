'use client'

import { LayoutDashboard, Users, FileText, Megaphone, CreditCard, BarChart2, LifeBuoy, LogOut } from 'lucide-react'

interface AdminSidebarProps {
    user: any
    activeTab: string
    setActiveTab: (tab: string) => void
    handleLogout: () => void
}

export function AdminSidebar({ user, activeTab, setActiveTab, handleLogout }: AdminSidebarProps) {
    const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Admin'
    const userEmail = user?.email || ''
    const userInitial = userName.charAt(0).toUpperCase()

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'users', label: 'utilisateurs', icon: Users },
        { id: 'ads', label: 'Annonces', icon: FileText },
        { id: 'banners', label: 'Publicités', icon: Megaphone },
        { id: 'subscriptions', label: 'Abonnements', icon: CreditCard },
        { id: 'stats', label: 'Statistiques', icon: BarChart2 },
        { id: 'support', label: 'Support', icon: LifeBuoy },
    ]

    return (
        <aside className="md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-2xl mb-4">
                        {userInitial}
                    </div>
                    <h2 className="font-bold text-gray-900">{userName}</h2>
                    <p className="text-sm text-gray-500">{userEmail}</p>
                    <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full mt-2 font-medium">
                        Super Admin
                    </span>
                </div>

                <nav className="p-2 space-y-1">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeTab === item.id
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <item.icon size={18} />
                            <span className="capitalize">{item.label}</span>
                        </button>
                    ))}
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
    )
}
