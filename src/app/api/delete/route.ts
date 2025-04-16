import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const { selectedDocuments } = await req.json()

    if (!Array.isArray(selectedDocuments) || selectedDocuments.length === 0) {
      return NextResponse.json({ error: 'Nenhum documento selecionado' }, { status: 400 })
    }

    const docsToDelete = await prisma.document.findMany({
      where: {
        id: { in: selectedDocuments },
        userId: session.user.id,
      },
    })

    for (const doc of docsToDelete) {
      if (doc.publicUrl) {
        const filePath = path.resolve('public', doc.publicUrl)
        try {
          await fs.unlink(filePath)
        } catch (err) {
          console.warn(`Não foi possível excluir o arquivo ${filePath}`, err)
        }
      }
    }

    await prisma.document.deleteMany({
      where: {
        id: { in: selectedDocuments },
        userId: session.user.id,
      },
    })

    return NextResponse.json({ message: 'Documentos deletados com sucesso' }, { status: 200 })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao excluir documentos' }, { status: 500 })
  }
}
