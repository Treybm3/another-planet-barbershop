'use client'

import { useState, useEffect } from 'react'
import { Scissors, Lock } from 'lucide-react'

export default function AdminPage() {
  const [pin,       setPin]       = useState('')
  const [authed,    setAuthed]    = useState(false)
  const [available, setAvailable] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [saved,     setSaved]     = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem('anp_admin_authed')
    if (stored === 'true') {
      setAuthed(true)
      fetchStatus()
    }
  }, [])

  async function fetchStatus() {
    const res  = await fetch('/api/availability', { cache: 'no-store' })
    const data = await res.json()
    setAvailable(data.available)
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/availability', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ pin, available: false }),
    })
    if (res.status === 401) {
      setError('Wrong PIN — try again')
      setLoading(false)
      return
    }
    sessionStorage.setItem('anp_admin_authed', 'true')
    setAuthed(true)
    await fetchStatus()
    setLoading(false)
  }

  async function toggle() {
    setLoading(true)
    setSaved(false)
    const next = !available
    const res  = await fetch('/api/availability', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ pin: sessionStorage.getItem('anp_pin') ?? pin, available: next }),
    })
    if (res.ok) {
      setAvailable(next)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
    setLoading(false)
  }

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6" style={{ background: '#080808' }}>
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#f97316' }}>
              <Scissors size={16} className="text-white" />
            </div>
            <span className="text-white font-bold tracking-wide">Another Planet · Admin</span>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border" style={{ background: '#111', borderColor: 'rgba(255,255,255,0.08)' }}>
              <Lock size={14} style={{ color: '#52525b' }} />
              <input
                type="password"
                placeholder="Enter PIN"
                value={pin}
                onChange={e => setPin(e.target.value)}
                className="bg-transparent text-white text-sm flex-1 focus:outline-none placeholder-zinc-700"
                autoFocus
              />
            </div>
            {error && <p className="text-xs text-center" style={{ color: '#f87171' }}>{error}</p>}
            <button
              type="submit"
              disabled={!pin || loading}
              className="py-3.5 rounded-2xl text-white font-bold text-sm tracking-wide transition disabled:opacity-40"
              style={{ background: '#f97316' }}
            >
              {loading ? '…' : 'Enter'}
            </button>
          </form>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6" style={{ background: '#080808' }}>
      <div className="w-full max-w-sm flex flex-col items-center gap-8">

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#f97316' }}>
            <Scissors size={16} className="text-white" />
          </div>
          <span className="text-white font-bold tracking-wide">Another Planet · Admin</span>
        </div>

        {/* Big toggle */}
        <div
          className="w-full rounded-3xl p-8 flex flex-col items-center gap-6 border"
          style={{ background: '#111', borderColor: 'rgba(255,255,255,0.06)' }}
        >
          <div className="text-center">
            <div
              className="text-2xl font-black mb-1"
              style={{ color: available ? '#4ade80' : '#f87171' }}
            >
              {available ? 'Taking Walk-ins' : 'Fully Booked'}
            </div>
            <div className="text-xs" style={{ color: '#52525b' }}>
              {available ? 'Clients can see you\'re open' : 'Clients see you\'re not taking walk-ins'}
            </div>
          </div>

          {/* Toggle switch */}
          <button
            onClick={toggle}
            disabled={loading}
            className="relative w-20 h-10 rounded-full transition-all duration-300 disabled:opacity-60"
            style={{ background: available ? '#16a34a' : '#3f3f46' }}
          >
            <span
              className="absolute top-1 w-8 h-8 rounded-full bg-white shadow-md transition-all duration-300"
              style={{ left: available ? '2.75rem' : '0.25rem' }}
            />
          </button>

          {saved && (
            <p className="text-xs font-semibold" style={{ color: '#4ade80' }}>✓ Updated</p>
          )}
        </div>

        <p className="text-xs text-center" style={{ color: '#3f3f46' }}>
          Bookmark this page on your phone for quick access
        </p>
      </div>
    </main>
  )
}
