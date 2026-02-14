'use client'

import { useState } from 'react'
import { Search, Send, MoreVertical, Phone, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

// Mock Data
const CONVERSATIONS = [
    {
        id: '1',
        user: { name: 'Jean-Marc Ondou', avatar: null, isOnline: true },
        lastMessage: 'Est-ce que le prix est négociable ?',
        date: '10:30',
        unread: 2,
        ad: { title: 'Toyota Camry 2018', image: 'https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?auto=format&fit=crop&q=80&w=100' }
    },
    {
        id: '2',
        user: { name: 'Sarah M.', avatar: null, isOnline: false },
        lastMessage: 'Ok, je vous appelle demain.',
        date: 'Hier',
        unread: 0,
        ad: { title: 'iPhone 15 Pro', image: 'https://images.unsplash.com/photo-1695048133169-ea79a5a683a9?auto=format&fit=crop&q=80&w=100' }
    }
]

const MESSAGES = [
    { id: 1, sender: 'them', text: 'Bonjour, votre voiture est-elle toujours disponible ?', time: '10:00' },
    { id: 2, sender: 'me', text: 'Bonjour, oui toujours disponible.', time: '10:05' },
    { id: 3, sender: 'them', text: 'Quel est votre dernier prix ?', time: '10:15' },
    { id: 4, sender: 'me', text: 'Je peux descendre à 8.3M si paiement cash.', time: '10:20' },
    { id: 5, sender: 'them', text: 'Est-ce que le prix est négociable ?', time: '10:30' },
]

export default function MessagesPage() {
    const [selectedChat, setSelectedChat] = useState<string | null>('1')
    const [messageInput, setMessageInput] = useState('')

    const activeConversation = CONVERSATIONS.find(c => c.id === selectedChat)

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 h-[calc(100vh-200px)] min-h-[600px] flex overflow-hidden">

            {/* Sidebar List */}
            <div className={`w-full md:w-80 border-r border-gray-100 flex flex-col ${selectedChat ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher une conversation"
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-transparent focus:bg-white focus:border-green-500 rounded-md text-sm outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {CONVERSATIONS.map(chat => (
                        <button
                            key={chat.id}
                            onClick={() => setSelectedChat(chat.id)}
                            className={`w-full p-4 flex gap-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0 ${selectedChat === chat.id ? 'bg-green-50/50' : ''}`}
                        >
                            <div className="relative flex-shrink-0">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-lg">
                                    {chat.user.name.charAt(0)}
                                </div>
                                {chat.user.isOnline && (
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-semibold text-gray-900 truncate">{chat.user.name}</h3>
                                    <span className="text-xs text-gray-400">{chat.date}</span>
                                </div>
                                <p className={`text-sm truncate ${chat.unread > 0 ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
                                    {chat.unread > 0 && <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>}
                                    {chat.lastMessage}
                                </p>
                                <div className="flex items-center gap-1 mt-1 text-xs text-gray-400 bg-gray-50 rounded px-1.5 py-0.5 w-fit">
                                    <Image src={chat.ad.image} width={16} height={16} alt="" className="rounded-sm object-cover" />
                                    <span className="truncate max-w-[120px]">{chat.ad.title}</span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
                {selectedChat && activeConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <button className="md:hidden" onClick={() => setSelectedChat(null)}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                </button>
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">
                                    {activeConversation.user.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{activeConversation.user.name}</h3>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            Concernant :
                                            <span className="font-medium text-gray-700 underline decoration-dotted">{activeConversation.ad.title}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <Phone size={20} />
                                </button>
                                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                    <MoreVertical size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                            {MESSAGES.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${msg.sender === 'me'
                                            ? 'bg-green-600 text-white rounded-br-none'
                                            : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                                        }`}>
                                        <p className="text-sm">{msg.text}</p>
                                        <span className={`text-[10px] block text-right mt-1 ${msg.sender === 'me' ? 'text-green-100' : 'text-gray-400'}`}>
                                            {msg.time}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-gray-100 bg-white">
                            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-full border border-gray-200 focus-within:ring-2 focus-within:ring-green-500 focus-within:border-transparent transition-all shadow-sm">
                                <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                                    <ImageIcon size={20} />
                                </button>
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder="Écrivez votre message..."
                                    className="flex-1 bg-transparent outline-none text-sm px-2"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            // Send message logic
                                            setMessageInput('')
                                        }
                                    }}
                                />
                                <button className={`p-2 rounded-full transition-all transform ${messageInput.trim() ? 'bg-green-600 text-white scale-100 hover:bg-green-700' : 'bg-gray-200 text-gray-400 scale-90'}`}>
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Send size={32} />
                        </div>
                        <p>Sélectionnez une conversation pour commencer</p>
                    </div>
                )}
            </div>
        </div>
    )
}
