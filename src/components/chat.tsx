'use client'

import { useState } from 'react'
import Image from 'next/image'

interface CardProps {
  id: number
  imagem?: string
  titulo: string
  descricao: string
  selecionado: boolean
  onSelect?: () => void
  conteudo?: string
}

export default function SelectableCard({
  id,
  imagem,
  titulo,
  descricao,
  selecionado = false,
  onSelect,
  conteudo = '',
}: CardProps) {
  const imagemSrc = imagem || '/images/exemplo1.jpg'
  const [showChat, setShowChat] = useState(false)
  const [mensagens, setMensagens] = useState([
    { role: 'system', content: `Você está lendo o seguinte conteúdo do documento:\n\n${conteudo}` },
  ])
  const [novaMensagem, setNovaMensagem] = useState('')

  const handleEnviar = async () => {
    if (!novaMensagem.trim()) return
  
    const novaLista = [...mensagens, { role: 'user', content: novaMensagem }]
    setMensagens(novaLista)
    setNovaMensagem('')
    
    try {
      const resposta = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: novaLista }),
      })
  
      const data = await resposta.json()
  
      if (data.result) {
        setMensagens([...novaLista, { role: 'assistant', content: data.result }])
      } else {
        throw new Error(data.error || 'Erro desconhecido')
      }
    } catch (err) {
      console.error('Erro ao buscar resposta do chat:', err)
      setMensagens([
        ...novaLista,
        { role: 'assistant', content: 'Desculpe, houve um erro ao gerar a resposta.' },
      ])
    }
  }
  

  return (
    <>
      <div
        onClick={onSelect}
        className={`w-[240px] cursor-pointer p-6 border rounded-xl border-gray-300 bg-white shadow-lg transition-all ${
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
          onClick={(e) => {
            e.stopPropagation()
            setShowChat(true)
          }}
          className="cursor-pointer mt-4 mx-auto bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-300 shadow-md block">
          Pesquisar
        </button>
      </div>

      {showChat && (
        <div className="fixed bottom-4 right-4 w-[350px] h-[500px] bg-white border rounded-xl shadow-xl p-4 flex flex-col z-50">
          <div className="overflow-y-auto flex-1 mb-2">
            {mensagens.map((msg, i) => (
              <div key={i} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block px-3 py-2 rounded-lg ${msg.role === 'user' ? 'bg-sky-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              value={novaMensagem}
              onChange={(e) => setNovaMensagem(e.target.value)}
              className="flex-1 border rounded-l-lg px-3 py-2 text-sm"
              placeholder="Digite sua pergunta..."
            />
            <button
              onClick={handleEnviar}
              className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-r-lg text-sm"
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </>
  )
}
