'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { Search, Send, MoreVertical, Phone, Image as ImageIcon, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { createClient } from '@/utils/supabase/client'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

// Types based on our schema
type Profile = {
    id: string
    full_name: string
    avatar_url: string | null
    phone: string | null
}

type Ad = {
    id: string
    title: string
    price: number
    images: string[]
}

type Conversation = {
    id: string
    participant1_id: string
    participant2_id: string
    ad_id: string
    last_message: string | null
    last_message_at: string
    created_at: string
    other_user?: Profile // Computed
    ad?: Ad // Joined
}

type Message = {
    id: string
    conversation_id: string
    sender_id: string
    receiver_id: string
    content: string
    created_at: string
    is_read: boolean
}

function MessagesContent() {
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [messageInput, setMessageInput] = useState('')
    const [loading, setLoading] = useState(true)
    const [loadingMessages, setLoadingMessages] = useState(false)
    const [currentUser, setCurrentUser] = useState<any>(null)
    const [sending, setSending] = useState(false)

    const supabase = createClient()
    const searchParams = useSearchParams()
    const router = useRouter()
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Initial Load
    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/connexion')
                return
            }
            setCurrentUser(user)
            await fetchConversations(user.id)
        }
        init()
    }, [])

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Handle URL Params (Start new chat)
    useEffect(() => {
        const checkUrlParams = async () => {
            const adId = searchParams.get('ad_id')
            const sellerId = searchParams.get('seller_id')

            if (adId && sellerId && currentUser) {
                if (sellerId === currentUser.id) return // Can't chat with self

                // Check if conversation already exists in loaded list
                const existing = conversations.find(c => c.ad_id === adId && (c.participant1_id === sellerId || c.participant2_id === sellerId))
                if (existing) {
                    setSelectedChatId(existing.id)
                    // Clean URL
                    router.replace('/messages')
                } else {
                    // Create new conversation immediately
                    await createConversation(adId, sellerId)
                }
            }
        }

        if (currentUser && conversations.length > 0) {
             checkUrlParams()
        } else if (currentUser && conversations.length === 0 && !loading) {
            // Case where user has no conversations yet but tries to start one
            checkUrlParams()
        }
    }, [searchParams, currentUser, conversations, loading])

    // Fetch Messages when chat selected
    useEffect(() => {
        if (!selectedChatId) return

        const fetchMessages = async () => {
            setLoadingMessages(true)
            const { data } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', selectedChatId)
                .order('created_at', { ascending: true })

            if (data) setMessages(data)
            setLoadingMessages(false)
        }

        fetchMessages()

        // Realtime Subscription
        const channel = supabase
            .channel(`chat:${selectedChatId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `conversation_id=eq.${selectedChatId}`
            }, (payload) => {
                setMessages(prev => [...prev, payload.new as Message])
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [selectedChatId])

    const fetchConversations = async (userId: string) => {
        setLoading(true)
        // We need to fetch conversations where current user is p1 or p2
        // Supabase OR syntax: participant1_id.eq.ID,participant2_id.eq.ID
        const { data, error } = await supabase
            .from('conversations')
            .select(`
                *,
                ad:ads(id, title, price, images),
                p1:users!participant1_id(id, full_name, avatar_url, phone),
                p2:users!participant2_id(id, full_name, avatar_url, phone)
            `)
            .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
            .order('last_message_at', { ascending: false })

        if (error) {
            console.error('Error fetching conversations:', error)
        } else if (data) {
            // Process data to identify "other user"
            const processed = data.map((c: any) => {
                const isP1 = c.participant1_id === userId
                return {
                    ...c,
                    other_user: isP1 ? c.p2 : c.p1
                }
            })
            setConversations(processed)
        }
        setLoading(false)
    }

    const createConversation = async (adId: string, sellerId: string) => {
        if (!currentUser) return

        try {
            // Double check existence via API to be safe (though usually list check is enough)
            // ... skipping for brevity, relying on unique constraint catch

            const { data, error } = await supabase
                .from('conversations')
                .insert({
                    participant1_id: currentUser.id,
                    participant2_id: sellerId,
                    ad_id: adId,
                    last_message: null
                })
                .select()
                .single()

            if (error) {
                // If unique violation, fetch existing
                if (error.code === '23505') { // Unique violation
                     const { data: existing } = await supabase
                        .from('conversations')
                        .select('*')
                        .eq('ad_id', adId)
                        .or(`and(participant1_id.eq.${currentUser.id},participant2_id.eq.${sellerId}),and(participant1_id.eq.${sellerId},participant2_id.eq.${currentUser.id})`)
                        .single()

                    if (existing) {
                        await fetchConversations(currentUser.id) // Refresh list
                        setSelectedChatId(existing.id)
                        router.replace('/messages')
                        return
                    }
                }
                throw error
            }

            if (data) {
                await fetchConversations(currentUser.id)
                setSelectedChatId(data.id)
                router.replace('/messages')
            }
        } catch (err) {
            console.error("Error creating conversation:", err)
        }
    }

    const sendMessage = async () => {
        if (!messageInput.trim() || !selectedChatId || !currentUser) return

        const activeChat = conversations.find(c => c.id === selectedChatId)
        if (!activeChat) return

        setSending(true)
        const content = messageInput.trim()
        const receiverId = activeChat.other_user?.id!

        try {
            const { error } = await supabase
                .from('messages')
                .insert({
                    conversation_id: selectedChatId,
                    sender_id: currentUser.id,
                    receiver_id: receiverId,
                    content: content,
                    ad_id: activeChat.ad_id // Legacy
                })

            if (error) throw error

            // Update conversation last_message
            await supabase
                .from('conversations')
                .update({
                    last_message: content,
                    last_message_at: new Date().toISOString()
                })
                .eq('id', selectedChatId)

            setMessageInput('')

            // Refresh conversations list order locally or fetch
            // Simple approach: move active chat to top locally
            setConversations(prev => {
                const others = prev.filter(c => c.id !== selectedChatId)
                const updated = { ...activeChat, last_message: content, last_message_at: new Date().toISOString() }
                return [updated, ...others]
            })

        } catch (err) {
            console.error("Error sending message:", err)
        } finally {
            setSending(false)
        }
    }

    const activeConversation = conversations.find(c => c.id === selectedChatId)

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 h-[calc(100vh-200px)] min-h-[600px] flex overflow-hidden">

            {/* Sidebar List */}
            <div className={`w-full md:w-80 border-r border-gray-100 flex flex-col ${selectedChatId ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border-transparent focus:bg-white focus:border-green-500 rounded-md text-sm outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex justify-center py-8"><Loader2 className="animate-spin text-green-600" /></div>
                    ) : conversations.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 text-sm px-4">
                            Vous n'avez aucune conversation. Contactez un vendeur pour commencer !
                        </div>
                    ) : (
                        conversations.map(chat => (
                            <button
                                key={chat.id}
                                onClick={() => setSelectedChatId(chat.id)}
                                className={`w-full p-4 flex gap-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0 ${selectedChatId === chat.id ? 'bg-green-50/50' : ''}`}
                            >
                                <div className="relative flex-shrink-0">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-lg overflow-hidden relative">
                                        {chat.other_user?.avatar_url ? (
                                            <Image src={chat.other_user.avatar_url} alt="" fill className="object-cover" />
                                        ) : (
                                            chat.other_user?.full_name?.charAt(0) || '?'
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-semibold text-gray-900 truncate">{chat.other_user?.full_name || 'Utilisateur'}</h3>
                                        <span className="text-xs text-gray-400">
                                            {new Date(chat.last_message_at).toLocaleDateString(undefined, {hour:'2-digit', minute:'2-digit'})}
                                        </span>
                                    </div>
                                    <p className={`text-sm truncate text-gray-500`}>
                                        {chat.last_message || 'Nouvelle conversation'}
                                    </p>
                                    {chat.ad && (
                                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-400 bg-gray-50 rounded px-1.5 py-0.5 w-fit">
                                            {/* We could show image if available */}
                                            <span className="truncate max-w-[120px]">{chat.ad.title}</span>
                                        </div>
                                    )}
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col ${!selectedChatId ? 'hidden md:flex' : 'flex'}`}>
                {selectedChatId && activeConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <button className="md:hidden" onClick={() => setSelectedChatId(null)}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                                </button>
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold overflow-hidden relative">
                                    {activeConversation.other_user?.avatar_url ? (
                                        <Image src={activeConversation.other_user.avatar_url} alt="" fill className="object-cover" />
                                    ) : (
                                        activeConversation.other_user?.full_name?.charAt(0) || '?'
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{activeConversation.other_user?.full_name}</h3>
                                    {activeConversation.ad && (
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                Concernant :
                                                <a href={`/annonce/${activeConversation.ad.id}`} className="font-medium text-gray-700 underline decoration-dotted hover:text-green-600">
                                                    {activeConversation.ad.title}
                                                </a>
                                            </span>
                                        </div>
                                    )}
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
                            {loadingMessages ? (
                                <div className="flex justify-center pt-10"><Loader2 className="animate-spin text-green-600" /></div>
                            ) : messages.length === 0 ? (
                                <div className="text-center py-10 text-gray-400">Dites bonjour !</div>
                            ) : (
                                messages.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.sender_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${
                                            msg.sender_id === currentUser?.id
                                                ? 'bg-green-600 text-white rounded-br-none'
                                                : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                                        }`}>
                                            <p className="text-sm">{msg.content}</p>
                                            <span className={`text-[10px] block text-right mt-1 ${
                                                msg.sender_id === currentUser?.id ? 'text-green-100' : 'text-gray-400'
                                            }`}>
                                                {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
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
                                    disabled={sending}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault()
                                            sendMessage()
                                        }
                                    }}
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={!messageInput.trim() || sending}
                                    className={`p-2 rounded-full transition-all transform ${
                                        messageInput.trim() ? 'bg-green-600 text-white scale-100 hover:bg-green-700' : 'bg-gray-200 text-gray-400 scale-90'
                                    }`}
                                >
                                    {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
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

export default function MessagesPage() {
    return (
        <Suspense fallback={<div className="flex justify-center h-screen items-center"><Loader2 className="animate-spin text-green-600" /></div>}>
            <MessagesContent />
        </Suspense>
    )
}
