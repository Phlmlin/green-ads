import { Button } from '@/components/ui/button'
import { CategoryCard } from '@/components/ui/category-card'
import { AdCard } from '@/components/ui/ad-card'
import { Search, MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { AdBanner } from '@/components/ui/ad-banner'
import { createClient } from '@/utils/supabase/server'
import { CATEGORIES } from '@/lib/constants'
// Import SearchBar
import { SearchBar } from '@/components/ui/search-bar'

export default async function HomePage() {
    const supabase = createClient()

    // 1. Fetch Ad Counts per Category
    // We can't do a direct GROUP BY with count easily with the JS client without rpc or getting all data.
    // For small scale, we can just fetch all ads with only category field.
    // Optimally we would use a rpc function or a view.
    // Let's try to get all ads and count in JS for now (limit 1000 or so).
    const { data: adsForCount } = await supabase
        .from('ads')
        .select('category_id, status')
        .eq('status', 'approved') // Only count approved ads ideally, but for now 'pending' or whatever status is used. User said "published".
    // Schema has 'status' default 'pending'. 'approved' is likely the target.
    // But since I just created the insert with 'pending', I should probably count 'pending' too for the demo to show results immediately?
    // User said "Réel". If I publish and it's pending, showing 0 might look broken.
    // I'll count all non-rejected/expired ads for now or just 'pending'/'approved'.
    // Actually, let's just count all for this demo phase.

    // Map category names to slugs or IDs. The insertion used category NAME as category_id (temporarily).
    // So I will count by that.

    const counts: Record<string, number> = {}

    // Initialize 0
    CATEGORIES.forEach(c => counts[c.name] = 0)

    if (adsForCount) {
        adsForCount.forEach((ad: any) => {
            // ad.category_id holds the name in my previous implementation
            if (counts[ad.category_id] !== undefined) {
                counts[ad.category_id]++
            }
        })
    }

    // 2. Fetch Recent Ads
    const { data: recentAds } = await supabase
        .from('ads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(8)

    // Map DB ads to UI format
    const ads = recentAds?.map(ad => ({
        id: ad.id,
        title: ad.title,
        price: ad.price,
        currency: ad.currency || 'F CFA',
        location: ad.location,
        imageUrl: ad.images?.[0] || 'https://via.placeholder.com/400x300?text=Pas+d+image', // Fallback
        category: ad.category_id, // stored as name
        createdAt: new Date(ad.created_at).toLocaleDateString('fr-FR'),
        isFeatured: ad.plan === 'alaune',
        isPremium: ad.plan === 'premium'
    })) || []


    return (
        <div className="flex flex-col gap-8 pb-12">
            {/* Hero Section */}
            <section className="relative bg-green-900 py-16 md:py-24">
                {/* Background Overlay */}
                <div className="absolute inset-0 z-0 opacity-20">
                    <Image
                        src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=2000"
                        alt="Background"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center text-white">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">
                        Achetez et vendez près de chez vous
                    </h1>
                    <p className="text-lg md:text-xl mb-8 text-green-100 max-w-2xl mx-auto">
                        La première plateforme de petites annonces au Gabon. Trouvez des bonnes affaires ou vendez ce que vous n'utilisez plus.
                    </p>

                    {/* Main Search Bar */}
                    <div className="z-20 relative">
                        <SearchBar />
                    </div>

                    {/* Popular Searches */}
                    <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm text-green-100/80">
                        <span>Recherches populaires :</span>
                        <Link href="#" className="hover:text-white underline">iPhone 14</Link>
                        <Link href="#" className="hover:text-white underline">Toyota Yaris</Link>
                        <Link href="#" className="hover:text-white underline">Studio Akanda</Link>
                        <Link href="#" className="hover:text-white underline">PS5</Link>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Parcourir par catégorie</h2>
                    <Link href="/categories" className="text-green-600 font-medium hover:underline hidden md:block">
                        Voir toutes les catégories
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
                    {CATEGORIES.map((cat) => (
                        <CategoryCard
                            key={cat.slug}
                            name={cat.name}
                            slug={cat.slug}
                            iconName={cat.icon}
                            count={counts[cat.name] || 0} // Using real dynamic count
                        />
                    ))}
                </div>
            </section>

            {/* Ad Banner */}
            <section className="container mx-auto px-4">
                <AdBanner variant="horizontal" />
            </section>

            {/* Recent Ads */}
            <section className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Dernières annonces</h2>
                    <Link href="/recherche" className="text-green-600 font-medium hover:underline">
                        Voir tout
                    </Link>
                </div>

                {ads.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {ads.map((ad, index) => (
                            <div key={ad.id} className="contents">
                                <AdCard
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

                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                        <p className="text-gray-500 mb-4">Aucune annonce publiée pour le moment.</p>
                        <Link href="/publier">
                            <Button>Soyez le premier à publier !</Button>
                        </Link>
                    </div>
                )}

                <div className="hidden lg:block mt-8">
                    <AdBanner variant="horizontal" />
                </div>

                <div className="mt-10 text-center">
                    <Link href="/recherche">
                        <Button variant="outline" size="lg" className="border-green-600 text-green-600 hover:bg-green-50">
                            Charger plus d'annonces
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Mobile App Banner */}
            <section className="container mx-auto px-4 mt-8">
                <div className="bg-green-50 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
                    <div className="md:w-1/2 mb-8 md:mb-0">
                        <h2 className="text-3xl font-bold text-green-900 mb-4">
                            Vendez plus vite avec Green Ads
                        </h2>
                        <ul className="space-y-3 mb-8">
                            <li className="flex items-center gap-2 text-green-800">
                                <div className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center text-green-700">✓</div>
                                Publication gratuite en 2 minutes
                            </li>
                            <li className="flex items-center gap-2 text-green-800">
                                <div className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center text-green-700">✓</div>
                                Visibilité auprès de milliers d'acheteurs
                            </li>
                            <li className="flex items-center gap-2 text-green-800">
                                <div className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center text-green-700">✓</div>
                                Messagerie sécurisée intégrée
                            </li>
                        </ul>
                        <Link href="/publier">
                            <Button size="lg" className="bg-green-600 text-white hover:bg-green-700">
                                Publier une annonce maintenant
                            </Button>
                        </Link>
                    </div>
                    <div className="md:w-1/2 relative h-64 w-full bg-gray-200 rounded-xl overflow-hidden">
                        <Image
                            src="https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=1000"
                            alt="Happy seller"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </section>
        </div>
    )
}
