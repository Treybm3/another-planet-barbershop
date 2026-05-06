import { NextResponse } from 'next/server'

const TOKEN   = process.env.INSTAGRAM_TOKEN
const USER_ID = process.env.INSTAGRAM_USER_ID

export const revalidate = 10800 // re-fetch every 3 hours

export async function GET() {
  if (!TOKEN || !USER_ID) {
    return NextResponse.json({ photos: [] })
  }

  try {
    const url = `https://graph.instagram.com/${USER_ID}/media?fields=id,media_type,media_url,thumbnail_url,timestamp,caption&limit=24&access_token=${TOKEN}`
    const res  = await fetch(url, { next: { revalidate: 10800 } })

    if (!res.ok) return NextResponse.json({ photos: [] })

    const data = await res.json()

    const photos = (data.data ?? [])
      .filter((p: any) => p.media_type === 'IMAGE' || p.media_type === 'CAROUSEL_ALBUM' || p.media_type === 'VIDEO')
      .map((p: any) => ({
        src:   p.media_type === 'VIDEO' ? p.thumbnail_url : p.media_url,
        alt:   p.caption?.split('\n')[0]?.slice(0, 60) ?? 'Another Planet Barbershop',
        label: p.caption?.split('\n')[0]?.slice(0, 40) ?? 'Another Planet',
      }))

    return NextResponse.json({ photos })
  } catch {
    return NextResponse.json({ photos: [] })
  }
}
