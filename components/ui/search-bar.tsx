'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PROVINCES } from '@/lib/constants'

export function SearchBar({ className = '' }: { className?: string }) {
    const router = useRouter()
    const [query, setQuery] = useState('')
    const [province, setProvince] = useState('')
    const [city, setCity] = useState('')
    const [cities, setCities] = useState<string[]>([])

    const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedProvince = e.target.value
        setProvince(selectedProvince)
        setCities(PROVINCES[selectedProvince] || [])
        setCity('') // Reset city
    }

    const handleSearch = () => {
        const params = new URLSearchParams()
        if (query) params.set('q', query)
        if (province) params.set('province', province)
        if (city) params.set('city', city)

        router.push(`/recherche?${params.toString()}`)
    }

    // Handle Enter key
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    return (
        <div className={`max-w-3xl mx-auto bg-white rounded-lg p-2 flex flex-col md:flex-row gap-2 shadow-lg ${className}`}>
            {/* Keyword Input */}
            <div className="flex-grow flex items-center px-4 h-12 border-b md:border-b-0 md:border-r border-gray-200">
                <Search className="text-gray-400 mr-2" size={20} />
                <input
                    type="text"
                    placeholder="Que recherchez-vous ?"
                    className="w-full outline-none text-gray-700 placeholder:text-gray-400"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>

            {/* Location Inputs (Grouped for mobile, row for desktop) */}
            <div className="flex flex-col sm:flex-row md:w-5/12 gap-2 md:gap-0">
                {/* Province */}
                <div className="flex items-center px-2 h-12 w-full">
                    <MapPin className="text-gray-400 mr-2 shrink-0" size={20} />
                    <select
                        className="w-full outline-none text-gray-700 bg-transparent cursor-pointer text-sm truncate"
                        value={province}
                        onChange={handleProvinceChange}
                    >
                        <option value="">Toute le Gabon</option>
                        {Object.keys(PROVINCES).map((p) => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                </div>

                {/* City (Conditional or always visible but disabled?) */}
                <div className={`flex items-center px-2 h-12 w-full md:border-l border-gray-200 ${!province ? 'opacity-50 pointer-events-none' : ''}`}>
                    <select
                        className="w-full outline-none text-gray-700 bg-transparent cursor-pointer text-sm truncate"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        disabled={!province}
                    >
                        <option value="">Ville...</option>
                        {cities.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
            </div>

            <Button
                size="lg"
                className="w-full md:w-auto px-8 h-12 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md"
                onClick={handleSearch}
            >
                Rechercher
            </Button>
        </div>
    )
}
