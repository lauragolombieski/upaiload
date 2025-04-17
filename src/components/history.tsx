'use client'

import { useState } from 'react'
import Image from 'next/image'
import jsPDF from "jspdf";
import { useSession } from "next-auth/react";

interface CardProps {
  id: number
  imagem?: string
  titulo: string
  descricao: string
  selecionado: boolean
  onSelect?: () => void
}

export default function SelectableCard({
  id,
  imagem,
  titulo,
  descricao,
  selecionado = false,
  onSelect,
}: CardProps) {
  const imagemSrc = imagem || '/images/exemplo1.jpg'
  const [visibleMessages, setVisibleMessages] = useState<{ role: string; content: string }[]>([])
  const [chatOpen, setChatOpen] = useState(false)
  const hiddenMessages = [
    {
      role: 'system',
      content: 'Você está ajudando o usuário com perguntas sobre um documento enviado, seu nome é Íris, é possível baixar o documento da conversa clicando no card e selecionando o botao do lado de apagar.',
    },
    {
      role: 'user',
      content: `Conteúdo do documento:\n\n${descricao}`,
    },
  ]
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession();

  const fetchHistory = async () => {
    if (visibleMessages.length > 0) {return}
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/history/` + id, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
    
        const data = await res.json()
        if(data.vazio) {return}

        setVisibleMessages(JSON.parse(data.messages))
    } catch (error) {
      console.error('Erro ao carregar histórico do chat:', error)
    }
  }

  fetchHistory()

  const handleCloseChat = async () => {
    if (!visibleMessages.length) {
      setChatOpen(false);
      return;
    }
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session?.user?.id,
          documentId: id,
          messages: visibleMessages,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Erro ao salvar o histórico de mensagens.");
      }
    } catch (error) {
      console.error("Erro ao enviar o histórico:", error);
    } finally {
      setChatOpen(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return
  
    const userMsg = { role: 'user', content: input }
    const newVisible = [...visibleMessages, userMsg]
    setVisibleMessages(newVisible)
    setInput('')
    setLoading(true)
  
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...hiddenMessages, ...newVisible, session?.user?.id],
        }),
      })
  
      const data = await res.json()
      const reply = { role: 'assistant', content: data.result }
  
      setVisibleMessages([...newVisible, reply])
    } catch (err) {
      console.error(err)
      setVisibleMessages([
        ...newVisible,
        { role: 'assistant', content: 'Erro ao gerar resposta.' },
      ])
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div
      onClick={onSelect}
      className={`w-[250px] relative cursor-pointer p-6 border rounded-xl border-gray-300 bg-white shadow-lg transition-all ${
        selecionado ? 'ring-2 ring-sky-500' : ''
      }`}
    >
      <div className="relative w-full h-48 mb-6 rounded-xl overflow-hidden">
        <Image
          src={imagemSrc}
          alt={titulo}
          width={400}
          height={200}
          className="object-cover w-full h-full"
        />
      </div>

      <h3 className="text-lg font-semibold text-sky-700 truncate">{titulo}</h3>
      <p className="text-sm text-gray-600 mt-1 truncate">{descricao}</p>

      <button
        className="cursor-pointer mt-4 mx-auto bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-300 shadow-md block"
        onClick={(e) => {
          e.stopPropagation()
          setChatOpen(true)
        }}
      >
        Pesquisar
      </button>

      {chatOpen && (
        <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-95 p-4 rounded-xl z-10 shadow-lg">
          <div className="flex justify-between items-center">
            <h4 className="text-sky-700 font-semibold">Faça sua pergunta!</h4>
            <button
              onClick={() => {
                const doc = new jsPDF();
                const lineHeight = 10;
                const maxLinesPerPage = 25;
                let lineCount = 0;

                visibleMessages.forEach((msg) => {
                  const prefix = msg.role === "user" ? "Usuário" : "IA";
                  const fullText = `${prefix}: ${msg.content}`;
                  const lines = doc.splitTextToSize(fullText, 180);

                  lines.forEach((line) => {
                    if (lineCount >= maxLinesPerPage) {
                      doc.addPage();
                      lineCount = 0;
                    }
                    doc.text(line, 10, 10 + lineCount * lineHeight);
                    lineCount++;
                  });
                });

                doc.save("conversa.pdf");
              }}
              className="px-3 py-1"
            >
              📤
            </button>
            <button onClick={() => handleCloseChat()}>❌</button>
          </div>

          <div className="h-55 overflow-y-auto border p-2 mb-2 rounded bg-gray-50 border-gray-300 text-sm">
            {visibleMessages.map((msg, i) => (
              <div key={i} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                <p>
                  <strong>{msg.role === 'user' ? 'Você' : 'Íris'}:</strong> {msg.content}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-2 mt-2">
            <input
              type="text"
              className="w-full border border-gray-300 rounded p-2 text-sm"
              placeholder="Faça uma pergunta..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage()
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={loading}
              className="cursor-pointer mx-auto bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-300 shadow-md block"
            >
              {loading ? 'Enviando...' : 'Enviar'}
            </button>

          </div>
        </div>
      )}
    </div>
  )
}
