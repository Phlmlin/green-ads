'use client'

import { useState, useEffect, Suspense } from 'react'
import { AdCard } from '@/components/ui/ad-card'
import { Button } from '@/components/ui/button'
import { CATEGORIES, PROVINCES } from '@/lib/constants'
import { Search, MapPin, SlidersHorizontal, ArrowUpDown, Loader2, PackageX } from 'lucide-react'
import { AdBanner } from '@/components/ui/ad-banner'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { SearchBar } from '@/components/ui/search-bar'

function SearchContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const supabase = createClient()

    const [ads, setAds] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showFilters, setShowFilters] = useState(false)
    const [cities, setCities] = useState<string[]>([])

    // Parse filters from URL
    const query = searchParams.get('q') || ''
    const province = searchParams.get('province') || ''
    const city = searchParams.get('city') || ''
    const category = searchParams.get('category') || ''
    const minPrice = searchParams.get('minPrice') || ''
    const maxPrice = searchParams.get('maxPrice') || ''
    const sort = searchParams.get('sort') || 'newest' // newest, price_asc, price_desc

    // Local state for filters
    const [localFilters, setLocalFilters] = useState({
        minPrice, maxPrice, province, city, category
    })
    const [localQuery, setLocalQuery] = useState(query)

    // Update cities when province changes
    useEffect(() => {
        if (localFilters.province) {
            setCities(PROVINCES[localFilters.province] || [])
        } else {
            setCities([])
        }
    }, [localFilters.province])

    // Sync local state with URL when URL changes (e.g. back button or search bar navigation)
    useEffect(() => {
        setLocalFilters({
            minPrice: searchParams.get('minPrice') || '',
            maxPrice: searchParams.get('maxPrice') || '',
            province: searchParams.get('province') || '',
            city: searchParams.get('city') || '',
            category: searchParams.get('category') || ''
        })
        setLocalQuery(searchParams.get('q') || '')
    }, [searchParams])


    // Fetch Ads
    useEffect(() => {
        const fetchAds = async () => {
            setLoading(true)
            let dbQuery = supabase
                .from('ads')
                .select('*')
                .eq('status', 'approved')

            // Text Search
            if (query) {
                // simple ilike for now. Full text search is better but requires DB setup.
                dbQuery = dbQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`)
            }

            // Filters
            if (category) {
                dbQuery = dbQuery.eq('category_id', category) // Assuming category_id stores the slug/name as per previous steps
            }

            if (province) {
                dbQuery = dbQuery.ilike('location', `${province}%`)
            }

            if (city) {
                dbQuery = dbQuery.ilike('location', `%${city}%`)
            }

            if (minPrice) {
                dbQuery = dbQuery.gte('price', minPrice)
            }

            if (maxPrice) {
                dbQuery = dbQuery.lte('price', maxPrice)
            }

            // Sort
            if (sort === 'price_asc') {
                dbQuery = dbQuery.order('price', { ascending: true })
            } else if (sort === 'price_desc') {
                dbQuery = dbQuery.order('price', { ascending: false })
            } else {
                dbQuery = dbQuery.order('created_at', { ascending: false })
            }

            const { data, error } = await dbQuery

            if (data) {
                setAds(data.map(ad => ({
                    id: ad.id,
                    title: ad.title,
                    price: ad.price,
                    currency: ad.currency || 'F CFA',
                    location: ad.location,
                    imageUrl: ad.images?.[0] || 'https://via.placeholder.com/400x300?text=Pas+d+image',
                    category: ad.category_id,
                    createdAt: new Date(ad.created_at).toLocaleDateString('fr-FR'),
                    isPremium: ad.plan === 'premium',
                    isFeatured: ad.plan === 'alaune'
                })))
            }
            setLoading(false)
        }

        fetchAds()
    }, [query, province, city, category, minPrice, maxPrice, sort])

    const updateUrl = (newParams: Record<string, string>) => {
        const params = new URLSearchParams(searchParams.toString())
        Object.entries(newParams).forEach(([key, value]) => {
            if (value) params.set(key, value)
            else params.delete(key)
        })
        router.push(`/recherche?${params.toString()}`)
    }

    const applyFilters = () => {
        updateUrl(localFilters)
        setShowFilters(false) // On mobile
    }

    return (
        <div className="flex flex-col md:flex-row gap-8 pb-12 w-full">
            {/* Filters Sidebar (Desktop) */}
            <aside className={`md:w-64 flex-shrink-0 ${showFilters ? 'block fixed inset-0 z-50 bg-white p-4 overflow-y-auto' : 'hidden md:block'}`}>
                <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-100 ${showFilters ? '' : 'sticky top-24'}`}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-bold text-gray-900">Filtres</h2>
                        <button
                            className="md:hidden text-gray-500"
                            onClick={() => setShowFilters(false)}
                        >
                            Fermer
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Categories */}
                        <div>
                            <h3 className="font-semibold text-sm text-gray-900 mb-3">Catégories</h3>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={localFilters.category === ''}
                                        onChange={() => setLocalFilters({ ...localFilters, category: '' })}
                                        className="rounded text-green-600 focus:ring-green-500"
                                    />
                                    Toutes les catégories
                                </label>
                                {CATEGORIES.map(cat => (
                                    <label key={cat.slug} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={localFilters.category === cat.slug}
                                            onChange={() => setLocalFilters({ ...localFilters, category: cat.slug })}
                                            className="rounded text-green-600 focus:ring-green-500"
                                        />
                                        {cat.name}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Price */}
                        <div>
                            <h3 className="font-semibold text-sm text-gray-900 mb-3">Prix (F CFA)</h3>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={localFilters.minPrice}
                                    onChange={(e) => setLocalFilters({ ...localFilters, minPrice: e.target.value })}
                                    className="w-full text-sm p-2 border rounded focus:ring-1 focus:ring-green-500 outline-none"
                                />
                                <span className="text-gray-400">-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={localFilters.maxPrice}
                                    onChange={(e) => setLocalFilters({ ...localFilters, maxPrice: e.target.value })}
                                    className="w-full text-sm p-2 border rounded focus:ring-1 focus:ring-green-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <h3 className="font-semibold text-sm text-gray-900 mb-3">Lieu</h3>
                            <div className="space-y-2">
                                <select
                                    className="w-full text-sm p-2 border rounded focus:ring-1 focus:ring-green-500 outline-none bg-white"
                                    value={localFilters.province}
                                    onChange={(e) => setLocalFilters({ ...localFilters, province: e.target.value, city: '' })} // Reset city
                                >
                                    <option value="">Toute le Gabon</option>
                                    {Object.keys(PROVINCES).map(p => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>

                                <select
                                    className="w-full text-sm p-2 border rounded focus:ring-1 focus:ring-green-500 outline-none bg-white disabled:opacity-50"
                                    value={localFilters.city}
                                    onChange={(e) => setLocalFilters({ ...localFilters, city: e.target.value })}
                                    disabled={!localFilters.province}
                                >
                                    <option value="">Toutes les villes</option>
                                    {cities.map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <Button onClick={applyFilters} className="w-full bg-green-600 hover:bg-green-700">
                            Appliquer les filtres
                        </Button>
                    </div>
                </div>

                {/* Sidebar Ad */}
                <div className="hidden lg:block mt-6">
                    <AdBanner variant="sidebar" />
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
                {/* Search Bar - reusing the component for consistency but might need customization or just use the inputs */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="flex-grow w-full">
                            <h1 className="text-xl font-bold text-gray-900">
                                {loading ? 'Recherche...' : `Résultats ${query ? `pour "${query}"` : ''}`}
                                {!loading && <span className="text-sm font-normal text-gray-500 ml-2">({ads.length} annonces)</span>}
                            </h1>
                            {(province || category) && (
                                <div className="text-sm text-gray-500 mt-1">
                                    {category && <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded mr-2">{CATEGORIES.find(c => c.slug === category)?.name || category}</span>}
                                    {province && <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded">{province} {city ? `> ${city}` : ''}</span>}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-2 w-full md:w-auto">
                            <Button
                                variant="outline"
                                className="md:hidden flex-1"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <SlidersHorizontal size={18} className="mr-2" />
                                Filtres
                            </Button>
                            <div className="relative flex-1 md:flex-none">
                                <select
                                    className="w-full appearance-none h-10 pl-4 pr-8 border rounded-md bg-white focus:ring-2 focus:ring-green-500 outline-none cursor-pointer"
                                    value={sort}
                                    onChange={(e) => updateUrl({ sort: e.target.value })}
                                >
                                    <option value="newest">Les plus récentes</option>
                                    <option value="price_asc">Prix croissant</option>
                                    <option value="price_desc">Prix décroissant</option>
                                </select>
                                <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Ad Banner */}
                <AdBanner variant="horizontal" className="mb-6" />

                {/* Results */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-green-600" size={48} />
                    </div>
                ) : ads.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                        {/* Pagination - Dummy for now since we did not implement offset based pagination in URL yet */}
                        {ads.length > 20 && (
                            <div className="mt-10 flex justify-center gap-2">
                                <Button variant="outline" disabled>Précédent</Button>
                                <Button className="bg-green-600 hover:bg-green-700">1</Button>
                                <Button variant="outline">2</Button>
                                <Button variant="outline">Suivant</Button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-xl border border-gray-100 text-center">
                        <div className="bg-gray-100 p-4 rounded-full mb-4">
                            <PackageX size={48} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun résultat</h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-6">
                            Nous n'avons trouvé aucune annonce correspondant à vos critères.
                            Essayez d'élargir votre recherche.
                        </p>
                        <Button variant="outline" onClick={() => router.push('/recherche')}>
                            Effacer les filtres
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="animate-spin text-green-600" size={48} /></div>}>
            <SearchContent />
        </Suspense>
    )
}
