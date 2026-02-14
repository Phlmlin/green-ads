'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4 text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Une erreur est survenue !</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        Nous sommes désolés, mais quelque chose s'est mal passé. {error.message && <span className="block mt-2 text-sm text-red-500 bg-red-50 p-2 rounded">Détails: {error.message}</span>}
      </p>
      <div className="flex gap-4">
        <Button
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Réessayer
        </Button>
        <Button variant="outline" onClick={() => window.location.href = '/'}>
          Retour à l'accueil
        </Button>
      </div>
    </div>
  )
}
