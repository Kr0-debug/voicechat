export interface Profile {
  id: string
  username: string
  avatar_url: string | null
  status: 'online' | 'offline' | 'away'
  created_at: string
}

export interface Room {
  id: string
  name: string
  created_by: string
  is_private: boolean
  created_at: string
}

export interface Message {
  id: string
  room_id: string
  sender_id: string
  content: string
  type: 'text' | 'voice' | 'system'
  created_at: string
  sender?: Profile
}

export interface VoiceCallState {
  isCalling: boolean
  isMuted: boolean
  isSpeakerOn: boolean
  peerId: string | null
  status: 'idle' | 'connecting' | 'connected' | 'disconnected'
}

export interface Participant {
  id: string
  profile: Profile
  isSpeaking: boolean
  isMuted: boolean
}
