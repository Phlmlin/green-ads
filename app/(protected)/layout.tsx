import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

const dashboardLinks = [
    ['Vue d’ensemble', '/tableau-de-bord'],
    ['Commandes', '/commandes'],
    ['Réservations', '/reservations'],
    ['Paiements', '/paiements'],
    ['Favoris', '/favoris'],
    ['Messages', '/messages'],
    ['Paramètres', '/parametres'],
] as const

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col bg-[#f7f5f0]">
            <Header />
            <div className="border-b border-[#e4e0d8] bg-[#fffdf9]">
                <nav aria-label="Navigation de votre espace" className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5 py-3 sm:px-8">
                    {dashboardLinks.map(([label, href]) => (
                        <Link key={href} href={href} className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium text-[#687582] transition hover:bg-[#fce5de] hover:text-[#b94431]">
                            {label}
                        </Link>
                    ))}
                </nav>
            </div>
            <main className="flex-grow py-10">
                <div className="container mx-auto px-5 sm:px-8">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    )
}
