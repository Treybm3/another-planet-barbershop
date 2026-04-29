import { NextRequest } from 'next/server'

function getTodayKey() {
  const d = new Date().toLocaleDateString('en-US', {
    timeZone: 'America/Detroit',
    year: 'numeric', month: '2-digit', day: '2-digit',
  })
  return `anp:marathon:${d}`
}

async function redisGet(key: string): Promise<number> {
  const url  = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return 0
  const res  = await fetch(`${url}/get/${key}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
  const data = await res.json()
  return Number(data.result) || 0
}

async function redisIncr(key: string): Promise<number> {
  const url  = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return 0
  // Pipeline: INCR + EXPIRE (90000s ≈ 25 hours)
  const res = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify([
      ['INCR', key],
      ['EXPIRE', key, 90000],
    ]),
  })
  const data = await res.json()
  return Number(data[0]?.result) || 0
}

export async function GET() {
  try {
    const count = await redisGet(getTodayKey())
    return Response.json({ count })
  } catch {
    return Response.json({ count: 0 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const count = await redisIncr(getTodayKey())
    return Response.json({ count })
  } catch {
    return Response.json({ count: 0 })
  }
}
