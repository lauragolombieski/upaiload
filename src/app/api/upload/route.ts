import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import axios from 'axios'
import FormData from 'form-data'

const apiKey = 'K81610654988957'

export async function POST(req: Request) {
  try {
    const data = await req.formData()
    const file = data.get('file')
    const userId = Number(data.get('userId'))

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado ou arquivo inválido.' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const fileName = `${Date.now()}-${file.name}`
    const filePath = path.join(process.cwd(), 'public', 'uploads', fileName)

    await writeFile(filePath, buffer)
    const publicUrl = `/uploads/${fileName}`

    const formData = new FormData()
    formData.append('apikey', apiKey)
    formData.append('language', 'por')
    formData.append('file', buffer, fileName)

    const response = await axios.post('https://api.ocr.space/parse/image', formData, {
      headers: formData.getHeaders(),
    })

    const text = response.data.ParsedResults[0].ParsedText

        await prisma.document.create({
        data: {
          userId,
          publicUrl: publicUrl,
          content: text || 'Sem texto definido',
          title: file.name,
        },
      })

    return NextResponse.json({ success: true, text })
  } catch (err) {
    console.error('Erro no processamento:', err)
    return NextResponse.json({ error: err.message || 'Erro desconhecido' }, { status: 500 })
  }
}