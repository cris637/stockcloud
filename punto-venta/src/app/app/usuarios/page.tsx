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
      if (!session || !session.tienda_id) {
        console.log('[USUARIOS] Esperando sesión válida...')
        return
      }

      console.log('[USUARIOS] Iniciando carga de usuarios')

      const { data: users, error: usersError } = await supabase
        .from('usuarios')
        .select('id, nombre, rol, email, visible, tienda_id')
        .eq('tienda_id', session.tienda_id)

      if (usersError) {
        console.error('[USUARIOS] Error al obtener usuarios:', usersError)
        return
      }

const usuariosConPermisos = await Promise.all(
  (users ?? []).map(async (user) => {
    const res = await fetch('/app/usuarios/api/permisos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: user.id })
    })

    const json = await res.json()

    return {
      ...user,
      permisos: json.permisos?.map((p: any) => p.ruta) || []
    }
  })
)


      console.log('[USUARIOS] Usuarios con todos los datos:', usuariosConPermisos)
      setUsuarios(usuariosConPermisos)
    }

    cargarUsuarios()
  }, [session])

  const eliminarUsuario = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return
await fetch('/app/usuarios/api/eliminar', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ id })
})
    setUsuarios(prev => prev.filter(u => u.id !== id))
  }

  if (!session) return <p className="text-center mt-10">Cargando sesión...</p>
  if (session.rol !== 'admin') return <p className="text-center text-error mt-10">Acceso denegado</p>

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
              <th>Email</th>
              <th>Rol</th>
              <th>Permisos</th>
              <th>Visible</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.nombre}</td>
                <td>{u.email || '—'}</td>
                <td className="capitalize">{u.rol}</td>
                <td>
                  <ul className="list-disc list-inside text-sm">
                    {u.permisos.map((p: string) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </td>
                <td>{u.visible ? 'Sí' : 'No'}</td>
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

      <div className="mt-8 p-4 bg-base-200 rounded-lg">
        <h2 className="text-lg font-bold mb-2">Datos de Depuración</h2>
        <pre className="text-xs overflow-x-auto">
          {JSON.stringify({ session, usuarios, tiempo: new Date().toISOString() }, null, 2)}
        </pre>
      </div>
    </div>
  )
}
