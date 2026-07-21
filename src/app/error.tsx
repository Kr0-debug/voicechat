'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-danger/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-danger" />
        </div>
        <h2 className="text-xl font-semibold text-dark-50 mb-2">Coś poszło nie tak</h2>
        <p className="text-dark-400 text-sm mb-6">
          Wystąpił nieoczekiwany błąd. Spróbuj odświeżyć stronę.
        </p>
        <button
          onClick={reset}
          className="btn-primary inline-flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Spróbuj ponownie
        </button>
      </div>
    </div>
  )
}
