import { writeFile } from 'fs/promises'
import path from 'path'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const userId = Number(formData.get('userId'))

    if (!file) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado.' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const fileName = `${Date.now()}-${file.name}`
    const filePath = path.join(process.cwd(), 'public', 'uploads', fileName)
    const publicUrl = `/uploads/${fileName}`

    await writeFile(filePath, buffer)

    const newDoc = await prisma.document.create({
      data: {
        userId,
        publicUrl: publicUrl,
        content: 'Conteúdo da imagem',
        title: 'Nome que a IA vai dar',
      },
    })

    return NextResponse.json({ success: true, document: newDoc })
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 })
  }
}
