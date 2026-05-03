import { kv } from '@vercel/kv'
import { NextRequest, NextResponse } from 'next/server'

function today() {
  return new Date().toISOString().slice(0, 10)
}

function thisMonth() {
  return new Date().toISOString().slice(0, 7)
}

export async function POST(req: NextRequest) {
  try {
    const { event } = await req.json()
    if (!['view', 'booksy', 'chat'].includes(event)) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    const day   = today()
    const month = thisMonth()

    await Promise.all([
      kv.incr(`anp:${event}:total`),
      kv.incr(`anp:${event}:${day}`),
      kv.incr(`anp:${event}:${month}`),
      kv.sadd('anp:months', month),
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

    const months: string[] = ((await kv.smembers('anp:months')) as string[]).sort()

    const baseKeys = ['anp:view:total', 'anp:booksy:total', 'anp:chat:total']
    const dayKeys  = [
      ...days.map(d => `anp:view:${d}`),
      ...days.map(d => `anp:booksy:${d}`),
      ...days.map(d => `anp:chat:${d}`),
    ]
    const monthKeys = [
      ...months.map(m => `anp:view:${m}`),
      ...months.map(m => `anp:booksy:${m}`),
      ...months.map(m => `anp:chat:${m}`),
    ]

    const values = await kv.mget<number[]>(...baseKeys, ...dayKeys, ...monthKeys)

    const totals = {
      views:  values[0] ?? 0,
      booksy: values[1] ?? 0,
      chat:   values[2] ?? 0,
    }

    const daily = days.map((date, i) => ({
      date,
      views:  values[3 + i]      ?? 0,
      booksy: values[3 + 7 + i]  ?? 0,
      chat:   values[3 + 14 + i] ?? 0,
    }))

    const base = 3 + days.length * 3
    const monthly = months.map((month, i) => ({
      month,
      views:  values[base + i]                   ?? 0,
      booksy: values[base + months.length + i]   ?? 0,
      chat:   values[base + months.length * 2 + i] ?? 0,
    }))

    return NextResponse.json({ totals, daily, monthly })
  } catch {
    return NextResponse.json({ totals: { views: 0, booksy: 0, chat: 0 }, daily: [], monthly: [] })
  }
}
