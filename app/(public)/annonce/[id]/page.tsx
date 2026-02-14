'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { ImageGallery } from '@/components/ui/image-gallery'
import { AdCard } from '@/components/ui/ad-card'
import { MapPin, Clock, Share2, Flag, User, Phone, MessageCircle, Heart, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { AdBanner } from '@/components/ui/ad-banner'

// Dummy Data for Detail Page
const AD_DATA = {
    id: '1',
    title: 'Toyota Camry 2018 - Édition Spéciale Full Option',
    price: 8500000,
    currency: 'F CFA',
    location: 'Libreville, Centre-ville',
    description: `
    À vendre Toyota Camry 2018 en parfait état.
    
    Caractéristiques :
    - Boîte automatique
    - Moteur V6
    - Climatisation bizone
    - Intérieur cuir beige
    - Toit ouvrant
    - Caméra de recul + capteurs
    - Kilométrage : 45 000 km
    
    Véhicule suivi chez le concessionnaire. Tous papiers à jour.
    Prix légèrement négociable devant le véhicule.
    Curieux s'abstenir.
  `,
    category: 'Véhicules',
    createdAt: 'Publié le 14 Fév 2026',
    views: 142,
    images: [
        'https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1000',
        'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=1000',
    ],
    seller: {
        id: 'user1',
        name: 'Jean-Marc Ondou',
        joined: 'Membre depuis Jan 2024',
        responseRate: 'Répond en moins de 1h',
        isVerified: true
    }
}

const SIMILAR_ADS = [
    {
        id: '2',
        title: 'Hyundai Tucson 2020',
        price: 11000000,
        currency: 'F CFA',
        location: 'Libreville',
        imageUrl: 'https://images.unsplash.com/photo-1629814421949-8c682337d45f?auto=format&fit=crop&q=80&w=1000',
        category: 'Véhicules',
        createdAt: 'Il y a 1j'
    },
    {
        id: '3',
        title: 'Kia Sportage 2019',
        price: 9800000,
        currency: 'F CFA',
        location: 'Akanda',
        imageUrl: 'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?auto=format&fit=crop&q=80&w=1000',
        category: 'Véhicules',
        createdAt: 'Il y a 3j'
    },
    {
        id: '4',
        title: 'Range Rover Evoque',
        price: 18500000,
        currency: 'F CFA',
        location: 'Libreville',
        imageUrl: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&q=80&w=1000',
        category: 'Véhicules',
        createdAt: 'Il y a 5j',
        isPremium: true
    }
]

export default function AdDetailPage({ params }: { params: { id: string } }) {
    // In a real app, fetch data based on params.id

    const formattedPrice = new Intl.NumberFormat('fr-GA', {
        style: 'currency',
        currency: 'XAF',
        maximumFractionDigits: 0,
    }).format(AD_DATA.price).replace('XAF', 'F CFA')

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
                <Link href="/" className="hover:text-green-600">Accueil</Link>
                <span>/</span>
                <Link href="/categories" className="hover:text-green-600">{AD_DATA.category}</Link>
                <span>/</span>
                <span className="text-gray-900 font-medium truncate max-w-xs">{AD_DATA.title}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <ImageGallery images={AD_DATA.images} title={AD_DATA.title} />

                    {/* Title & Info Mobile (Top on mobile) */}
                    <div className="lg:hidden bg-white p-4 rounded-lg shadow-sm">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{AD_DATA.title}</h1>
                        <p className="text-2xl font-bold text-green-700 mb-4">{formattedPrice}</p>
                        <div className="flex flex-col gap-2 text-gray-600 text-sm">
                            <div className="flex items-center gap-2">
                                <MapPin size={16} />
                                {AD_DATA.location}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={16} />
                                {AD_DATA.createdAt}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">Description</h2>
                        <div className="prose prose-green max-w-none text-gray-700 whitespace-pre-line">
                            {AD_DATA.description}
                        </div>
                    </div>

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
                    <div className="hidden lg:block bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">{AD_DATA.title}</h1>
                        <p className="text-3xl font-bold text-green-700 mb-6">{formattedPrice}</p>

                        <div className="flex flex-col gap-3 text-gray-600 mb-6">
                            <div className="flex items-center gap-2">
                                <MapPin size={18} className="text-gray-400" />
                                {AD_DATA.location}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={18} className="text-gray-400" />
                                {AD_DATA.createdAt}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button className="flex-1 gap-2 bg-green-600 hover:bg-green-700" size="lg">
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
                            <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                <User size={32} />
                            </div>
                            <div>
                                <Link href={`/profil/${AD_DATA.seller.id}`} className="font-semibold text-gray-900 hover:underline hover:text-green-700">
                                    {AD_DATA.seller.name}
                                </Link>
                                <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                                    {AD_DATA.seller.isVerified && <ShieldCheck size={12} />}
                                    <span>Identité vérifiée</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{AD_DATA.seller.joined}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Button variant="outline" className="w-full gap-2 border-green-200 text-green-700 hover:bg-green-50">
                                <Phone size={18} />
                                Afficher le numéro
                            </Button>
                            <Button className="w-full gap-2 lg:hidden bg-green-600 hover:bg-green-700">
                                <MessageCircle size={18} />
                                Envoyer un message
                            </Button>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-center text-gray-500">
                            Réponse habituelle : {AD_DATA.seller.responseRate}
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
            <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Annonces similaires</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {SIMILAR_ADS.map((ad) => (
                        <AdCard
                            key={ad.id}
                            id={ad.id}
                            title={ad.title}
                            price={ad.price}
                            currency={ad.currency}
                            location={ad.location}
                            imageUrl={ad.imageUrl}
                            category={ad.category}
                            createdAt={ad.createdAt}
                            isPremium={ad.isPremium || false} // Add default
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
