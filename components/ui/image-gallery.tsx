'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageGalleryProps {
    images: string[]
    title: string
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0)

    // Use placeholder if no images
    const displayImages = images.length > 0 ? images : ['/placeholder-image.jpg']

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % displayImages.length)
    }

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative aspect-[4/3] w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group">
                <Image
                    src={displayImages[currentIndex]}
                    alt={`${title} - image ${currentIndex + 1}`}
                    fill
                    className="object-contain"
                    priority
                />

                {displayImages.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {displayImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {displayImages.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={cn(
                                "relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all",
                                currentIndex === index ? "border-green-600 ring-1 ring-green-600" : "border-transparent hover:border-gray-300"
                            )}
                        >
                            <Image
                                src={img}
                                alt={`${title} thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
