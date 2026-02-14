'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, Phone, Loader2, CheckCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas')
            setLoading(false)
            return
        }

        try {
            const { error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        full_name: formData.fullName,
                        phone: formData.phone
                    },
                    emailRedirectTo: `${location.origin}/auth/callback`
                }
            })

            if (error) {
                throw error
            }

            setSuccess(true)
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue lors de l\'inscription')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                    <CheckCircle size={32} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Vérifiez votre email</h1>
                <p className="text-gray-600 mb-6">
                    Un lien de confirmation a été envoyé à <strong>{formData.email}</strong>.<br />
                    Veuillez cliquer dessus pour activer votre compte.
                </p>
                <Link href="/connexion">
                    <Button variant="outline" className="w-full">Retour à la connexion</Button>
                </Link>
            </div>
        )
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Créer un compte</h1>
            <p className="text-center text-gray-500 mb-8">Rejoignez la communauté Green Ads</p>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-6 border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700" htmlFor="fullName">Nom complet</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            id="fullName"
                            type="text"
                            required
                            className="w-full h-10 pl-10 pr-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            placeholder="Jean Dupont"
                            value={formData.fullName}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700" htmlFor="email">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            id="email"
                            type="email"
                            required
                            className="w-full h-10 pl-10 pr-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            placeholder="votre@email.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700" htmlFor="phone">Téléphone</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            id="phone"
                            type="tel"
                            className="w-full h-10 pl-10 pr-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            placeholder="074 00 00 00"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700" htmlFor="password">Mot de passe</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            id="password"
                            type="password"
                            required
                            minLength={6}
                            className="w-full h-10 pl-10 pr-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700" htmlFor="confirmPassword">Confirmer Mot de passe</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            id="confirmPassword"
                            type="password"
                            required
                            minLength={6}
                            className="w-full h-10 pl-10 pr-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <input type="checkbox" id="terms" required className="rounded text-green-600 focus:ring-green-500" />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                        J'accepte les <Link href="/conditions" className="text-green-600 hover:underline">conditions d'utilisation</Link>
                    </label>
                </div>

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Création en cours...
                        </>
                    ) : (
                        'S\'inscrire'
                    )}
                </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
                Déjà un compte ?{' '}
                <Link href="/connexion" className="text-green-600 font-medium hover:underline">
                    Se connecter
                </Link>
            </div>
        </div>
    )
}
