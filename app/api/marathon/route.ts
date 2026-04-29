import { NextRequest } from 'next/server'

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
    const data  = await redisPipeline([['GET', getTodayKey()]])
    const count = Number(data[0]?.result) || 0
    return Response.json({ count })
  } catch {
    return Response.json({ count: 0 })
  }
}

export async function POST(_req: NextRequest) {
  try {
    const key  = getTodayKey()
    const data = await redisPipeline([['INCR', key], ['EXPIRE', key, '90000']])
    const count = Number(data[0]?.result) || 0
    return Response.json({ count })
  } catch {
    return Response.json({ count: 0 })
  }
}
