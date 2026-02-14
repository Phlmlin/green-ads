'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { User, Bell, Shield, Key, Mail, Edit2, Camera } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile')

    const tabs = [
        { id: 'profile', icon: User, label: 'Profil' },
        { id: 'account', icon: Key, label: 'Compte & Sécurité' },
        { id: 'notifications', icon: Bell, label: 'Notifications' },
    ]

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Paramètres</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Settings Navigation */}
                <nav className="md:w-64 space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors text-left",
                                activeTab === tab.id
                                    ? "bg-green-50 text-green-700"
                                    : "text-gray-600 hover:bg-gray-50"
                            )}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </nav>

                {/* Content */}
                <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8">

                    {/* Profile Settings */}
                    {activeTab === 'profile' && (
                        <div className="space-y-8">
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-4xl text-gray-400 font-bold border-4 border-white shadow-sm overflow-hidden">
                                        J
                                    </div>
                                    <button className="absolute bottom-0 right-0 bg-green-600 text-white p-2 rounded-full border-2 border-white hover:bg-green-700 transition-colors shadow">
                                        <Camera size={14} />
                                    </button>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">Jean Dupont</h3>
                                    <p className="text-gray-500 text-sm">Membre depuis Jan 2024</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                                    <input type="text" defaultValue="Jean Dupont" className="w-full p-2.5 rounded-md border border-gray-300 focus:ring-green-500 focus:border-green-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                                    <input type="tel" defaultValue="074 01 02 03" className="w-full p-2.5 rounded-md border border-gray-300 focus:ring-green-500 focus:border-green-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                                    <input type="text" defaultValue="Libreville" className="w-full p-2.5 rounded-md border border-gray-300 focus:ring-green-500 focus:border-green-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quartier</label>
                                    <input type="text" defaultValue="Louis" className="w-full p-2.5 rounded-md border border-gray-300 focus:ring-green-500 focus:border-green-500" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                <textarea rows={3} placeholder="Parlez nous un peu de vous..." className="w-full p-2.5 rounded-md border border-gray-300 focus:ring-green-500 focus:border-green-500" />
                            </div>

                            <Button className="bg-green-600 hover:bg-green-700">Sauvegarder les modifications</Button>
                        </div>
                    )}

                    {/* Account Settings */}
                    {activeTab === 'account' && (
                        <div className="space-y-8">
                            <div>
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Mail size={18} className="text-gray-400" />
                                    Email
                                </h3>
                                <div className="flex gap-4">
                                    <input type="email" value="jean.dupont@example.com" disabled className="flex-1 bg-gray-50 text-gray-500 p-2.5 rounded-md border border-gray-200 cursor-not-allowed" />
                                    <Button variant="outline">Modifier</Button>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Key size={18} className="text-gray-400" />
                                    Mot de passe
                                </h3>
                                <div className="space-y-4">
                                    <input type="password" placeholder="Mot de passe actuel" className="w-full p-2.5 rounded-md border border-gray-300" />
                                    <input type="password" placeholder="Nouveau mot de passe" className="w-full p-2.5 rounded-md border border-gray-300" />
                                    <input type="password" placeholder="Confirmer le nouveau mot de passe" className="w-full p-2.5 rounded-md border border-gray-300" />
                                    <Button variant="outline">Mettre à jour le mot de passe</Button>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-6">
                                <h3 className="font-bold text-red-600 mb-2">Zone Danger</h3>
                                <p className="text-sm text-gray-500 mb-4">La suppression de votre compte est irréversible.</p>
                                <Button variant="destructive" className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300">
                                    Supprimer mon compte
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Notifications */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <h3 className="font-bold text-gray-900 mb-4">Préférences de notifications</h3>

                            {[
                                "Nouveaux messages",
                                "Mises à jour de mes annonces",
                                "Offres promotionnelles",
                                "Newsletter hebdomadaire"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between py-2">
                                    <span className="text-gray-700">{item}</span>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked={i < 2} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                    </label>
                                </div>
                            ))}

                            <div className="pt-4">
                                <Button className="bg-green-600 hover:bg-green-700">Sauvegarder</Button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}
