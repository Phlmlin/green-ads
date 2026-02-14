import { CATEGORIES } from '@/lib/constants'
import { AdCard } from '@/components/ui/ad-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, PackageX } from 'lucide-react'
import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function CategoryPage({ params }: { params: { slug: string } }) {
    const category = CATEGORIES.find(c => c.slug === params.slug)

    if (!category) {
        notFound()
    }

    const supabase = createClient()

    // Fetch real ads for this category
    const { data: adsData, error } = await supabase
        .from('ads')
        .select('*')
        .eq('category_id', params.slug) // We stored slug in category_id
        .order('created_at', { ascending: false })

    const ads = adsData?.map(ad => ({
        id: ad.id,
        title: ad.title,
        price: ad.price,
        currency: ad.currency || 'F CFA',
        location: ad.location,
        imageUrl: ad.images?.[0] || 'https://via.placeholder.com/400x300?text=Pas+d+image',
        category: category.name,
        createdAt: new Date(ad.created_at).toLocaleDateString('fr-FR'),
        isPremium: ad.plan === 'premium',
        isFeatured: ad.plan === 'alaune',
        // We can pass custom data to display specific fields if we update AdCard later
        customData: ad.custom_data
    })) || []

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <Link href="/" className="hover:text-green-600">Accueil</Link>
                <span>/</span>
                <Link href="/categories" className="hover:text-green-600">Catégories</Link>
                <span>/</span>
                <span className="text-gray-900 font-medium">{category.name}</span>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{category.name}</h1>
                    <p className="text-gray-500">
                        {ads.length > 0 ? `${ads.length} annonces disponibles` : 'Aucune annonce disponible'}
                    </p>
                </div>
                <Link href="/categories">
                    <Button variant="outline" className="gap-2">
                        <ArrowLeft size={16} />
                        Toutes les catégories
                    </Button>
                </Link>
            </div>

            {/* Ads Grid */}
            {ads.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {ads.map((ad) => (
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
                            isPremium={ad.isPremium}
                            isFeatured={ad.isFeatured}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-xl border border-gray-100 text-center">
                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                        <PackageX size={48} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Aucune annonce trouvée</h3>
                    <p className="text-gray-500 max-w-md mx-auto mb-6">
                        Il n'y a pas encore d'annonces dans la catégorie <span className="font-semibold">{category.name}</span>.
                        Soyez le premier à publier !
                    </p>
                    <Link href="/publier">
                        <Button className="bg-green-600 hover:bg-green-700">
                            Publier une annonce dans {category.name}
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    )
}
