import Link from 'next/link'
import { ArrowRight, PackageCheck, Clock3 } from 'lucide-react'

const orders = [
  { id: 'GA-2048', title: 'Studio créatif & branding', seller: 'Atelier Nü', date: '12 septembre 2026', amount: '150 000 F CFA', status: 'En cours', tone: 'bg-[#fce5de] text-[#b94431]' },
  { id: 'GA-2039', title: 'Pack Visibilité', seller: 'Green Ads', date: '09 septembre 2026', amount: '5 000 F CFA', status: 'Payée', tone: 'bg-[#e3f1e8] text-[#2f7653]' },
]

export default function OrdersPage() {
  return <div className="mx-auto max-w-6xl"><div><p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d6533c]">Mon activité</p><h1 className="mt-3 font-serif text-5xl font-bold tracking-tight text-[#142230]">Commandes</h1><p className="mt-3 text-[#687582]">Retrouvez vos achats, prestations et abonnements.</p></div><div className="mt-10 flex flex-col gap-4">{orders.map((order) => <article key={order.id} className="rounded-[1.5rem] border border-[#e4e0d8] bg-[#fffdf9] p-6 shadow-[0_12px_35px_rgba(20,34,48,0.05)]"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div className="flex gap-4"><span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#fce5de] text-[#d6533c]"><PackageCheck /></span><div><div className="flex flex-wrap items-center gap-3"><h2 className="font-serif text-2xl font-bold text-[#142230]">{order.title}</h2><span className={`rounded-full px-3 py-1 text-xs font-semibold ${order.tone}`}>{order.status}</span></div><p className="mt-2 text-sm text-[#687582]">{order.id} · {order.seller} · {order.date}</p></div></div><div className="flex items-center justify-between gap-6 sm:justify-end"><strong className="text-sm text-[#142230]">{order.amount}</strong><ArrowRight className="text-[#d6533c]" /></div></div></article>)}</div></div>
}
