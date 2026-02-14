import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Clock, Heart } from 'lucide-react'

interface AdCardProps {
    id: string
    title: string
    price: number
    currency: string
    location: string
    imageUrl: string
    category: string
    createdAt: string
    isPremium?: boolean
    isFeatured?: boolean
}

export function AdCard({
    id,
    title,
    price,
    currency,
    location,
    imageUrl,
    category,
    createdAt,
    isPremium,
    isFeatured
}: AdCardProps) {
    const formattedPrice = new Intl.NumberFormat('fr-GA', {
        style: 'currency',
        currency: 'XAF',
        maximumFractionDigits: 0,
    }).format(price).replace('XAF', 'F CFA')

    return (
        <Link href={`/annonce/${id}`} className="group block h-full">
            <div className={`bg-white rounded-lg overflow-hidden border transition-all h-full flex flex-col ${isFeatured ? 'border-amber-400 shadow-md ring-1 ring-amber-400' : 'border-gray-200 hover:shadow-lg'}`}>
                {/* Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <Image
                        src={imageUrl || '/placeholder-image.jpg'}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {isFeatured && (
                            <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                                À LA UNE
                            </span>
                        )}
                        {isPremium && !isFeatured && (
                            <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                                PREMIUM
                            </span>
                        )}
                    </div>

                    <button className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full text-gray-500 hover:text-red-500 hover:bg-white transition-colors">
                        <Heart size={16} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-1">
                        <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded">
                            {category}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock size={12} />
                            {createdAt}
                        </span>
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-700">
                        {title}
                    </h3>

                    <div className="mt-auto">
                        <p className="text-lg font-bold text-green-700 mb-2">
                            {formattedPrice}
                        </p>

                        <div className="flex items-center text-gray-500 text-sm">
                            <MapPin size={14} className="mr-1" />
                            <span className="truncate">{location}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
