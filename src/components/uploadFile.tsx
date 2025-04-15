'use client';

import { useState } from 'react';
import { useSession } from "next-auth/react";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const { data: session } = useSession();

  const handleUpload = async () => {
    if (!file) return;
  
    setUploading(true);
    setProgress(0);
    setMessage('');
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', session?.user?.id);
  
    const xhr = new XMLHttpRequest();
  
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        setProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      setUploading(false);
      if (xhr.status === 200) {
        setMessage('😎🚀 Upload feito com sucesso!');
      } else {
        setMessage('😞 Ocorreu um erro no upload.');
      }
    };

    xhr.onerror = () => {
      setUploading(false);
      setMessage('❌ Falha na conexão durante o upload.');
    };
  
    xhr.open('POST', '/api/upload');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.send(formData);
  };

  return (
    <main className="min-h-197 bg-gradient-to-b from-gray-50 to-gray-200 flex items-center justify-center font-[family-name:var(--font-geist-sans)]">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md flex flex-col gap-6 text-center">
        <h2 className="text-2xl font-bold text-sky-700">Upload Inteligente</h2>
        <p className="text-sm text-gray-500 -mt-4 mb-2">Nos envie uma imagem para ser auxiliado pela nossa assistente virtual Íris!</p>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
        />

        <button
          onClick={handleUpload}
          disabled={uploading || !file}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-md disabled:opacity-50"
        >
          {uploading ? 'Enviando...' : 'Enviar'}
        </button>

        {uploading && (
          <div className="w-full">
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-700 mt-2">{progress}%</p>
          </div>
        )}

        {message && (
          <p className="text-sm text-gray-700">{message}</p>
        )}
      </div>
    </main>
  );
}
