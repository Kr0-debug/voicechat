'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useChatStore } from '@/store/chat-store'
import type { Message } from '@/types'

export function useRealtimeMessages(roomId: string | null) {
  const addMessage = useChatStore((state) => state.addMessage)
  const setMessages = useChatStore((state) => state.setMessages)

  useEffect(() => {
    if (!roomId) return

    const loadMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*, sender:profiles(*)')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })

      if (data) setMessages(data as unknown as Message[])
    }

    loadMessages()

    const channel = supabase
      .channel(`room:${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          addMessage(payload.new as unknown as Message)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId, addMessage, setMessages])
}

export function useRealtimeRooms() {
  const setRooms = useChatStore((state) => state.setRooms)

  useEffect(() => {
    const loadRooms = async () => {
      const { data } = await supabase.from('rooms').select('*').order('created_at', { ascending: false })
      if (data) setRooms(data)
    }

    loadRooms()

    const channel = supabase
      .channel('rooms')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rooms' },
        () => loadRooms()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [setRooms])
}

export function useRealtimePresence(roomId: string | null) {
  useEffect(() => {
    if (!roomId) return

    const channel = supabase.channel(`presence:${roomId}`, {
      config: {
        presence: { key: roomId },
      },
    } as any)

    channel.subscribe(async (status) => {
      if (status !== 'SUBSCRIBED') return

      await channel.track({
        online_at: new Date().toISOString(),
      })
    })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [roomId])
}
