'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { AdBanner } from '@/components/ui/ad-banner'
import { cn } from '@/lib/utils'
import {
  ArrowUpRight,
  BarChart3,
  Bell,
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  CreditCard,
  Eye,
  Heart,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Package,
  Plus,
  Settings,
  ShoppingBag,
  Sparkles,
  Store,
  Wallet,
} from 'lucide-react'

interface UserDashboardProps {
  user: any
  initialActiveTab?: string
}

type Listing = {
  id: string
  title: string
  category: string
  price: string
  status: 'En ligne' | 'En attente' | 'Brouillon'
  views: number
  image: string
}

const demoListings: Listing[] = [
  { id: '1', title: 'Toyota RAV4 2020 — excellent état', category: 'Véhicules', price: '18 500 000', status: 'En ligne', views: 248, image: 'https://images.unsplash.com/photo-1568844293986-8c9b4b0e9f3e?auto=format&fit=crop&w=240&q=80' },
  { id: '2', title: 'Appartement 3 pièces à Libreville', category: 'Immobilier', price: '450 000 / mois', status: 'En ligne', views: 164, image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=240&q=80' },
  { id: '3', title: 'Canapé scandinave neuf', category: 'Maison & Jardin', price: '280 000', status: 'En attente', views: 76, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=240&q=80' },
]

const navItems = [
  { id: 'overview', label: 'Vue d’ensemble', icon: LayoutDashboard },
  { id: 'listings', label: 'Mes annonces', icon: Store },
  { id: 'orders', label: 'Commandes', icon: ShoppingBag },
  { id: 'bookings', label: 'Réservations', icon: CalendarDays },
  { id: 'messages', label: 'Messages', icon: MessageSquare, count: 3 },
  { id: 'payments', label: 'Paiements & revenus', icon: Wallet },
]

function MetricCard({ icon: Icon, label, value, detail, accent }: { icon: typeof Wallet; label: string; value: string; detail: string; accent: string }) {
  return (
    <div className="rounded-[1.5rem] border border-[#e4e0d8] bg-[#fffdf9] p-5 shadow-[0_12px_35px_rgba(20,34,48,0.06)]">
      <div className="flex items-start justify-between gap-3">
        <div className={cn('flex size-10 items-center justify-center rounded-xl', accent)}><Icon className="size-5" /></div>
        <ArrowUpRight className="size-4 text-emerald-600" />
      </div>
      <p className="mt-5 text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </div>
  )
}

export function UserDashboard({ user, initialActiveTab = 'overview' }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState(initialActiveTab)
  const [listings, setListings] = useState<Listing[]>(demoListings)
  const router = useRouter()
  const supabase = createClient()
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Vendeur'
  const initials = userName.slice(0, 2).toUpperCase()

  useEffect(() => {
    if (!user) return
    const loadListings = async () => {
      const { data } = await supabase.from('ads').select('id,title,price,status,images,views_count').eq('user_id', user.id).order('created_at', { ascending: false }).limit(6)
      if (data?.length) {
        setListings(data.map((ad) => ({ id: ad.id, title: ad.title, category: 'Annonce', price: new Intl.NumberFormat('fr-FR').format(ad.price || 0), status: ad.status === 'approved' ? 'En ligne' : ad.status === 'draft' ? 'Brouillon' : 'En attente', views: ad.views_count || 0, image: ad.images?.[0] || demoListings[0].image })))
      }
    }
    loadListings()
  }, [user, supabase])

  const revenue = useMemo(() => '1 240 000 F', [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/connexion')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0]">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 lg:px-8">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 flex flex-col gap-5">
            <div className="rounded-[1.75rem] bg-[#142230] p-5 text-white shadow-[0_18px_45px_rgba(20,34,48,0.16)]">
              <div className="flex items-center gap-3"><div className="flex size-11 items-center justify-center rounded-xl bg-emerald-500 font-bold">{initials}</div><div className="min-w-0"><p className="truncate font-semibold">{userName}</p><p className="truncate text-xs text-slate-400">Vendeur vérifié</p></div></div>
              <div className="mt-5 flex items-center gap-2 text-xs text-emerald-300"><span className="size-2 rounded-full bg-emerald-400" /> Boutique active</div>
            </div>
            <nav className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm" aria-label="Navigation du tableau de bord">
              {navItems.map(({ id, label, icon: Icon, count }) => <button key={id} onClick={() => setActiveTab(id)} className={cn('flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition', activeTab === id ? 'bg-[#fce5de] text-[#b94431]' : 'text-slate-600 hover:bg-slate-50')}><Icon className="size-4" /><span className="flex-1">{label}</span>{count && <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-700">{count}</span>}</button>)}
              <div className="my-2 border-t border-slate-100" />
              <Link href="/parametres" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"><Settings className="size-4" /> Paramètres</Link>
              <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-rose-600 hover:bg-rose-50"><LogOut className="size-4" /> Déconnexion</button>
            </nav>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4"><Sparkles className="size-5 text-emerald-600" /><p className="mt-3 text-sm font-semibold text-emerald-950">Boostez vos ventes</p><p className="mt-1 text-xs leading-5 text-emerald-800">Mettez une annonce en avant dès 2 500 F.</p><Button size="sm" className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700">Découvrir</Button></div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-medium text-emerald-600">Mardi 12 mars 2024</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">Bonjour, {userName.split(' ')[0]}</h1><p className="mt-1 text-sm text-slate-500">Voici ce qui se passe sur votre boutique.</p></div><div className="flex items-center gap-3"><button className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 shadow-sm"><Bell className="size-5" /><span className="absolute right-2 top-2 size-2 rounded-full bg-orange-500" /></button><Button asChild className="gap-2 bg-orange-500 text-white hover:bg-orange-600"><Link href="/publier"><Plus className="size-4" /> Nouvelle annonce</Link></Button></div></header>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><MetricCard icon={CircleDollarSign} label="Revenus ce mois" value={revenue} detail="+18,4% vs mois dernier" accent="bg-[#fce5de] text-[#b94431]" /><MetricCard icon={ShoppingBag} label="Ventes réalisées" value="28" detail="6 cette semaine" accent="bg-orange-100 text-orange-700" /><MetricCard icon={Eye} label="Vues des annonces" value="2 846" detail="+32% cette semaine" accent="bg-sky-100 text-sky-700" /><MetricCard icon={MessageSquare} label="Messages à traiter" value="3" detail="Réponse moyenne : 12 min" accent="bg-violet-100 text-violet-700" /></div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_1fr]">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><div><h2 className="font-semibold text-slate-950">Performance de la boutique</h2><p className="mt-1 text-sm text-slate-500">Revenus générés sur les 30 derniers jours</p></div><select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600"><option>30 derniers jours</option><option>90 derniers jours</option></select></div><div className="mt-6 flex h-48 items-end gap-2 border-b border-slate-100 px-2 pb-0">{[28, 42, 35, 56, 48, 72, 62, 84, 70, 94, 78, 100, 90, 82, 96, 72, 88, 76, 98, 86].map((height, index) => <div key={index} className="group flex flex-1 flex-col justify-end gap-2"><div className="relative rounded-t-md bg-emerald-500/80 transition hover:bg-emerald-600" style={{ height: `${height}%` }}><span className="absolute -top-7 left-1/2 hidden -translate-x-1/2 rounded bg-slate-900 px-1.5 py-1 text-[10px] text-white group-hover:block">{Math.round(height * 1200).toLocaleString('fr-FR')}</span></div></div>)}</div><div className="mt-3 flex justify-between text-[11px] text-slate-400"><span>12 fév.</span><span>26 fév.</span><span>12 mars</span></div></section>
            <section className="rounded-2xl bg-slate-950 p-5 text-white shadow-sm"><div className="flex items-center justify-between"><div><p className="text-sm text-slate-400">Solde disponible</p><p className="mt-2 text-3xl font-bold">{revenue}</p></div><div className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300"><Wallet className="size-5" /></div></div><div className="mt-6 rounded-xl bg-white/10 p-3 text-sm"><div className="flex items-center justify-between"><span className="text-slate-400">Prochain versement</span><span className="font-medium">15 mars</span></div><div className="mt-3 h-1.5 rounded-full bg-white/10"><div className="h-full w-3/4 rounded-full bg-emerald-400" /></div><p className="mt-2 text-xs text-slate-400">Versement Mobile Money automatique</p></div><Button variant="outline" className="mt-5 w-full border-white/20 bg-transparent text-white hover:bg-white/10"><CreditCard className="mr-2 size-4" /> Gérer les versements</Button></section>
          </div>

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-semibold text-slate-950">Vos annonces</h2><p className="mt-1 text-sm text-slate-500">Gérez votre catalogue et suivez sa performance.</p></div><button onClick={() => setActiveTab('listings')} className="flex items-center gap-1 text-sm font-medium text-[#d6533c] hover:text-[#b94431]">Voir toutes <ChevronRight className="size-4" /></button></div><div className="divide-y divide-slate-100">{listings.map((listing) => <div key={listing.id} className="flex items-center gap-4 p-4"><img src={listing.image} alt="" className="size-14 rounded-xl object-cover" /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="truncate text-sm font-semibold text-slate-950">{listing.title}</h3><span className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium', listing.status === 'En ligne' ? 'bg-[#fce5de] text-[#b94431]' : 'bg-amber-100 text-amber-700')}>{listing.status}</span></div><p className="mt-1 text-xs text-slate-500">{listing.category} · {listing.price} F CFA</p></div><div className="hidden items-center gap-1 text-xs text-slate-500 sm:flex"><Eye className="size-3.5" /> {listing.views}</div><button className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-700" aria-label={`Modifier ${listing.title}`}><ChevronRight className="size-4" /></button></div>)}</div></section>

          <div className="mt-6 grid gap-6 md:grid-cols-2"><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><h2 className="font-semibold text-slate-950">Dernières commandes</h2><button className="text-sm font-medium text-emerald-600">Tout voir</button></div><div className="mt-4 flex flex-col gap-4"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-full bg-[#fce5de] text-[#b94431]">#</div><div><p className="text-sm font-medium text-slate-900">Commande #GA-1048</p><p className="text-xs text-slate-500">Aujourd’hui, 10:42</p></div></div><span className="text-sm font-semibold text-slate-900">450 000 F</span></div><div className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-full bg-orange-100 text-orange-700">#</div><div><p className="text-sm font-medium text-slate-900">Commande #GA-1047</p><p className="text-xs text-slate-500">Hier, 16:20</p></div></div><span className="text-sm font-semibold text-slate-900">280 000 F</span></div></div></section><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><h2 className="font-semibold text-slate-950">À ne pas manquer</h2><Sparkles className="size-5 text-orange-500" /></div><p className="mt-3 text-sm leading-6 text-slate-600">Les annonces avec une photo de qualité reçoivent en moyenne 3 fois plus de messages.</p><div className="mt-4 flex items-center gap-3 rounded-xl bg-orange-50 p-3"><Heart className="size-5 text-orange-600" /><div><p className="text-sm font-medium text-orange-950">Optimisez vos annonces</p><p className="text-xs text-orange-800">2 annonces pourraient être améliorées.</p></div></div></section></div>
          <div className="mt-6"><AdBanner variant="small" /></div>
        </main>
      </div>
    </div>
  )
}
