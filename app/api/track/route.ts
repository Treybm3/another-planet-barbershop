import { kv } from '@vercel/kv'
import { NextRequest, NextResponse } from 'next/server'

function today() {
  return new Date().toISOString().slice(0, 10)
}

export async function POST(req: NextRequest) {
  try {
    const { event } = await req.json()
    if (!['view', 'booksy', 'chat'].includes(event)) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    const day = today()
    await Promise.all([
      kv.incr(`anp:${event}:total`),
      kv.incr(`anp:${event}:${day}`),
    ])

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

export async function GET() {
  try {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - i)
      return d.toISOString().slice(0, 10)
    }).reverse()

    const keys = [
      'anp:view:total', 'anp:booksy:total', 'anp:chat:total',
      ...days.map(d => `anp:view:${d}`),
      ...days.map(d => `anp:booksy:${d}`),
      ...days.map(d => `anp:chat:${d}`),
    ]

    const values = await kv.mget<number[]>(...keys)

    const totals = {
      views:  values[0] ?? 0,
      booksy: values[1] ?? 0,
      chat:   values[2] ?? 0,
    }

    const daily = days.map((date, i) => ({
      date,
      views:  values[3 + i]          ?? 0,
      booksy: values[3 + 7 + i]      ?? 0,
      chat:   values[3 + 14 + i]     ?? 0,
    }))

    return NextResponse.json({ totals, daily })
  } catch {
    return NextResponse.json({ totals: { views: 0, booksy: 0, chat: 0 }, daily: [] })
  }
}
