'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ImageGallery } from '@/components/ui/image-gallery'
import { AdCard } from '@/components/ui/ad-card'
import { MapPin, Clock, Share2, Flag, User, Phone, MessageCircle, Heart, ShieldCheck, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { AdBanner } from '@/components/ui/ad-banner'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

interface AdDetailProps {
    params: { id: string }
}

export default function AdDetailPage({ params }: AdDetailProps) {
    const [ad, setAd] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [similarAds, setSimilarAds] = useState<any[]>([])
    const [showPhone, setShowPhone] = useState(false)
    const [currentUser, setCurrentUser] = useState<any>(null)

    const supabase = createClient()
    const router = useRouter()
    const { id } = params

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            setError(null)
            try {
                // 1. Get Current User (for Message button logic)
                const { data: { user } } = await supabase.auth.getUser()
                setCurrentUser(user)

                // 2. Fetch Ad Details
                const { data: adData, error: adError } = await supabase
                    .from('ads')
                    .select(`
                        *,
                        seller:users(id, full_name, created_at, phone, avatar_url, role),
                        category:categories(id, name, slug)
                    `)
                    .eq('id', id)
                    .single()

                if (adError) throw adError
                if (!adData) throw new Error("Annonce introuvable")

                setAd(adData)

                // 3. Fetch Similar Ads
                if (adData.category_id) {
                    const { data: similarData } = await supabase
                        .from('ads')
                        .select('*, category:categories(name)')
                        .eq('category_id', adData.category_id)
                        .neq('id', id) // Exclude current ad
                        .eq('status', 'approved')
                        .limit(4)

                    if (similarData) {
                        setSimilarAds(similarData)
                    }
                }

                // Increment view count (fire and forget)
                void supabase.rpc('increment_ad_view', { ad_id: id }).then(({ error }) => {
                    if (error) {
                        // Fallback if RPC doesn't exist yet, try direct update
                        // But direct update might be restricted by RLS if not owner.
                        // We'll skip for now or implement RPC later.
                    }
                })

            } catch (err: any) {
                console.error("Error fetching ad details:", err)
                setError(err.message || "Une erreur est survenue lors du chargement de l'annonce.")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [id, supabase])

    const handleMessageClick = () => {
        if (!currentUser) {
            router.push(`/connexion?redirect=/annonce/${id}`)
            return
        }
        // Redirect to messages with context
        router.push(`/messages?ad_id=${id}&seller_id=${ad.user_id}`)
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 animate-spin text-green-600" />
            </div>
        )
    }

    if (error || !ad) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <AlertCircle size={64} className="text-red-500 mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Annonce introuvable</h1>
                <p className="text-gray-500 mb-6">{error || "Cette annonce n'existe plus ou a été supprimée."}</p>
                <Link href="/recherche">
                    <Button>Retour aux annonces</Button>
                </Link>
            </div>
        )
    }

    const formattedPrice = new Intl.NumberFormat('fr-GA', {
        style: 'currency',
        currency: 'XAF',
        maximumFractionDigits: 0,
    }).format(ad.price).replace('XAF', 'F CFA')

    const sellerName = ad.seller?.full_name || 'Utilisateur Green Ads'
    const sellerJoined = ad.seller?.created_at
        ? `Membre depuis ${new Date(ad.seller.created_at).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}`
        : 'Membre récent'

    // Format Custom Data for display
    const renderCustomData = () => {
        if (!ad.custom_data || Object.keys(ad.custom_data).length === 0) return null

        const entries = Object.entries(ad.custom_data).filter(([_, v]) => v) // Filter empty values
        if (entries.length === 0) return null

        return (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">Caractéristiques</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    {entries.map(([key, value]: [string, any]) => (
                        <div key={key} className="flex flex-col border-b border-gray-50 pb-2 last:border-0">
                            <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span className="font-medium text-gray-900">{value}</span>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-500 mb-6 flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-2">
                <Link href="/" className="hover:text-green-600">Accueil</Link>
                <span>/</span>
                <Link href={`/recherche?category=${ad.category?.slug || ''}`} className="hover:text-green-600">
                    {ad.category?.name || 'Catégorie'}
                </Link>
                <span>/</span>
                <span className="text-gray-900 font-medium truncate max-w-xs">{ad.title}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <ImageGallery images={ad.images || []} title={ad.title} />

                    {/* Title & Info Mobile (Top on mobile) */}
                    <div className="lg:hidden bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{ad.title}</h1>
                        <p className="text-2xl font-bold text-green-700 mb-4">{formattedPrice}</p>
                        <div className="flex flex-col gap-2 text-gray-600 text-sm">
                            <div className="flex items-center gap-2">
                                <MapPin size={16} />
                                {ad.location}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={16} />
                                Publié le {new Date(ad.created_at).toLocaleDateString('fr-FR')}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">Description</h2>
                        <div className="prose prose-green max-w-none text-gray-700 whitespace-pre-line">
                            {ad.description}
                        </div>
                    </div>

                    {/* Custom Data */}
                    {renderCustomData()}

                    {/* Ad Banner */}
                    <AdBanner variant="horizontal" />

                    {/* Safety Tips */}
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                        <h3 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                            <ShieldCheck size={18} />
                            Conseils de sécurité
                        </h3>
                        <ul className="text-sm text-orange-700 space-y-1 list-disc pl-5">
                            <li>Ne payez jamais avant d'avoir vu le produit.</li>
                            <li>Rencontrez le vendeur dans un lieu public.</li>
                            <li>Méfiez-vous des offres trop alléchantes.</li>
                            <li>Vérifiez soigneusement l'article avant l'achat.</li>
                        </ul>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Price Card (Desktop) */}
                    <div className="hidden lg:block bg-white p-6 rounded-lg shadow-sm border border-gray-100 sticky top-24">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">{ad.title}</h1>
                        <p className="text-3xl font-bold text-green-700 mb-6">{formattedPrice}</p>

                        <div className="flex flex-col gap-3 text-gray-600 mb-6">
                            <div className="flex items-center gap-2">
                                <MapPin size={18} className="text-gray-400" />
                                {ad.location}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={18} className="text-gray-400" />
                                Publié le {new Date(ad.created_at).toLocaleDateString('fr-FR')}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                className="flex-1 gap-2 bg-green-600 hover:bg-green-700"
                                size="lg"
                                onClick={handleMessageClick}
                            >
                                <MessageCircle size={18} />
                                Message
                            </Button>
                            <Button variant="outline" size="icon" className="shrink-0 text-gray-500 hover:text-red-500 hover:border-red-200">
                                <Heart size={20} />
                            </Button>
                        </div>
                    </div>

                    {/* Seller Profile */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h2 className="font-bold text-gray-900 mb-4">Vendu par</h2>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 overflow-hidden relative">
                                {ad.seller?.avatar_url ? (
                                    <img src={ad.seller.avatar_url} alt={sellerName} className="object-cover w-full h-full" />
                                ) : (
                                    <User size={32} />
                                )}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 hover:text-green-700 cursor-pointer">
                                    {sellerName}
                                </p>
                                <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                                    <ShieldCheck size={12} />
                                    <span>Identité vérifiée</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{sellerJoined}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {showPhone ? (
                                <div className="p-3 bg-green-50 border border-green-200 rounded-md text-center">
                                    <p className="text-sm text-gray-500 mb-1">Numéro de téléphone</p>
                                    <a href={`tel:${ad.seller?.phone}`} className="text-lg font-bold text-green-700 hover:underline">
                                        {ad.seller?.phone || "Non renseigné"}
                                    </a>
                                </div>
                            ) : (
                                <Button
                                    variant="outline"
                                    className="w-full gap-2 border-green-200 text-green-700 hover:bg-green-50"
                                    onClick={() => setShowPhone(true)}
                                >
                                    <Phone size={18} />
                                    Afficher le numéro
                                </Button>
                            )}

                            <Button
                                className="w-full gap-2 lg:hidden bg-green-600 hover:bg-green-700"
                                onClick={handleMessageClick}
                            >
                                <MessageCircle size={18} />
                                Envoyer un message
                            </Button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 justify-center">
                        <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900">
                            <Share2 size={16} /> Partager
                        </button>
                        <span className="text-gray-300">|</span>
                        <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600">
                            <Flag size={16} /> Signaler
                        </button>
                    </div>
                </div>
            </div>

            {/* Similar Ads */}
            {similarAds.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Annonces similaires</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {similarAds.map((sad) => (
                            <AdCard
                                key={sad.id}
                                id={sad.id}
                                title={sad.title}
                                price={sad.price}
                                currency={sad.currency}
                                location={sad.location}
                                imageUrl={sad.images?.[0]}
                                category={sad.category?.name || 'Autre'}
                                createdAt={new Date(sad.created_at).toLocaleDateString('fr-FR')}
                                isPremium={sad.plan === 'premium'}
                                isFeatured={sad.plan === 'featured'}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
