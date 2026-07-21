'use client'

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useChatStore } from '@/store/chat-store'
import { useAuth } from '@/hooks/use-auth'
import { Send, Hash } from 'lucide-react'

const MESSAGES_TABLE = 'my_portfolio.vc_messages'

export function MessageInput() {
  const [content, setContent] = useState('')
  const { activeRoomId } = useChatStore()
  const { user } = useAuth()
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const sendMessage = async () => {
    if (!content.trim() || !activeRoomId || !user) return

    const { error } = await supabase.from(MESSAGES_TABLE).insert({
      room_id: activeRoomId,
      sender_id: user.id,
      content: content.trim(),
      type: 'text',
    })

    if (!error) {
      setContent('')
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!activeRoomId) return null

  return (
    <div className="border-t border-dark-700/50 p-4">
      <div className="flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Napisz wiadomość... (Enter aby wysłać, Shift+Enter nowa linia)"
            rows={1}
            className="input-field resize-none pr-10 py-3 min-h-[44px] max-h-32"
            style={{ height: 'auto' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement
              target.style.height = 'auto'
              target.style.height = Math.min(target.scrollHeight, 128) + 'px'
            }}
          />
          {!content && (
            <Hash className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-500" />
          )}
        </div>
        <button
          onClick={sendMessage}
          disabled={!content.trim()}
          className="btn-primary p-3 flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
