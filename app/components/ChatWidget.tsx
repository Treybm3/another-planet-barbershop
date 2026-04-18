'use client'

import { useState, useRef, useEffect } from 'react'
import { X, MessageCircle, Send, Scissors, CalendarCheck } from 'lucide-react'

type Message = { role: 'user' | 'assistant'; content: string }

const SUGGESTIONS = [
  'What services do you offer?',
  'How much is a fade?',
  'What are your hours?',
  'I want to book an appointment',
]

// Render assistant message — turns [BOOK_LINK] into a styled button
function MessageContent({ text }: { text: string }) {
  const parts = text.split('[BOOK_LINK]')
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <a
              href="#contact"
              onClick={() => window.scrollTo({ top: document.getElementById('contact')?.offsetTop ?? 0, behavior: 'smooth' })}
              className="mt-2 flex items-center gap-2 text-white text-xs font-bold px-4 py-2 rounded-full transition w-fit"
              style={{ background: 'var(--color-cta)' }}
            >
              <CalendarCheck size={13} />
              Book an Appointment →
            </a>
          )}
        </span>
      ))}
    </>
  )
}

export default function ChatWidget() {
  const [open, setOpen]           = useState(false)
  const [messages, setMessages]   = useState<Message[]>([])
  const [input, setInput]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [showLabel, setShowLabel] = useState(true)
  const bottomRef                 = useRef<HTMLDivElement>(null)
  const inputRef                  = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open) {
      setShowLabel(false)
      setTimeout(() => inputRef.current?.focus(), 120)
    }
  }, [open])

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const next: Message[] = [...messages, { role: 'user', content: trimmed }]
    setMessages(next)
    setInput('')
    setLoading(true)
    setMessages(m => [...m, { role: 'assistant', content: '' }])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next.map(m => ({ role: m.role, content: m.content })) }),
      })

      if (!res.body) throw new Error('No stream')
      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        setMessages(m => {
          const copy = [...m]
          copy[copy.length - 1] = { ...copy[copy.length - 1], content: copy[copy.length - 1].content + chunk }
          return copy
        })
      }
    } catch {
      setMessages(m => {
        const copy = [...m]
        copy[copy.length - 1] = { ...copy[copy.length - 1], content: "Sorry, something went wrong. Give us a call to book your appointment!" }
        return copy
      })
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) }
  }

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-3">
        {showLabel && !open && (
          <div className="text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg whitespace-nowrap animate-pulse border" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            💬 Chat with us
          </div>
        )}
        <div className="relative">
          {!open && (
            <span className="absolute inset-0 rounded-full opacity-40 animate-ping" style={{ background: 'var(--color-cta)' }} />
          )}
          <button
            onClick={() => setOpen(o => !o)}
            aria-label="Open chat"
            className="relative w-14 h-14 rounded-full text-white flex items-center justify-center shadow-xl transition-transform hover:scale-105 active:scale-95"
            style={{ background: 'var(--color-cta)' }}
          >
            {open ? <X size={20} /> : <MessageCircle size={22} strokeWidth={2.2} />}
          </button>
        </div>
      </div>

      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-24 right-3 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[340px] md:w-[380px] max-w-[400px] rounded-2xl overflow-hidden shadow-2xl flex flex-col border"
          style={{ height: '480px', background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 border-b shrink-0" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--color-cta)' }}>
              <Scissors size={14} className="text-white" />
            </div>
            <div>
              <div className="text-white text-sm font-bold leading-tight">Another Planet Barbershop</div>
              <div className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>AI Assistant · replies instantly</div>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto transition hover:text-white" style={{ color: 'var(--color-text-dim)' }}>
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
            {messages.length === 0 && (
              <div className="flex flex-col gap-3">
                <div className="text-sm rounded-2xl rounded-tl-sm px-4 py-3 max-w-[85%] leading-relaxed" style={{ background: 'var(--color-surface)', color: 'var(--color-text-muted)' }}>
                  Hey! 👋 I'm Another Planet's assistant. Ask me about cuts, pricing, or booking.
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {SUGGESTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-xs px-3 py-1.5 rounded-full transition border"
                      style={{ background: 'rgba(59,130,246,0.08)', borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="text-sm px-4 py-2.5 rounded-2xl max-w-[85%] leading-relaxed whitespace-pre-wrap"
                  style={
                    m.role === 'user'
                      ? { background: 'var(--color-cta)', color: '#fff', borderRadius: '1rem 1rem 0.25rem 1rem' }
                      : { background: 'var(--color-surface)', color: 'var(--color-text-muted)', borderRadius: '0.25rem 1rem 1rem 1rem' }
                  }
                >
                  {m.role === 'assistant' ? <MessageContent text={m.content} /> : m.content}
                </div>
              </div>
            ))}

            {loading && messages[messages.length - 1]?.content === '' && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl flex gap-1 items-center" style={{ background: 'var(--color-surface)' }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--color-text-muted)', animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--color-text-muted)', animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--color-text-muted)', animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t shrink-0 flex gap-2 items-center" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask anything…"
              disabled={loading}
              className="flex-1 text-white text-sm placeholder-slate-600 px-4 py-2.5 rounded-full focus:outline-none disabled:opacity-50 transition border"
              style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-full disabled:opacity-40 flex items-center justify-center transition shrink-0 text-white"
              style={{ background: 'var(--color-cta)' }}
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
