import { NextRequest } from 'next/server'

const KEY = 'anp-available'

async function redis(commands: string[][]): Promise<Array<{ result: unknown }>> {
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
    const data      = await redis([['GET', KEY]])
    const available = data[0]?.result === 'true'
    return Response.json({ available })
  } catch {
    return Response.json({ available: false })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { pin, available } = await req.json()
    if (pin !== process.env.ADMIN_PIN) {
      return Response.json({ error: 'Wrong PIN' }, { status: 401 })
    }
    await redis([['SET', KEY, available ? 'true' : 'false']])
    return Response.json({ available })
  } catch {
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}
