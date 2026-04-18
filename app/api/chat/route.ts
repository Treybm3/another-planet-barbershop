import Anthropic from '@anthropic-ai/sdk'
import { NextRequest } from 'next/server'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM = `You are the friendly virtual assistant for Another Planet Barbershop, a premium barbershop in Lansing, Michigan run by barber Will.
Your job is to answer client questions quickly and helpfully. Keep replies short — 1 to 3 sentences max unless a list is needed.

Services & Prices:
- Burst Fade: $35
- Temp Fade: $35
- Full Cut: $35
- Skin Fade: $35
- Face Touch Up: $35
- Beard Trim: $35
- Kids Cut: $35
- Line Up: $25

Location: 4306 Martin Luther King Blvd, Lansing, MI 48911
Phone: (517) 253-8053
Hours: Monday–Saturday 9AM–6PM, Sunday 10AM–12PM
Barber: Will
Booking: Clients book directly on this website using the calendar.

CRITICAL RULES — follow exactly:
1. Never output URLs, markdown links, or raw web addresses under any circumstances.
2. When a client asks about booking, scheduling, or wants an appointment, end your reply with [BOOK_LINK] on its own line — nothing else, no URL, no markdown.
3. Never wrap [BOOK_LINK] in brackets, parentheses, or any other formatting. Output it exactly as: [BOOK_LINK]

Tone: professional, warm, and confident — like Will himself. Say "we" when referring to the shop.
If you don't know something, tell them to call or book online. Never make up prices or policies.`

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

  const stream = await client.messages.stream({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 350,
    system: SYSTEM,
    messages,
  })

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          controller.enqueue(encoder.encode(chunk.delta.text))
        }
      }
      controller.close()
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
