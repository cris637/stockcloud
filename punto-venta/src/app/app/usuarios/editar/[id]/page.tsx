'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import supabase from '@/lib/supabaseClient'
import { useSession } from '@/context/SessionContext'

const rutasDisponibles = [
  { path: '/app/dashboard', nombre: 'Dashboard' },
  { path: '/app/productos', nombre: 'Productos' },
  { path: '/app/ventas', nombre: 'Ventas' },
  { path: '/app/usuarios', nombre: 'Usuarios' },
  { path: '/app/reportes', nombre: 'Reportes' },
  { path: '/app/configuracion', nombre: 'Configuración' }
]

export default function EditarUsuarioPage() {
  const session = useSession()
  const router = useRouter()
  const { id } = useParams()
  const [nombre, setNombre] = useState('')
  const [permisos, setPermisos] = useState<string[]>([])
  const [mensaje, setMensaje] = useState('')
  const [nuevaPassword, setNuevaPassword] = useState('')

  useEffect(() => {
    const cargarDatos = async () => {
      if (!id || typeof id !== 'string') return

      const { data: userData } = await supabase
        .from('usuarios')
        .select('nombre')
        .eq('id', id)
        .single()

      setNombre(userData?.nombre || '')

      const { data: permisosData } = await supabase
        .from('permisos')
        .select('ruta')
        .eq('usuario_id', id)

      setPermisos(permisosData?.map(p => p.ruta) || [])
    }

    cargarDatos()
  }, [id])

  if (!session || session.rol !== 'admin') {
    return <p className="text-center text-error mt-10">Acceso denegado</p>
  }

  const togglePermiso = (ruta: string) => {
    setPermisos(prev =>
      prev.includes(ruta) ? prev.filter(p => p !== ruta) : [...prev, ruta]
    )
  }

const guardarCambios = async () => {
  setMensaje('Guardando...')

  const res = await fetch('/app/usuarios/api/editar-permisos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, permisos })
  })

  if (res.ok) {
    setMensaje('Permisos actualizados')
    router.push('/app/usuarios') 
  } else {
    const err = await res.json()
    setMensaje(`Error: ${err.error}`)
  }
}


  const cambiarPassword = async () => {
    if (!nuevaPassword) return
    const { error } = await supabase.auth.admin.updateUserById(id as string, {
      password: nuevaPassword
    })

    if (error) {
      setMensaje('Error al cambiar contraseña')
    } else {
      setMensaje('Contraseña actualizada')
      setNuevaPassword('')
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Editar permisos de {nombre}</h1>

      <div className="space-y-2">
        {rutasDisponibles.map(r => (
          <label key={r.path} className="flex items-center gap-2">
            <input
              type="checkbox"
              className="checkbox checkbox-sm"
              checked={permisos.includes(r.path)}
              onChange={() => togglePermiso(r.path)}
            />
            <span>{r.nombre}</span>
          </label>
        ))}
      </div>

      <button onClick={guardarCambios} className="btn btn-success">Guardar permisos</button>

      <hr className="my-4" />

      <h2 className="text-lg font-semibold">Restablecer contraseña</h2>
      <input
        type="password"
        placeholder="Nueva contraseña"
        value={nuevaPassword}
        onChange={e => setNuevaPassword(e.target.value)}
        className="input input-bordered w-full"
      />
      <button onClick={cambiarPassword} className="btn btn-warning mt-2">Cambiar contraseña</button>

      {mensaje && <p className="text-success mt-4">{mensaje}</p>}
    </div>
  )
}
