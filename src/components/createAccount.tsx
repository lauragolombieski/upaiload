'use client';

import { useState } from 'react';

export default function CreateAccountForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const createAccount = async () => {
    if (!email || !password) {
      setMessage('Preencha todos os campos.');
      return;
    }

    setLoading(true);
    setMessage('Criando conta...');

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (res.status == 409) {
        throw new Error('Usuário já existe.');
      }

      if (res.status == 400) {
        throw new Error('Email e senha são obrigatórios.');
      }

      setMessage('Conta criada com sucesso!');
      setEmail('');
      setPassword('');
    } catch (err: unknown) {
      setMessage((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-197 bg-gradient-to-b from-gray-50 to-gray-200 flex items-center justify-center p-6 font-[family-name:var(--font-geist-sans)]">
      <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center gap-6 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-sky-700">
          Crie sua conta no <span className="text-blue-600">UpAILoad</span>
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
        />

        <button
          onClick={createAccount}
          disabled={loading}
          className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50 shadow-md"
        >
          {loading ? 'Criando...' : 'Criar Conta'}
        </button>

        {message && (
          <p className="mt-2 text-sm text-gray-700">{message}</p>
        )}
      </div>
    </main>
  );
}
