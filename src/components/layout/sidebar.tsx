'use client'

import { useState } from 'react'
import { useChatStore } from '@/store/chat-store'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/use-auth'
import { useRealtimeRooms } from '@/hooks/use-realtime'
import {
  MessageSquare,
  Plus,
  LogOut,
  Users,
  Search,
  Settings,
  Headphones,
  Mic,
  MicOff,
  PhoneOff,
} from 'lucide-react'

const ROOMS_TABLE = 'my_portfolio.vc_rooms'

export function Sidebar() {
  const { user, signOut } = useAuth()
  const { rooms, activeRoomId, setActiveRoom, voiceCall, setVoiceCall, resetVoiceCall, isSidebarOpen } = useChatStore()
  const [showNewRoom, setShowNewRoom] = useState(false)
  const [newRoomName, setNewRoomName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useRealtimeRooms()

  const createRoom = async () => {
    if (!newRoomName.trim() || !user) return

    const { error } = await supabase.from(ROOMS_TABLE).insert({
      name: newRoomName.trim(),
      created_by: user.id,
      is_private: false,
    })

    if (!error) {
      setNewRoomName('')
      setShowNewRoom(false)
    }
  }

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!isSidebarOpen) return null

  return (
    <aside className="w-80 h-screen flex flex-col bg-dark-900 border-r border-dark-700/50">
      {/* Header */}
      <div className="p-4 border-b border-dark-700/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-accent-600 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-dark-50">VoiceChat</h1>
          </div>
          <button
            onClick={() => setShowNewRoom(!showNewRoom)}
            className="btn-icon text-dark-300 hover:text-accent-400 hover:bg-accent-600/10"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
          <input
            type="text"
            placeholder="Szukaj rozmowy..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-9 py-2 text-sm"
          />
        </div>

        {/* New Room Input */}
        {showNewRoom && (
          <div className="mt-3 animate-fade-in">
            <input
              type="text"
              placeholder="Nazwa nowego pokoju..."
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              className="input-field py-2 text-sm mb-2"
              onKeyDown={(e) => e.key === 'Enter' && createRoom()}
            />
            <div className="flex gap-2">
              <button onClick={createRoom} className="btn-primary flex-1 text-sm py-1.5">
                Utwórz
              </button>
              <button
                onClick={() => setShowNewRoom(false)}
                className="btn-secondary flex-1 text-sm py-1.5"
              >
                Anuluj
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Rooms List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {filteredRooms.map((room) => (
          <button
            key={room.id}
            onClick={() => setActiveRoom(room.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
              activeRoomId === room.id
                ? 'bg-accent-600/10 text-accent-300 border border-accent-600/20'
                : 'text-dark-200 hover:bg-dark-800 hover:text-dark-50 border border-transparent'
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium ${
                activeRoomId === room.id
                  ? 'bg-accent-600 text-white'
                  : 'bg-dark-800 text-dark-300 group-hover:bg-dark-700'
              }`}
            >
              {room.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium truncate">{room.name}</p>
              <p className="text-xs text-dark-400 truncate">Pokój głosowy</p>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-dark-500" />
              <span className="text-xs text-dark-500">0</span>
            </div>
          </button>
        ))}

        {filteredRooms.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-dark-500">
            <MessageSquare className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-sm">Brak rozmów</p>
            <p className="text-xs mt-1">Utwórz nowy pokój, aby rozpocząć</p>
          </div>
        )}
      </div>

      {/* Voice Call Status */}
      {voiceCall.status !== 'idle' && (
        <div className="mx-2 mb-2 p-3 glass-card animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-medium text-success">Połączono</span>
            </div>
            <button
              onClick={() => setVoiceCall({ isMuted: !voiceCall.isMuted })}
              className="btn-icon text-dark-300 hover:text-accent-400"
            >
              {voiceCall.isMuted ? <MicOff className="w-4 h-4 text-danger" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 bg-dark-700 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-accent-500 rounded-full" />
            </div>
            <button
              onClick={resetVoiceCall}
              className="btn-icon text-danger hover:bg-danger/10"
            >
              <PhoneOff className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* User Profile */}
      <div className="p-3 border-t border-dark-700/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-accent-600/20 flex items-center justify-center text-sm font-medium text-accent-400">
              {user?.username?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-success border-2 border-dark-900" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-dark-100 truncate">
              {user?.username || 'Gość'}
            </p>
            <p className="text-xs text-dark-400">Online</p>
          </div>
          <button onClick={signOut} className="btn-icon text-dark-400 hover:text-danger">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
