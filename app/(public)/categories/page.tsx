import { CategoryCard } from '@/components/ui/category-card'
import { CATEGORIES } from '@/lib/constants'

export default function CategoriesPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Toutes les catégories</h1>
                <p className="text-gray-500 max-w-2xl mx-auto">
                    Explorez nos différentes catégories pour trouver exactement ce que vous cherchez, ou vendez vos objets dans la bonne section pour une visibilité maximale.
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {CATEGORIES.map((cat) => (
                    <CategoryCard
                        key={cat.slug}
                        name={cat.name}
                        slug={cat.slug}
                        iconName={cat.icon}
                        count={cat.count}
                    />
                ))}
            </div>
        </div>
    )
}
