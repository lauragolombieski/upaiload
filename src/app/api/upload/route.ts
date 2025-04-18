import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import os from 'os';

export async function POST(req: Request) {
  try {
    const data = await req.formData()
    const file = data.get('file') as File
    const fileName = data.get('fileName') as string

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'Nenhum arquivo encontrado.' })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const uploadDir = path.join(process.cwd(), 'public', 'images')
    const filePath = path.join(uploadDir, fileName)
    await writeFile(filePath, buffer)
    return NextResponse.json({ success: true, filePath: `/images/${fileName}` })
  } catch (e) {
    return NextResponse.json({ error: e })
  }
}
