'use client'

import { signIn, signOut, useSession } from 'next-auth/react'

export default function LoginButton() {
  const { data: session } = useSession()

  if (session) {
    return (
      <div className="flex gap-4 items-center">
        <button
          onClick={() => signOut()}
          className="text-red-500 underline"
        >
          Sair
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => signIn()}
      className="text-blue-500 underline"
    >
      Entrar
    </button>
  )
}
