'use client'

import { useEffect, useRef } from 'react'
import { useChatStore } from '@/store/chat-store'
import { useAuth } from '@/hooks/use-auth'
import { formatDistanceToNow } from '@/lib/format-date'

export function MessageList() {
  const messages = useChatStore((state) => state.messages)
  const { user } = useAuth()
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-dark-500">
        <div className="w-16 h-16 rounded-2xl bg-dark-800 flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <p className="text-sm font-medium">Brak wiadomości</p>
        <p className="text-xs mt-1">Wyślij pierwszą wiadomość, aby rozpocząć rozmowę</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
      {messages.map((message) => {
        const isOwn = message.sender_id === user?.id
        const isSystem = message.type === 'system'

        if (isSystem) {
          return (
            <div key={message.id} className="flex justify-center animate-fade-in">
              <span className="text-xs text-dark-500 bg-dark-800/50 px-3 py-1 rounded-full">
                {message.content}
              </span>
            </div>
          )
        }

        return (
          <div
            key={message.id}
            className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : ''} animate-slide-up`}
          >
            {/* Avatar */}
            {!isOwn && (
              <div className="w-8 h-8 rounded-xl bg-accent-600/20 flex items-center justify-center text-xs font-medium text-accent-400 flex-shrink-0">
                {message.sender?.username?.charAt(0).toUpperCase() || '?'}
              </div>
            )}

            {/* Message */}
            <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[75%]`}>
              {!isOwn && message.sender && (
                <span className="text-xs text-dark-400 mb-1 ml-1">{message.sender.username}</span>
              )}
              <div className={isOwn ? 'message-own' : 'message-other'}>
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
              <span className="text-[10px] text-dark-500 mt-1 px-1">
                {formatDistanceToNow(new Date(message.created_at))}
              </span>
            </div>
          </div>
        )
      })}
      <div ref={bottomRef} />
    </div>
  )
}
