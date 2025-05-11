'use client'
import { useSession } from '@/context/SessionContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session && !session.tienda_activa && session.rol !== 'superadmin') {
      router.push('/bloqueado')
    }
  }, [session, router])

  if (!session) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bienvenido, {session.nombre} 👋</h1>
      <p>Tu tienda está activa: {session.tienda_activa ? 'Sí' : 'No'}</p>
    </div>
  )
}
