'use client'
import { useEffect, useState } from 'react'
import supabase from '@/lib/supabaseClient'
import { useSession } from '@/context/SessionContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function UsuariosPage() {
  const session = useSession()
  const [usuarios, setUsuarios] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const cargarUsuarios = async () => {
      if (!session || session.rol !== 'admin') return

      console.log('[DEBUG] Session tienda_id:', session.tienda_id)

      const { data: users, error } = await supabase
        .from('usuarios')
        .select('id, nombre, tienda_id')
        .eq('tienda_id', session.tienda_id)

      if (error) {
        console.error('[ERROR] Al obtener usuarios:', error)
        return
      }

      console.log('[DEBUG] Usuarios encontrados:', users)

      const usuariosConPermisos = await Promise.all(
        (users ?? []).map(async (user) => {
          const { data: permisosData, error: permisosError } = await supabase
            .from('permisos')
            .select('ruta')
            .eq('usuario_id', user.id)

          if (permisosError) {
            console.error('[ERROR] Permisos de usuario', user.id, permisosError)
          }

          return {
            ...user,
            permisos: permisosData?.map(p => p.ruta) || []
          }
        })
      )

      console.log('[DEBUG] Usuarios con permisos:', usuariosConPermisos)
      setUsuarios(usuariosConPermisos)
    }

    cargarUsuarios()
  }, [session])

  const eliminarUsuario = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return
    await supabase.from('usuarios').delete().eq('id', id)
    setUsuarios(prev => prev.filter(u => u.id !== id))
  }

  if (!session || session.rol !== 'admin') {
    return <p className="text-center text-error mt-10">Acceso denegado</p>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Usuarios de tu tienda</h1>

      <Link href="/app/usuarios/nuevo" className="btn btn-primary mb-4">
        Crear nuevo usuario
      </Link>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Permisos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.nombre}</td>
                <td>
                  <ul className="list-disc list-inside text-sm">
                    {u.permisos.map((p: string) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </td>
                <td className="flex gap-2">
                  <button
                    onClick={() => router.push(`/app/usuarios/editar/${u.id}`)}
                    className="btn btn-sm btn-info"
                  >
                    Editar
                  </button>
                  {u.id !== session.id && (
                    <button
                      onClick={() => eliminarUsuario(u.id)}
                      className="btn btn-sm btn-error"
                    >
                      Eliminar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
