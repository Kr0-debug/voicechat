'use client'

import { useEffect } from 'react'
import { Sidebar } from '@/components/layout/sidebar'
import { MessageList } from '@/components/chat/message-list'
import { MessageInput } from '@/components/chat/message-input'
import { VoiceControls } from '@/components/voice/voice-controls'
import { useChatStore } from '@/store/chat-store'
import { useAuth } from '@/hooks/use-auth'
import { useRealtimeMessages, useRealtimePresence } from '@/hooks/use-realtime'
import { supabase } from '@/lib/supabase'
import {
  Menu,
  Users,
  Hash,
  MoreVertical,
  LogIn,
  Github,
  Mail,
  Lock,
  UserPlus,
} from 'lucide-react'
import { useState } from 'react'

function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (isSignUp) {
        if (!username.trim()) {
          throw new Error('Nazwa użytkownika jest wymagana')
        }
        if (password.length < 6) {
          throw new Error('Hasło musi mieć co najmniej 6 znaków')
        }
        await signUp(email, password, username)
      } else {
        await signIn(email, password)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-accent-600 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-accent-600/30">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-dark-50">VoiceChat</h1>
          <p className="text-dark-400 mt-2">Bezpieczny, prywatny komunikator</p>
        </div>

        {/* Form */}
        <div className="glass-panel p-6">
          <div className="flex gap-1 mb-6 bg-dark-800 rounded-xl p-1">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                !isSignUp
                  ? 'bg-dark-700 text-dark-50 shadow-sm'
                  : 'text-dark-400 hover:text-dark-200'
              }`}
            >
              Zaloguj się
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                isSignUp
                  ? 'bg-dark-700 text-dark-50 shadow-sm'
                  : 'text-dark-400 hover:text-dark-200'
              }`}
            >
              Rejestracja
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm text-dark-300 mb-1.5">Nazwa użytkownika</label>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                  <input
                    type="text"
                    placeholder="np. janek123"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-field pl-9"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm text-dark-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  type="email"
                  placeholder="twoj@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-9"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-dark-300 mb-1.5">Hasło</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                <input
                  type="password"
                  placeholder="Min. 6 znaków"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-9"
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-danger bg-danger/10 px-3 py-2 rounded-lg animate-fade-in">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {isSignUp ? 'Rejestracja...' : 'Logowanie...'}
                </>
              ) : (
                isSignUp ? 'Utwórz konto' : 'Zaloguj się'
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dark-700" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-dark-900 px-2 text-dark-400">lub</span>
              </div>
            </div>

            <button className="w-full mt-4 btn-secondary flex items-center justify-center gap-2 py-2.5">
              <Github className="w-4 h-4" />
              Kontynuuj z GitHub
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-dark-500 mt-6">
          Bezpieczny WebRTC &bull; Szyfrowany czat &bull; Prywatność
        </p>
      </div>
    </div>
  )
}

function ChatLayout() {
  const { user } = useAuth()
  const {
    activeRoomId,
    rooms,
    setActiveRoom,
    isSidebarOpen,
    toggleSidebar,
  } = useChatStore()

  useRealtimeMessages(activeRoomId)
  useRealtimePresence(activeRoomId)

  const activeRoom = rooms.find((r) => r.id === activeRoomId)

  if (!user) return <AuthScreen />

  return (
    <div className="flex h-screen bg-dark-950 overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-14 flex items-center justify-between px-4 border-b border-dark-700/50 bg-dark-900/50 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              onClick={toggleSidebar}
              className="btn-icon text-dark-400 hover:text-dark-200 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            {activeRoom ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-accent-600/20 flex items-center justify-center">
                    <Hash className="w-4 h-4 text-accent-400" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-dark-50">{activeRoom.name}</h2>
                    <p className="text-[10px] text-dark-400">Pokój głosowy</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-sm text-dark-400">
                Wybierz pokój, aby rozpocząć rozmowę
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <VoiceControls />
            <div className="w-px h-6 bg-dark-700 mx-1" />
            <button className="btn-icon text-dark-400 hover:text-dark-200" title="Uczestnicy">
              <Users className="w-4 h-4" />
            </button>
            <button className="btn-icon text-dark-400 hover:text-dark-200" title="Opcje">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Messages Area */}
        {activeRoom ? (
          <>
            <MessageList />
            <MessageInput />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-dark-500 px-4">
            <div className="w-20 h-20 rounded-2xl bg-dark-800 flex items-center justify-center mb-6">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-dark-300 mb-2">Witaj w VoiceChat</h3>
            <p className="text-sm text-center max-w-md">
              Wybierz pokój z panelu bocznego lub utwórz nowy, aby rozpocząć rozmowę tekstową lub głosową.
            </p>
            <div className="flex gap-3 mt-6">
              <div className="flex items-center gap-2 text-xs bg-dark-800 px-3 py-2 rounded-lg">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-400" />
                Szyfrowane
              </div>
              <div className="flex items-center gap-2 text-xs bg-dark-800 px-3 py-2 rounded-lg">
                <div className="w-1.5 h-1.5 rounded-full bg-success" />
                WebRTC
              </div>
              <div className="flex items-center gap-2 text-xs bg-dark-800 px-3 py-2 rounded-lg">
                <div className="w-1.5 h-1.5 rounded-full bg-warning" />
                Peer-to-Peer
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Home() {
  return <ChatLayout />
}
