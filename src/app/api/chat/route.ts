import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const messages = body.messages

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
    })

    const result = completion.choices[0].message.content
    return NextResponse.json({ result })
  } catch (err: any) {
    console.error('Erro na API do Chat:', err)
    return NextResponse.json({ error: err.message || 'Erro interno' }, { status: 500 })
  }
}
