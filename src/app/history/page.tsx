'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import History from '@/components/history'
import { useSession } from 'next-auth/react'

export default function HistoryPage() {
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/login')
      return
    }

    const fetchDocuments = async () => {
      setLoading(true)
      setMessage('')

      try {
        const res = await fetch('/api/history')
        if (!res.ok) throw new Error('Erro ao buscar histórico')
        const data = await res.json()
        setDocuments(data)
        console.log(documents)
      } catch (error) {
        setMessage('Falha ao carregar histórico.')
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [session, status, router])

  return (
    <main className="min-h-197 bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Histórico de Imagens Enviadas
      </h1>
      <h2 className="text-gray-600 text-lg mb-6 text-center">
        Encontre aqui mais informações sobre suas imagens enviadas e utilize o botão "Consultar" para falar com a Íris, nossa assistente de IA.
      </h2>

      {loading && <p>Carregando documentos...</p>}
      {message && <p className="text-sm text-red-600">{message}</p>}

      <div className="flex flex-wrap gap-4 justify-center">
        {!loading && documents.length === 0 && <p>Nenhum documento encontrado.</p>}
        {!loading && documents.length > 0 &&
          documents.map((doc: { id: number; title: string; content: string; publicUrl: string }) => (
            <History
              id={doc.id}
              imagem={doc.publicUrl}
              titulo={doc.title}
              descricao={doc.content}
            />
          ))}
      </div>
    </main>
  )
}
