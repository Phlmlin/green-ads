import Link from 'next/link'
import * as LucideIcons from 'lucide-react'

// Map of icon names to Lucide components
const iconMap = {
    Car: LucideIcons.Car,
    Home: LucideIcons.Home,
    Briefcase: LucideIcons.Briefcase,
    Sofa: LucideIcons.Armchair,
    Shirt: LucideIcons.Shirt,
    Smartphone: LucideIcons.Smartphone,
    Wrench: LucideIcons.Wrench,
    More: LucideIcons.MoreHorizontal,
}

interface CategoryCardProps {
    name: string
    slug: string
    iconName: string
    count?: number
}

export function CategoryCard({ name, slug, iconName, count }: CategoryCardProps) {
    // @ts-ignore - Dynamic icon access
    const Icon = iconMap[iconName] || LucideIcons.HelpCircle

    return (
        <Link
            href={`/categorie/${slug}`}
            className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 group"
        >
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-green-600 group-hover:text-white transition-colors">
                <Icon size={24} />
            </div>
            <h3 className="font-medium text-gray-900 group-hover:text-green-700">{name}</h3>
            {count !== undefined && (
                <span className="text-xs text-gray-500 mt-1">{count} annonces</span>
            )}
        </Link>
    )
}
