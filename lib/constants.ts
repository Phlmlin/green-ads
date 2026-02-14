import { Car, Home, Briefcase, Smartphone, Armchair, Shirt, Wrench, MoreHorizontal, HelpCircle } from 'lucide-react'

export const CATEGORIES = [
    { name: 'Véhicules', slug: 'vehicules', icon: 'Car' },
    { name: 'Immobilier', slug: 'immobilier', icon: 'Home' },
    { name: 'Emploi', slug: 'emploi', icon: 'Briefcase' },
    { name: 'Maison & Jardin', slug: 'maison-jardin', icon: 'Sofa' },
    { name: 'Mode & Beauté', slug: 'mode-beaute', icon: 'Shirt' },
    { name: 'Multimédia', slug: 'multimedia', icon: 'Smartphone' },
    { name: 'Services', slug: 'services', icon: 'Wrench' },
]

export const PROVINCES: Record<string, string[]> = {
    'Estuaire': [
        'Libreville', 'Owendo', 'Akanda', 'Ntoum', 'Kango', 'Cocobeach', 'Ndzomoe'
    ],
    'Haut-Ogooué': [
        'Franceville', 'Moanda', 'Mounana', 'Bakoumba', 'Bongoville', 'Boumango', 'Léconi', 'Ngouoni', 'Okondja', 'Akiéni'
    ],
    'Moyen-Ogooué': [
        'Lambaréné', 'Ndjolé'
    ],
    'Ngounié': [
        'Mouila', 'Ndendé', 'Fougamou', 'Lébamba', 'Mbigou', 'Mimongo', 'Guiétsou', 'Mandji', 'Malinga'
    ],
    'Nyanga': [
        'Tchibanga', 'Mayumba', 'Moabi', 'Mabanda'
    ],
    'Ogooué-Ivindo': [
        'Makokou', 'Booué', 'Mekambo', 'Ovan'
    ],
    'Ogooué-Lolo': [
        'Koulamoutou', 'Lastoursville', 'Pana', 'Iboundji'
    ],
    'Ogooué-Maritime': [
        'Port-Gentil', 'Omboué', 'Gamba', 'Etimboué'
    ],
    'Woleu-Ntem': [
        'Oyem', 'Bitam', 'Minvoul', 'Mitzic', 'Medouneu'
    ]
}

export const PLANS = [
    {
        id: 'gratuit',
        name: 'Gratuit',
        price: 0,
        duration: 30,
        photos: 5,
        features: ['Visibilité standard', '5 photos', 'Durée 30 jours']
    },
    {
        id: 'premium',
        name: 'Premium',
        price: 5000,
        duration: 90,
        photos: 10,
        isPopular: true,
        features: ['Badge Premium', '10 photos HD', 'Durée 90 jours', 'Remontée hebdomadaire']
    },
    {
        id: 'alaune',
        name: 'À la une',
        price: 10000,
        duration: 30,
        photos: 15,
        features: ['En tête de liste', 'Badge À la une', '15 photos HD', 'Partage réseaux sociaux']
    }
]
