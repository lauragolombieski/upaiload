'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import History from '@/components/history'
import { useSession } from 'next-auth/react'
import jsPDF from "jspdf";

export default function HistoryPage() {
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([])
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const { data: session, status } = useSession()
  const router = useRouter()

  const handleSelect = (id: number) => {
    setSelectedDocuments(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const handleDelete = async () => {

    if (confirm('Tem certeza que deseja excluir os uploads selecionados?')) {
      try {
        const resp = await fetch('/api/delete', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ selectedDocuments }),
        });

        if(resp.status == 200) {
          window.location.reload()
        }
      } catch (error) {
        setMessage('Falha ao excluir uploads.')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleCloseChat = async () => {
    await fetch("/api/history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        documentId: selectedDocumentId,
        messages: chatMessages, // array de mensagens
      }),
    });
  
    setChatOpen(false); // ou qualquer lógica para fechar a interface do chat
  };

const handleDownload = () => {
  const doc = new jsPDF();
  const lineHeight = 10;
  const maxLinesPerPage = 25; // Aproximadamente (depende do tamanho da fonte)
  let lineCount = 0;
  let page = 1;

  chatMessages.forEach((msg, index) => {
    const text = `${msg.role === "user" ? "Usuário" : "Assistente"}: ${msg.content}`;

    if (lineCount >= maxLinesPerPage) {
      doc.addPage();
      lineCount = 0;
      page++;
    }

    doc.text(text, 10, 10 + lineCount * lineHeight);
    lineCount++;
  });

  doc.save("conversa.pdf");
};

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

      {loading && <p className="text-gray-600 text-lg mb-6 text-center">Carregando documentos...</p>}
      {message && <p className="text-sm text-red-600">{message}</p>}

      <div className="flex flex-wrap gap-4 justify-center">
        {!loading && documents.length === 0 && <p className="text-sm text-red-600">Nenhum documento encontrado.</p>}
        {!loading && documents.length > 0 &&
        documents.map(doc => (
          <History
            key={doc.id}
            id={doc.id}
            imagem={doc.publicUrl}
            titulo={doc.title}
            descricao={doc.content}
            selecionado={selectedDocuments.includes(doc.id)}
            onSelect={() => handleSelect(doc.id)}
          />
        ))}
      </div>

      {selectedDocuments.length > 0 && (
        <div>
          <button
            onClick={handleDelete}
            className="rounded-full fixed bottom-8 right-6 bg-red-300 hover:bg-red-400 text-white font-bold py-2 px-4 shadow-xl z-50"
          >
            ❌
          </button>
        </div>
      )}

    </main>
  )
}
