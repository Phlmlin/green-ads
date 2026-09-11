import Link from 'next/link'
import { ArrowRight, BadgeCheck, MapPin, ShoppingBag, Star } from 'lucide-react'

const offers = [
  { id: '1', title: 'Studio créatif & branding', seller: 'Atelier Nü', location: 'Libreville', price: 'À partir de 150 000 F CFA', rating: '4,9', category: 'Services professionnels', image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=900' },
  { id: '2', title: 'Appartement meublé au centre', seller: 'Maison Ébène', location: 'Libreville · Louis', price: '45 000 F CFA / nuit', rating: '4,8', category: 'Immobilier', image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=900' },
  { id: '3', title: 'Photographe événementiel', seller: 'Kévin M.', location: 'Port-Gentil', price: 'À partir de 80 000 F CFA', rating: '5,0', category: 'Événementiel', image: 'https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&q=80&w=900' },
]

export default function MarketplacePage() {
  return <main className="min-h-screen bg-[#f7f5f0] text-[#142230]">
    <section className="mx-auto max-w-7xl px-5 pb-14 pt-12 sm:px-8 lg:pt-20">
      <div className="max-w-3xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[#d6533c]">Green Ads marketplace</p>
        <h1 className="font-serif text-5xl font-bold leading-[0.98] tracking-tight sm:text-7xl">Des services fiables, au bon endroit.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#687582]">Trouvez un professionnel, réservez un service et payez simplement par Mobile Money.</p>
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        {['Tout voir', 'Services', 'Immobilier', 'Événementiel', 'Maison'].map((item, index) => <button key={item} className={`rounded-full px-5 py-3 text-sm font-medium ${index === 0 ? 'bg-[#142230] text-[#fffaf4]' : 'border border-[#ded9d0] bg-[#fffdf9] text-[#687582]'}`}>{item}</button>)}
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {offers.map((offer) => <article key={offer.id} className="overflow-hidden rounded-[1.6rem] border border-[#e4e0d8] bg-[#fffdf9] shadow-[0_12px_35px_rgba(20,34,48,0.06)]">
          <div className="relative h-56 overflow-hidden"><img src={offer.image} alt="" className="h-full w-full object-cover transition duration-500 hover:scale-105" /><span className="absolute left-4 top-4 rounded-full bg-[#fffdf9]/90 px-3 py-1 text-xs font-semibold">{offer.category}</span></div>
          <div className="p-5"><div className="flex items-start justify-between gap-4"><div><h2 className="font-serif text-2xl font-bold">{offer.title}</h2><p className="mt-2 text-sm text-[#687582]">par {offer.seller}</p></div><BadgeCheck className="shrink-0 text-[#f26b4f]" /></div><div className="mt-5 flex items-center gap-4 text-sm text-[#687582]"><span className="flex items-center gap-1"><MapPin size={15} />{offer.location}</span><span className="flex items-center gap-1"><Star size={15} className="fill-[#f26b4f] text-[#f26b4f]" />{offer.rating}</span></div><div className="mt-5 flex items-center justify-between border-t border-[#eeeae2] pt-4"><strong className="text-sm">{offer.price}</strong><Link href={`/annonce/${offer.id}`} className="flex items-center gap-2 text-sm font-semibold text-[#d6533c]">Voir l’offre <ArrowRight size={16} /></Link></div></div>
        </article>)}
      </div>
    </section>
  </main>
}
