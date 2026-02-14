import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="p-4">
                <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors">
                    <ArrowLeft size={20} />
                    Retour à l'accueil
                </Link>
            </div>
            <div className="flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                    <div className="flex justify-center mb-8">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-2xl">G</span>
                            </div>
                            <span className="text-2xl font-bold text-gray-900">Green Ads</span>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    )
}
