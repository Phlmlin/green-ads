'use client'

import { useState, useEffect } from 'react'
import { CATEGORIES, PLANS, PROVINCES } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { ImageUploader } from '@/components/ui/image-uploader'
import { useRouter, useSearchParams } from 'next/navigation'
import { Check, ChevronRight, CheckCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'

export default function PublishPage() {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [fetchingAd, setFetchingAd] = useState(false)
    const [user, setUser] = useState<any>(null)
    const supabase = createClient()
    const router = useRouter()
    const searchParams = useSearchParams()
    const editAdId = searchParams.get('edit')

    // Form State
    const [formData, setFormData] = useState({
        category: '', // vehicules, immobilier, emploi...
        title: '',
        description: '',
        price: '',
        currency: 'F CFA',
        province: '',
        city: '',
        phone: '',
        email: '',
        // Common dynamic fields (saved to custom_data)
        brand: '',
        model: '',
        year: '',
        mileage: '',
        fuel: '',
        transmission: '',
        propertyType: '', // maison, appartement, terrain...
        surface: '',
        rooms: '',
        bathrooms: '',
        contractType: '', // CDI, CDD...
        company: '',
        salary: '',
        images: [] as (File | string)[],
        plan: 'gratuit'
    })

    const [cities, setCities] = useState<string[]>([])
    const [dbCategories, setDbCategories] = useState<any[]>([])

    // Initial Data Load (User & Categories)
    useEffect(() => {
        const initData = async () => {
            // 1. Get User
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUser(user)
                if (!editAdId) {
                    setFormData(prev => ({
                        ...prev,
                        email: user.email || '',
                        phone: user.user_metadata?.phone || ''
                    }))
                }
            } else {
                router.push('/connexion')
                return
            }

            // 2. Fetch Categories
            const { data: cats, error } = await supabase
                .from('categories')
                .select('id, name, slug')

            if (cats) {
                setDbCategories(cats)
            }
        }
        initData()
    }, [editAdId, router, supabase])

    // Fetch Ad Data for Editing
    useEffect(() => {
        const fetchAdForEdit = async () => {
            if (!editAdId || dbCategories.length === 0) return

            setFetchingAd(true)
            const { data: ad, error } = await supabase
                .from('ads')
                .select('*')
                .eq('id', editAdId)
                .single()

            if (error || !ad) {
                console.error("Error fetching ad:", error)
                alert("Impossible de charger l'annonce.")
                router.push('/tableau-de-bord')
                return
            }

            // Match Category ID to Name
            const cat = dbCategories.find(c => c.id === ad.category_id)
            const catName = cat ? cat.name : ''

            // Parse location "Province, City"
            const [prov, city] = (ad.location || '').split(',').map((s: string) => s.trim())

            // Set Form Data
            setFormData({
                category: catName,
                title: ad.title,
                description: ad.description,
                price: ad.price.toString(),
                currency: ad.currency || 'F CFA',
                province: prov || '',
                city: city || '',
                phone: user?.user_metadata?.phone || '', // Keep user phone or fetch from profile if stored elsewhere
                email: user?.email || '',

                // Custom Data
                brand: ad.custom_data?.brand || '',
                model: ad.custom_data?.model || '',
                year: ad.custom_data?.year || '',
                mileage: ad.custom_data?.mileage || '',
                fuel: ad.custom_data?.fuel || '',
                transmission: ad.custom_data?.transmission || '',
                propertyType: ad.custom_data?.propertyType || '',
                surface: ad.custom_data?.surface || '',
                rooms: ad.custom_data?.rooms || '',
                bathrooms: ad.custom_data?.bathrooms || '',
                contractType: ad.custom_data?.contractType || '',
                company: ad.custom_data?.company || '',
                salary: ad.custom_data?.salary || '',

                images: ad.images || [],
                plan: ad.plan || 'gratuit'
            })

            // Set cities for the province
            if (prov && PROVINCES[prov]) {
                setCities(PROVINCES[prov])
            }

            setFetchingAd(false)
        }

        if (editAdId && user && dbCategories.length > 0) {
            fetchAdForEdit()
        }
    }, [editAdId, user, dbCategories, router, supabase])


    const updateField = (field: string, value: any) => {
        setFormData(prev => {
            const newData = { ...prev, [field]: value }

            // Handle Province -> City dependency
            if (field === 'province') {
                setCities(PROVINCES[value] || [])
                newData.city = '' // Reset city when province changes
            }

            return newData
        })
    }

    const handleNext = () => {
        if (step < 4) setStep(step + 1)
    }

    const handleBack = () => {
        if (step > 1) setStep(step - 1)
    }

    const handleSubmit = async () => {
        if (!user) {
            alert("Vous devez être connecté pour publier.")
            return
        }

        setLoading(true)
        try {
            const selectedCat = dbCategories.find(c => c.name === formData.category)
            if (!selectedCat) {
                throw new Error(`Catégorie invalide ou introuvable: ${formData.category}`)
            }

            // Upload new images
            const finalImageUrls: string[] = []

            // Separate existing URLs from new Files
            const existingUrls = formData.images.filter(img => typeof img === 'string') as string[]
            const newFiles = formData.images.filter(img => typeof img !== 'string') as File[]

            // Add existing
            finalImageUrls.push(...existingUrls)

            // Upload new
            if (newFiles.length > 0) {
                for (const file of newFiles) {
                    const fileExt = file.name.split('.').pop()
                    const fileName = `${Math.random()}.${fileExt}`
                    const { error: uploadError } = await supabase.storage
                        .from('ads')
                        .upload(`${user.id}/${fileName}`, file)

                    if (uploadError) throw uploadError
                    const { data: { publicUrl } } = supabase.storage
                        .from('ads')
                        .getPublicUrl(`${user.id}/${fileName}`)
                    finalImageUrls.push(publicUrl)
                }
            }

            // Prepare custom_data based on category
            let customData = {}
            if (formData.category === 'Véhicules') {
                customData = {
                    brand: formData.brand,
                    model: formData.model,
                    year: formData.year,
                    mileage: formData.mileage,
                    fuel: formData.fuel,
                    transmission: formData.transmission
                }
            } else if (formData.category === 'Immobilier') {
                customData = {
                    propertyType: formData.propertyType,
                    surface: formData.surface,
                    rooms: formData.rooms,
                    bathrooms: formData.bathrooms
                }
            } else if (formData.category === 'Emploi') {
                customData = {
                    contractType: formData.contractType,
                    company: formData.company,
                    salary: formData.salary
                }
            }

            const adPayload = {
                category_id: selectedCat.id,
                title: formData.title,
                description: formData.description,
                price: parseFloat(formData.price) || 0,
                location: `${formData.province}, ${formData.city}`,
                custom_data: customData,
                images: finalImageUrls,
                plan: formData.plan,
                // Do not reset status to pending on edit if approved?
                // Usually editing requires re-approval. Let's set to pending if user is not admin.
                status: 'pending'
            }

            let error;
            if (editAdId) {
                // Update
                const { error: updateError } = await supabase
                    .from('ads')
                    .update(adPayload)
                    .eq('id', editAdId)
                    .eq('user_id', user.id) // Security check
                error = updateError
            } else {
                // Insert
                const { error: insertError } = await supabase
                    .from('ads')
                    .insert({
                        user_id: user.id,
                        ...adPayload
                    })
                error = insertError
            }

            if (error) {
                console.error("Supabase Error:", error)
                throw error
            }

            router.push('/tableau-de-bord?success=true')
        } catch (error: any) {
            console.error('Error publishing ad:', error)
            alert(`Erreur: ${error.message || "Une erreur est survenue"}`)
        } finally {
            setLoading(false)
        }
    }


    /* --- DYNAMIC FORM FIELDS RENDERERS --- */

    const renderCommonFields = () => (
        <>
            <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 border-b pb-2">Localisation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                        <select
                            className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-500"
                            value={formData.province}
                            onChange={(e) => updateField('province', e.target.value)}
                        >
                            <option value="">Sélectionner une province</option>
                            {Object.keys(PROVINCES).map(p => (
                                <option key={p} value={p}>{p}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                        <select
                            className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-500"
                            value={formData.city}
                            onChange={(e) => updateField('city', e.target.value)}
                            disabled={!formData.province}
                        >
                            <option value="">Sélectionner une ville</option>
                            {cities.map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="pt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description détaillée</label>
                    <textarea
                        rows={6}
                        className="w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-500"
                        placeholder="Décrivez votre bien ou service en détail..."
                        value={formData.description}
                        onChange={(e) => updateField('description', e.target.value)}
                    />
                </div>
            </div>
        </>
    )

    const renderVehicleFields = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marque</label>
                <input type="text" className="input-field" placeholder="Ex: Toyota" value={formData.brand} onChange={e => updateField('brand', e.target.value)} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Modèle</label>
                <input type="text" className="input-field" placeholder="Ex: Corolla" value={formData.model} onChange={e => updateField('model', e.target.value)} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Année</label>
                <input type="number" className="input-field" placeholder="Ex: 2018" value={formData.year} onChange={e => updateField('year', e.target.value)} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kilométrage</label>
                <input type="number" className="input-field" placeholder="Ex: 85000" value={formData.mileage} onChange={e => updateField('mileage', e.target.value)} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Carburant</label>
                <select className="input-field" value={formData.fuel} onChange={e => updateField('fuel', e.target.value)}>
                    <option value="">Sélectionner</option>
                    <option value="Essence">Essence</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybride">Hybride</option>
                    <option value="Electrique">Electrique</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Boîte de vitesse</label>
                <select className="input-field" value={formData.transmission} onChange={e => updateField('transmission', e.target.value)}>
                    <option value="">Sélectionner</option>
                    <option value="Manuelle">Manuelle</option>
                    <option value="Automatique">Automatique</option>
                </select>
            </div>
            <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix (F CFA)</label>
                <input type="number" className="input-field" placeholder="Ex: 5000000" value={formData.price} onChange={e => updateField('price', e.target.value)} />
            </div>
        </div>
    )

    const renderRealEstateFields = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de bien</label>
                <select className="input-field" value={formData.propertyType} onChange={e => updateField('propertyType', e.target.value)}>
                    <option value="">Sélectionner</option>
                    <option value="Maison">Maison</option>
                    <option value="Appartement">Appartement</option>
                    <option value="Terrain">Terrain</option>
                    <option value="Bureau">Bureau</option>
                    <option value="Auberge">Auberge</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Surface (m²)</label>
                <input type="number" className="input-field" placeholder="Ex: 150" value={formData.surface} onChange={e => updateField('surface', e.target.value)} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Chambres</label>
                <input type="number" className="input-field" placeholder="Ex: 3" value={formData.rooms} onChange={e => updateField('rooms', e.target.value)} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salles de bain</label>
                <input type="number" className="input-field" placeholder="Ex: 2" value={formData.bathrooms} onChange={e => updateField('bathrooms', e.target.value)} />
            </div>
            <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix (F CFA) / Loyer</label>
                <input type="number" className="input-field" placeholder="Ex: 150000" value={formData.price} onChange={e => updateField('price', e.target.value)} />
            </div>
        </div>
    )

    const renderJobFields = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre du poste</label>
                <input type="text" className="input-field" placeholder="Ex: Commercial Senior B2B" value={formData.title} onChange={e => updateField('title', e.target.value)} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type de contrat</label>
                <select className="input-field" value={formData.contractType} onChange={e => updateField('contractType', e.target.value)}>
                    <option value="">Sélectionner</option>
                    <option value="CDI">CDI</option>
                    <option value="CDD">CDD</option>
                    <option value="Stage">Stage</option>
                    <option value="Freelance">Freelance</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Entreprise</label>
                <input type="text" className="input-field" placeholder="Ex: Green Ads Gabon" value={formData.company} onChange={e => updateField('company', e.target.value)} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salaire (F CFA) - Optionnel</label>
                <input type="text" className="input-field" placeholder="Ex: 250000 - 350000" value={formData.salary} onChange={e => updateField('salary', e.target.value)} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email de contact</label>
                <input type="email" className="input-field" placeholder="rh@entreprise.com" value={formData.email} onChange={e => updateField('email', e.target.value)} />
            </div>
        </div>
    )

    const renderDefaultFields = () => (
        <div className="space-y-4 mb-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre de l'annonce</label>
                <input type="text" className="input-field" placeholder="Ex: Vends canapé cuir" value={formData.title} onChange={e => updateField('title', e.target.value)} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix (F CFA)</label>
                <input type="number" className="input-field" placeholder="Ex: 50000" value={formData.price} onChange={e => updateField('price', e.target.value)} />
            </div>
        </div>
    )

    if (fetchingAd) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto pb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                {editAdId ? "Modifier l'annonce" : "Publier une annonce"}
            </h1>

            {/* Progress Steps */}
            <div className="flex justify-between items-center mb-12 relative px-4">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10" />
                {[1, 2, 3, 4].map((s) => (
                    <div key={s} className="flex flex-col items-center bg-gray-50 px-2 rounded-full z-10">
                        <div
                            className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors",
                                step >= s ? "bg-green-600 text-white" : "bg-gray-200 text-gray-500"
                            )}
                        >
                            {step > s ? <Check size={20} /> : s}
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">

                {/* Step 1: Category */}
                {step === 1 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.slug}
                                onClick={() => {
                                    updateField('category', cat.name)
                                    handleNext()
                                }}
                                className={cn(
                                    "p-4 rounded-lg border-2 text-center hover:border-green-500 hover:bg-green-50 transition-all flex flex-col items-center gap-2",
                                    formData.category === cat.name ? "border-green-600 bg-green-50 ring-1 ring-green-600" : "border-gray-200"
                                )}
                            >
                                <span className="font-semibold">{cat.name}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Step 2: Details (Dynamic Form) */}
                {step === 2 && (
                    <div className="space-y-6">
                        <div className="bg-green-50 p-4 rounded-lg border border-green-100 mb-6">
                            <span className="text-sm text-green-800">Catégorie sélectionnée : <strong>{formData.category}</strong></span>
                            <button onClick={() => setStep(1)} className="text-xs text-green-600 underline ml-2">Modifier</button>
                        </div>

                        {formData.category === 'Véhicules' && renderVehicleFields()}
                        {formData.category === 'Immobilier' && renderRealEstateFields()}
                        {formData.category === 'Emploi' && renderJobFields()}
                        {!['Véhicules', 'Immobilier', 'Emploi'].includes(formData.category) && renderDefaultFields()}

                        {renderCommonFields()}
                    </div>
                )}

                {/* Step 3: Photos & Plan */}
                {step === 3 && (
                    <div className="space-y-8">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-4">Ajouter des photos</h3>
                            {formData.category === 'Emploi' ? (
                                <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 text-center">
                                    <p className="text-gray-500 mb-2">Pour les offres d'emploi, vous pouvez ajouter votre logo.</p>
                                    <input type="file" className="block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-green-50 file:text-green-700
                                        hover:file:bg-green-100
                                    "/>
                                </div>
                            ) : (
                                <ImageUploader
                                    images={formData.images}
                                    onChange={files => updateField('images', files)}
                                    maxFiles={formData.plan === 'gratuit' ? 5 : 10}
                                />
                            )}
                        </div>

                        <div className="border-t border-gray-100 pt-8">
                            <h3 className="font-semibold text-gray-900 mb-4">Choisir un plan de visibilité</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {PLANS.map((plan) => (
                                    <button
                                        key={plan.id}
                                        onClick={() => updateField('plan', plan.id)}
                                        className={cn(
                                            "p-4 rounded-xl border-2 text-left transition-all relative",
                                            formData.plan === plan.id ? "border-green-600 bg-green-50 ring-1 ring-green-600" : "border-gray-200 hover:border-green-300"
                                        )}
                                    >
                                        <div className="font-bold text-gray-900">{plan.name}</div>
                                        <div className="text-xl font-bold text-green-700 my-1">{plan.price === 0 ? 'Gratuit' : `${plan.price} F`}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Validate */}
                {step === 4 && (
                    <div className="text-center">
                        <CheckCircle size={64} className="mx-auto text-green-600 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {editAdId ? "Confirmez-vous la modification ?" : "Confirmez-vous la publication ?"}
                        </h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Votre annonce "{formData.title}" sera {editAdId ? 'mise à jour' : 'publiée'} dans la catégorie {formData.category} à {formData.city}.
                        </p>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                    {step > 1 && (
                        <Button variant="outline" onClick={handleBack}>Retour</Button>
                    )}
                    <div className="ml-auto">
                        {step < 4 ? (
                            <Button onClick={handleNext} disabled={step === 1 && !formData.category}>
                                Continuer <ChevronRight size={16} className="ml-2" />
                            </Button>
                        ) : (
                            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700" disabled={loading}>
                                {loading ? <><Loader2 className="animate-spin mr-2" /> {editAdId ? 'Modification...' : 'Publication...'}</> : (editAdId ? 'Confirmer la modification' : 'Confirmer la publication')}
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .input-field {
                    @apply w-full p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none transition-shadow;
                }
            `}</style>
        </div>
    )
}
