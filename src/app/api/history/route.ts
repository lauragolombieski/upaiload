import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    const documentos = await prisma.document.findMany({
      where: {
        userId: user.id,
      },
    })

    return NextResponse.json(documentos, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erro ao buscar histórico' }, { status: 500 })
  }
}
