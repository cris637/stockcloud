'use client'
import { useForm } from 'react-hook-form'
import supabase from '@/lib/supabaseClient'
import { useSession } from '@/context/SessionContext'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const rutasDisponibles = [
  { path: '/app/dashboard', nombre: 'Dashboard' },
  { path: '/app/productos', nombre: 'Productos' },
  { path: '/app/ventas', nombre: 'Ventas' },
  { path: '/app/reportes', nombre: 'Reportes' },
  { path: '/app/configuracion', nombre: 'Configuración' },
]

export default function CrearUsuarioPage() {
  const { register, handleSubmit } = useForm()
  const [mensaje, setMensaje] = useState('')
  const [permisos, setPermisos] = useState<string[]>([])
  const usuario = useSession()
  const router = useRouter()

  if (!usuario || usuario.rol !== 'admin') {
    return <p className="text-center text-error mt-10">Acceso denegado</p>
  }

  const togglePermiso = (ruta: string) => {
    setPermisos(prev =>
      prev.includes(ruta) ? prev.filter(p => p !== ruta) : [...prev, ruta]
    )
  }

  const onSubmit = async (data: any) => {
  setMensaje('Creando usuario...')

  const res = await fetch('/api/crear-usuario', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
 body: JSON.stringify({
  email: data.email,
  password: data.password,
  nombre: data.nombre,
  tienda_id: usuario.tienda_id,
  permisos
})

  })

  const json = await res.json()

  if (!res.ok) {
    setMensaje('Error al crear usuario: ' + json.error)
    return
  }

  setMensaje('Usuario creado con éxito')
  router.replace('/app/usuarios')
  router.refresh()
}


  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-md">
        <div className="card-body space-y-4">
          <h2 className="card-title">Crear nuevo usuario</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input {...register('nombre')} placeholder="Nombre del usuario" className="input input-bordered w-full" required />
            <input {...register('email')} type="email" placeholder="Email" className="input input-bordered w-full" required />
            <input {...register('password')} type="password" placeholder="Contraseña" className="input input-bordered w-full" required />

            <div className="space-y-2">
              <label className="label">Permisos (rutas permitidas):</label>
              {rutasDisponibles.map(ruta => (
                <label key={ruta.path} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={permisos.includes(ruta.path)}
                    onChange={() => togglePermiso(ruta.path)}
                  />
                  <span>{ruta.nombre}</span>
                </label>
              ))}
            </div>

            <button type="submit" className="btn btn-primary w-full">Crear usuario</button>
            {mensaje && <p className="text-success text-center mt-2">{mensaje}</p>}
          </form>
        </div>
      </div>
    </div>
  )
}
