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

  return (
    <div
      onClick={onSelect}
      className={`w-[240px] p-6 border rounded-xl bg-white cursor-pointer shadow-lg transition-all ${
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
    </div>
  )
}