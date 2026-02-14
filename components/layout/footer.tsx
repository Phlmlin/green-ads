import Link from 'next/link'
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react'

export function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 pt-12 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-xl">G</span>
                            </div>
                            <span className="text-xl font-bold text-white">Green Ads</span>
                        </Link>
                        <p className="text-sm text-gray-400 mb-4">
                            La meilleure plateforme de petites annonces au Gabon. Achetez, vendez et trouvez tout ce dont vous avez besoin.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-green-500 transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="hover:text-green-500 transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="hover:text-green-500 transition-colors"><Twitter size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Liens Rapides</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/a-propos" className="hover:text-green-500">À propos</Link></li>
                            <li><Link href="/blog" className="hover:text-green-500">Blog</Link></li>
                            <li><Link href="/tarifs" className="hover:text-green-500">Tarifs</Link></li>
                            <li><Link href="/contact" className="hover:text-green-500">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Catégories</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/categorie/vehicules" className="hover:text-green-500">Véhicules</Link></li>
                            <li><Link href="/categorie/immobilier" className="hover:text-green-500">Immobilier</Link></li>
                            <li><Link href="/categorie/emploi" className="hover:text-green-500">Emploi</Link></li>
                            <li><Link href="/categorie/services" className="hover:text-green-500">Services</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Contact</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                                <MapPin size={16} className="text-green-500" />
                                <span>Libreville, Gabon</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone size={16} className="text-green-500" />
                                <span>+241 01 02 03 04</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail size={16} className="text-green-500" />
                                <span>contact@greenads.ga</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Green Ads. Tous droits réservés.</p>
                    <div className="flex gap-4 mt-4 md:mt-0">
                        <Link href="/confidentialite" className="hover:text-white">Politique de confidentialité</Link>
                        <Link href="/conditions" className="hover:text-white">Conditions d'utilisation</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
