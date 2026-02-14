'use client'

import Link from 'next/link'
import { Search, Menu, X, User, PlusCircle, LogOut, Settings, LayoutDashboard, ChevronDown } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import type { User as SupabaseUser } from '@supabase/supabase-js'

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [user, setUser] = useState<SupabaseUser | null>(null)
    const [loading, setLoading] = useState(true)
    const profileRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const supabase = createClient()

    // Fetch user session on mount and listen for auth changes
    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            setLoading(false)
        }
        getUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    // Close profile dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        setUser(null)
        setIsProfileOpen(false)
        setIsMenuOpen(false)
        router.push('/')
        router.refresh()
    }

    const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Utilisateur'
    const userInitial = userName.charAt(0).toUpperCase()
    const isAuthenticated = !!user

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">G</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">Green Ads</span>
                    </Link>

                    {/* Desktop Search */}
                    <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
                        <input
                            type="text"
                            placeholder="Que recherchez-vous ?"
                            className="w-full h-10 pl-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600">
                            <Search size={20} />
                        </button>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link href="/recherche" className="text-gray-600 hover:text-green-600 font-medium">
                            Annonces
                        </Link>
                        <Button asChild className="gap-2 bg-orange-500 hover:bg-orange-600 text-white border-none">
                            <Link href="/publier">
                                <PlusCircle size={18} />
                                Publier une annonce
                            </Link>
                        </Button>

                        {loading ? (
                            <div className="w-9 h-9 rounded-full bg-gray-100 animate-pulse" />
                        ) : isAuthenticated ? (
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors border border-gray-200"
                                >
                                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                        {userInitial}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate hidden lg:block">
                                        {userName}
                                    </span>
                                    <ChevronDown size={14} className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Profile Dropdown */}
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="font-semibold text-gray-900 text-sm truncate">{userName}</p>
                                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                        </div>
                                        <div className="py-1">
                                            <Link
                                                href="/tableau-de-bord"
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <LayoutDashboard size={16} />
                                                Tableau de bord
                                            </Link>
                                            <Link
                                                href="/parametres"
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <Settings size={16} />
                                                Paramètres
                                            </Link>
                                        </div>
                                        <div className="border-t border-gray-100 pt-1">
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                                            >
                                                <LogOut size={16} />
                                                Se déconnecter
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/connexion">
                                    <Button variant="ghost">Se connecter</Button>
                                </Link>
                                <Link href="/inscription">
                                    <Button variant="outline">S'inscrire</Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-gray-600"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Search */}
                <div className="md:hidden pb-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Que recherchez-vous ?"
                            className="w-full h-10 pl-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:border-green-500"
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <Search size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white">
                    <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                        {isAuthenticated && (
                            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                                    {userInitial}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm">{userName}</p>
                                    <p className="text-xs text-gray-500">{user?.email}</p>
                                </div>
                            </div>
                        )}

                        <Button asChild className="w-full gap-2 bg-orange-500 hover:bg-orange-600 text-white">
                            <Link href="/publier" onClick={() => setIsMenuOpen(false)}>
                                <PlusCircle size={18} />
                                Publier une annonce
                            </Link>
                        </Button>
                        <div className="h-px bg-gray-100 my-2" />
                        <Link href="/recherche" className="text-gray-600 py-2" onClick={() => setIsMenuOpen(false)}>
                            Annonces
                        </Link>
                        <Link href="/categories" className="text-gray-600 py-2" onClick={() => setIsMenuOpen(false)}>
                            Catégories
                        </Link>
                        <div className="h-px bg-gray-100 my-2" />
                        {isAuthenticated ? (
                            <>
                                <Link href="/tableau-de-bord" className="flex items-center gap-3 text-gray-600 py-2" onClick={() => setIsMenuOpen(false)}>
                                    <LayoutDashboard size={18} />
                                    Tableau de bord
                                </Link>
                                <Link href="/parametres" className="flex items-center gap-3 text-gray-600 py-2" onClick={() => setIsMenuOpen(false)}>
                                    <Settings size={18} />
                                    Paramètres
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 text-red-600 py-2"
                                >
                                    <LogOut size={18} />
                                    Se déconnecter
                                </button>
                            </>
                        ) : (
                            <>
                                <Button asChild variant="ghost" className="w-full justify-start">
                                    <Link href="/connexion" onClick={() => setIsMenuOpen(false)}>
                                        Se connecter
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" className="w-full justify-start">
                                    <Link href="/inscription" onClick={() => setIsMenuOpen(false)}>
                                        S'inscrire
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}
