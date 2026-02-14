import React from 'react'

type AdBannerVariant = 'horizontal' | 'sidebar' | 'small'

interface AdBannerProps {
    variant?: AdBannerVariant
    className?: string
}

export function AdBanner({ variant = 'horizontal', className = '' }: AdBannerProps) {
    if (variant === 'sidebar') {
        return (
            <div className={`rounded-xl overflow-hidden border border-gray-100 shadow-sm ${className}`}>
                <div className="relative bg-gradient-to-b from-emerald-600 via-teal-600 to-cyan-700 p-6 text-center min-h-[280px] flex flex-col items-center justify-center">
                    <span className="bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-4 inline-block">
                        Publicité
                    </span>
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-4">
                        <span className="text-3xl">📢</span>
                    </div>
                    <h4 className="text-white font-bold text-lg mb-2 leading-tight">
                        Votre pub ici
                    </h4>
                    <p className="text-white/80 text-xs mb-4 leading-relaxed">
                        Touchez des milliers d'acheteurs au Gabon chaque jour
                    </p>
                    <div className="bg-white text-emerald-700 text-xs font-bold px-4 py-2 rounded-full hover:bg-emerald-50 transition-colors cursor-pointer">
                        En savoir plus
                    </div>
                </div>
            </div>
        )
    }

    if (variant === 'small') {
        return (
            <div className={`rounded-lg overflow-hidden border border-gray-100 ${className}`}>
                <div className="relative bg-gradient-to-r from-gray-100 to-gray-50 p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="bg-gray-200 text-gray-500 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                            Publicité
                        </span>
                        <p className="text-gray-600 text-xs">
                            Boostez vos annonces avec les plans Premium et À la une
                        </p>
                    </div>
                    <span className="text-xs text-green-600 font-semibold hover:underline cursor-pointer whitespace-nowrap ml-4">
                        Voir les plans →
                    </span>
                </div>
            </div>
        )
    }

    // Default: horizontal
    return (
        <div className={`rounded-xl overflow-hidden shadow-sm ${className}`}>
            <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-6 md:p-8">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 25% 50%, white 1px, transparent 1px), radial-gradient(circle at 75% 50%, white 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }} />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-center md:text-left">
                        <span className="bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-3 inline-block">
                            Publicité
                        </span>
                        <h3 className="text-white text-xl md:text-2xl font-bold mb-1">
                            Espace Publicitaire Premium
                        </h3>
                        <p className="text-white/80 text-sm">
                            Atteignez des milliers d'utilisateurs chaque jour sur Green Ads
                        </p>
                    </div>
                    <div className="bg-white text-indigo-700 font-bold text-sm px-6 py-2.5 rounded-full hover:bg-indigo-50 transition-colors cursor-pointer whitespace-nowrap shadow-lg">
                        Annoncer ici
                    </div>
                </div>
            </div>
        </div>
    )
}
