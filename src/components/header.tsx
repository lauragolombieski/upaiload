'use client'

import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="flex px-2 py-4 bg-sky-600 text-white hover:bg-sky-700 transition-colors">
      <div className="flex items-center justify-between w-full mx-auto max-w-7xl">
        <div className="font-bold text-lg">
          <Link href="/">UpAILoad</Link>
        </div>

        <nav>
          <ul className="flex items-center justify-center gap-4">

            {session ? (
              <>
                <li>
                  <Link href="/upload" className="hover:underline">Upload</Link>
                </li>
                <li>
                  <Link href="/history" className="hover:underline">Histórico</Link>
                </li>
                <li>
                  <button onClick={() => signOut()} className="hover:underline text-red-200">
                    Sair
                  </button>
                </li>
              </>
            ):(
              <li>
                <button onClick={() => signIn()} className="hover:underline">
                  Entrar
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}
