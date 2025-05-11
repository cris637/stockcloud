'use client'
import { useSession } from '@/context/SessionContext'

export default function DashboardPage() {
  const usuario = useSession()

  return (
    <div className="p-6">
   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
  <div className="stats shadow">
    <div className="stat">
      <div className="stat-title">Ventas Hoy</div>
      <div className="stat-value text-primary">$0</div>
    </div>
  </div>
  <div className="stats shadow">
    <div className="stat">
      <div className="stat-title">Productos en Stock</div>
      <div className="stat-value">0</div>
    </div>
  </div>
  <div className="stats shadow">
    <div className="stat">
      <div className="stat-title">Usuarios Registrados</div>
      <div className="stat-value">1</div>
    </div>
  </div>
</div>

    </div>

    
  )
}
