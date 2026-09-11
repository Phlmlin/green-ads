import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-[#142230] px-4 py-4 text-[#142230] sm:px-6">
            <div className="mx-auto flex max-w-7xl justify-between">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#fffaf4]/70 transition-colors hover:text-[#fffaf4]">
                    <ArrowLeft size={18} />
                    Retour à l&apos;accueil
                </Link>
                <span className="hidden text-xs uppercase tracking-[0.24em] text-[#fffaf4]/50 sm:block">La marketplace locale</span>
            </div>
            <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center py-8">
                <div className="w-full max-w-md rounded-[2rem] border border-[#fffaf4]/10 bg-[#fffdf9] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.2)] sm:p-10">
                    <div className="mb-9 flex items-center justify-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-2xl bg-[#f26b4f] text-2xl font-bold text-[#fffaf4]">G</div>
                        <span className="font-serif text-2xl font-bold tracking-tight text-[#142230]">Green Ads</span>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    )
}
