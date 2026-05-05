import { NextRequest } from 'next/server'

const TOTAL_KEY = 'anp-marathon-total'

function isJune2026OrLater() {
  const now = new Date()
  return now.getFullYear() > 2026 || (now.getFullYear() === 2026 && now.getMonth() >= 5)
}

function getTodayKey() {
  const d = new Date().toLocaleDateString('en-US', {
    timeZone: 'America/Detroit',
    year: 'numeric', month: '2-digit', day: '2-digit',
  })
  return `anp-marathon-${d.replace(/\//g, '-')}`
}

async function redisPipeline(commands: string[][]): Promise<Array<{ result: unknown }>> {
  const url   = (process.env.UPSTASH_REDIS_REST_URL   ?? '').trim()
  const token = (process.env.UPSTASH_REDIS_REST_TOKEN ?? '').trim()
  if (!url || !token) return []
  const res = await fetch(`${url}/pipeline`, {
    method:  'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body:    JSON.stringify(commands),
    cache:   'no-store',
  })
  return res.json()
}

export async function GET() {
  try {
    const key  = isJune2026OrLater() ? getTodayKey() : TOTAL_KEY
    const data = await redisPipeline([['GET', key]])
    const count = Number(data[0]?.result) || 0
    return Response.json({ count, isLive: isJune2026OrLater() })
  } catch {
    return Response.json({ count: 0, isLive: false })
  }
}

export async function POST(_req: NextRequest) {
  try {
    if (isJune2026OrLater()) {
      // June+: daily key with 25h expiry
      const key  = getTodayKey()
      const data = await redisPipeline([['INCR', key], ['EXPIRE', key, '90000']])
      return Response.json({ count: Number(data[0]?.result) || 0, isLive: true })
    } else {
      // Pre-June: permanent total counter, no expiry
      const data = await redisPipeline([['INCR', TOTAL_KEY]])
      return Response.json({ count: Number(data[0]?.result) || 0, isLive: false })
    }
  } catch {
    return Response.json({ count: 0, isLive: false })
  }
}
