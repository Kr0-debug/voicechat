import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl font-bold text-accent-600 mb-4">404</div>
        <h2 className="text-xl font-semibold text-dark-50 mb-2">Strona nie znaleziona</h2>
        <p className="text-dark-400 text-sm mb-8">
          Strona, której szukasz, nie istnieje lub została przeniesiona.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/" className="btn-primary inline-flex items-center gap-2">
            <Home className="w-4 h-4" />
            Strona główna
          </Link>
        </div>
      </div>
    </div>
  )
}
