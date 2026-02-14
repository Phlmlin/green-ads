'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const supabase = createClient()

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${location.origin}/api/auth/callback?next=/tableau-de-bord/parametres`,
            })

            if (error) {
                throw error
            }

            setSuccess(true)
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue')
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
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Email envoyé</h1>
                <p className="text-gray-600 mb-6">
                    Si un compte existe avec l'adresse <strong>{email}</strong>, vous recevrez un lien de réinitialisation.
                </p>
                <Link href="/connexion">
                    <Button variant="outline" className="w-full">Retour à la connexion</Button>
                </Link>
            </div>
        )
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Mot de passe oublié ?</h1>
            <p className="text-center text-gray-500 mb-8">Entrez votre email pour recevoir un lien de réinitialisation</p>

            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-6 border border-red-100">
                    {error}
                </div>
            )}

            <form onSubmit={handleReset} className="space-y-4">
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
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Envoi en cours...
                        </>
                    ) : (
                        'Envoyer le lien'
                    )}
                </Button>
            </form>

            <div className="mt-6 text-center">
                <Link href="/connexion" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 font-medium">
                    <ArrowLeft size={16} />
                    Retour à la connexion
                </Link>
            </div>
        </div>
    )
}
