'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Loader2 } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                throw error
            }

            router.push('/tableau-de-bord')
            router.refresh()
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue lors de la connexion')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h1 className="text-center font-serif text-3xl font-bold tracking-tight text-[#142230]">Bon retour</h1>
            <p className="mb-8 mt-2 text-center text-sm leading-6 text-[#687582]">Connectez-vous pour gérer vos annonces et suivre vos ventes.</p>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-6 border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700" htmlFor="email">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            id="email"
                            type="email"
                            required
                            className="h-12 w-full rounded-xl border border-[#ded9d0] bg-[#fffdf9] pl-10 pr-3 text-sm outline-none transition-all placeholder:text-[#a4aaa9] focus:border-[#f26b4f] focus:ring-4 focus:ring-[#f26b4f]/10"
                            placeholder="votre@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between">
                        <label className="text-sm font-medium text-gray-700" htmlFor="password">Mot de passe</label>
                        <Link href="/mot-de-passe-oublie" className="text-sm font-medium text-[#d6533c] hover:underline">
                            Oublié ?
                        </Link>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            id="password"
                            type="password"
                            required
                            className="h-12 w-full rounded-xl border border-[#ded9d0] bg-[#fffdf9] pl-10 pr-3 text-sm outline-none transition-all placeholder:text-[#a4aaa9] focus:border-[#f26b4f] focus:ring-4 focus:ring-[#f26b4f]/10"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <Button type="submit" className="h-12 w-full rounded-xl bg-[#f26b4f] font-semibold text-[#fffaf4] shadow-[0_10px_24px_rgba(242,107,79,0.24)] hover:bg-[#db5840]" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Connexion...
                        </>
                    ) : (
                        'Se connecter'
                    )}
                </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
                Pas encore de compte ?{' '}
                <Link href="/inscription" className="font-medium text-[#d6533c] hover:underline">
                    Créer un compte
                </Link>
            </div>
        </div>
    )
}
