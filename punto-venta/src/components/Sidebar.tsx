'use client'
import { useSession } from '@/context/SessionContext'
import Link from 'next/link'
import supabase from '@/lib/supabaseClient'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const Sidebar = () => {
  const session = useSession()
  const [permisos, setPermisos] = useState<string[]>([])
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const cargarPermisos = async () => {
     if (session?.id) {
  const { data, error } = await supabase
    .from('permisos')
    .select('ruta')
    .eq('usuario_id', session.id)


        if (data) {
          setPermisos(data.map(p => p.ruta))
          console.log('[PERMISOS]', data)

        }
        
      }
    }

    cargarPermisos()
  }, [session])

  const salir = async () => {
    await supabase.auth.signOut()
    router.push('/app/login')
  }

  const enlaces: { ruta: string, label: string }[] = [
    { ruta: '/app/dashboard', label: 'Dashboard' },
    { ruta: '/app/productos', label: 'Productos' },
    { ruta: '/app/ventas', label: 'Ventas' },
    { ruta: '/app/usuarios', label: 'Usuarios' },
    { ruta: '/app/reportes', label: 'Reportes' },
    { ruta: '/app/configuracion', label: 'Configuración' },
  ]

  return (
    <aside className="w-60 min-h-screen bg-base-200 shadow-md flex flex-col justify-between fixed left-0 top-0">
      <div>
        <div className="p-4 text-lg font-bold border-b border-base-300">
          StockCloud
        </div>
        <div className="p-4 space-y-2">
          {enlaces.map((link) =>
            permisos.includes(link.ruta) ? (
              <Link
                key={link.ruta}
                href={link.ruta}
                className={`block px-3 py-2 rounded hover:bg-base-300 transition ${
                  pathname === link.ruta ? 'bg-base-300 font-semibold' : ''
                }`}
              >
                {link.label}
              </Link>
            ) : null
          )}
        </div>
      </div>
      <div className="p-4 border-t border-base-300">
<p className="text-sm">Usuario: {session?.nombre}</p>
<p className="text-xs text-gray-500 mb-2 capitalize">Rol: {session?.rol}</p>
        <button className="btn btn-sm btn-outline w-full" onClick={salir}>Cerrar sesión</button>
      </div>
    </aside>
  )
}

export default Sidebar
