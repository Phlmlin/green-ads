'use client'

import React, { useCallback, useState } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ImageUploaderProps {
    images: File[]
    onChange: (files: File[]) => void
    maxFiles?: number
}

export function ImageUploader({ images, onChange, maxFiles = 5 }: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false)

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        if (e.dataTransfer.files?.length) {
            const newFiles = Array.from(e.dataTransfer.files).filter(
                file => file.type.startsWith('image/')
            )

            if (images.length + newFiles.length > maxFiles) {
                alert(`Vous ne pouvez télécharger que ${maxFiles} images maximum`)
                return
            }

            onChange([...images, ...newFiles])
        }
    }, [images, maxFiles, onChange])

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            const newFiles = Array.from(e.target.files)

            if (images.length + newFiles.length > maxFiles) {
                alert(`Vous ne pouvez télécharger que ${maxFiles} images maximum`)
                return
            }

            onChange([...images, ...newFiles])
        }
    }

    const removeImage = (index: number) => {
        const newImages = [...images]
        newImages.splice(index, 1)
        onChange(newImages)
    }

    return (
        <div className="space-y-4">
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
                    isDragging ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-green-400",
                    images.length >= maxFiles && "opacity-50 cursor-not-allowed"
                )}
            >
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileInput}
                    disabled={images.length >= maxFiles}
                    className="hidden"
                    id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer block w-full h-full">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                        <Upload size={24} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">Glissez vos photos ici</h3>
                    <p className="text-sm text-gray-500 mt-2">ou cliquez pour parcourir</p>
                    <p className="text-xs text-gray-400 mt-4">JPG, PNG jusqu'à 5MB ({images.length}/{maxFiles})</p>
                </label>
            </div>

            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((file, index) => (
                        <div key={index} className="relative aspect-square rounded-md overflow-hidden border border-gray-200 group">
                            <Image
                                src={URL.createObjectURL(file)}
                                alt={`Preview ${index}`}
                                fill
                                className="object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-white/80 hover:bg-red-500 hover:text-white rounded-full p-1 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
