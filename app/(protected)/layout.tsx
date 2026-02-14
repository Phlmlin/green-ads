import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    )
}
