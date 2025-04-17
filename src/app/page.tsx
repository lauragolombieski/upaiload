'use client';

import Image from "next/image";
import { signIn } from 'next-auth/react';

export default function Home() {
  return (
    <main className="min-h-197 bg-gradient-to-b from-gray-50 to-gray-200 flex flex-col items-center justify-center font-[family-name:var(--font-geist-sans)]">
      <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center gap-6 max-w-xl w-full text-center">
        <Image
          src="/images/imageIA.png"
          alt="Inteligência Artificial"
          width={200}
          height={200}
          className="rounded-full shadow-md"
        />
        <h1 className="text-3xl font-bold text-gray-800">
          Seja bem-vindo ao site de uploads inteligentes!
        </h1>
        <p className="text-gray-600 text-lg">
          Use o poder da inteligência artificial para resumir seus arquivos de forma rápida e inteligente.
        </p>
        <button
          onClick={() => signIn()}
          className="mt-4 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-6 rounded-xl transition-all duration-300 shadow-md"
        >
          Começar agora
        </button>
      </div>
    </main>
  );
}
