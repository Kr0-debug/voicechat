'use client'

import { useChatStore } from '@/store/chat-store'
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Loader2,
} from 'lucide-react'

export function VoiceControls() {
  const { voiceCall, setVoiceCall, resetVoiceCall, activeRoomId } = useChatStore()

  const toggleCall = () => {
    if (voiceCall.status === 'idle') {
      setVoiceCall({
        isCalling: true,
        status: 'connecting',
        peerId: `peer-${Date.now()}`,
      })
      setTimeout(() => {
        setVoiceCall({ status: 'connected', isCalling: false })
      }, 2000)
    }
  }

  if (!activeRoomId) return null

  return (
    <div className="flex items-center gap-1">
      {/* Join/Leave Call */}
      {voiceCall.status === 'idle' ? (
        <button
          onClick={toggleCall}
          className="btn-icon text-success hover:bg-success/10 group relative"
          title="Dołącz do rozmowy"
        >
          <Phone className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-success animate-pulse" />
        </button>
      ) : (
        <button
          onClick={resetVoiceCall}
          className="btn-icon text-danger hover:bg-danger/10"
          title="Rozłącz"
        >
          <PhoneOff className="w-4 h-4" />
        </button>
      )}

      {/* Mute Toggle */}
      {voiceCall.status === 'connected' && (
        <>
          <button
            onClick={() => setVoiceCall({ isMuted: !voiceCall.isMuted })}
            className={`btn-icon ${
              voiceCall.isMuted ? 'text-danger hover:bg-danger/10' : 'text-dark-300 hover:bg-dark-700'
            }`}
            title={voiceCall.isMuted ? 'Wycisz mikrofon' : 'Odcisz mikrofon'}
          >
            {voiceCall.isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Speaker Toggle */}
          <button
            onClick={() => setVoiceCall({ isSpeakerOn: !voiceCall.isSpeakerOn })}
            className={`btn-icon ${
              voiceCall.isSpeakerOn ? 'text-accent-400' : 'text-dark-300 hover:bg-dark-700'
            }`}
            title={voiceCall.isSpeakerOn ? 'Wyłącz głośnik' : 'Włącz głośnik'}
          >
            {voiceCall.isSpeakerOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Connection Status */}
          {voiceCall.status === 'connecting' && (
            <div className="flex items-center gap-1.5 text-xs text-warning ml-2">
              <Loader2 className="w-3 h-3 animate-spin" />
              Łączenie...
            </div>
          )}
          {voiceCall.status === 'connected' && (
            <div className="flex items-center gap-1.5 text-xs text-success ml-2">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              Połączono
            </div>
          )}
        </>
      )}
    </div>
  )
}
