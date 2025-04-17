import FileUpload from '@/components/uploadFile'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { redirect } from 'next/navigation'

export default async function UploadPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/login')
  }
  return (
    <main className="bg-gray-50">
      <FileUpload />
    </main>
  )
}