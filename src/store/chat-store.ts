import { create } from 'zustand'
import type { Message, Room, Profile, VoiceCallState } from '@/types'

interface ChatState {
  // Auth
  user: Profile | null
  setUser: (user: Profile | null) => void

  // Rooms
  rooms: Room[]
  activeRoomId: string | null
  setRooms: (rooms: Room[]) => void
  setActiveRoom: (roomId: string) => void

  // Messages
  messages: Message[]
  setMessages: (messages: Message[]) => void
  addMessage: (message: Message) => void

  // Voice
  voiceCall: VoiceCallState
  setVoiceCall: (state: Partial<VoiceCallState>) => void
  resetVoiceCall: () => void

  // Sidebar
  isSidebarOpen: boolean
  toggleSidebar: () => void
}

const defaultVoiceCall: VoiceCallState = {
  isCalling: false,
  isMuted: false,
  isSpeakerOn: false,
  peerId: null,
  status: 'idle',
}

export const useChatStore = create<ChatState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  rooms: [],
  activeRoomId: null,
  setRooms: (rooms) => set({ rooms }),
  setActiveRoom: (roomId) => set({ activeRoomId: roomId }),

  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),

  voiceCall: defaultVoiceCall,
  setVoiceCall: (partial) =>
    set((state) => ({ voiceCall: { ...state.voiceCall, ...partial } })),
  resetVoiceCall: () => set({ voiceCall: defaultVoiceCall }),

  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}))
