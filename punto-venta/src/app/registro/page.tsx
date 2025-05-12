'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import supabase from '@/lib/supabaseClient'
import { useState } from 'react'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  nombre: z.string().min(2),
  nombreTienda: z.string().min(2)
})

type FormData = z.infer<typeof schema>

export default function RegistroPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const [mensaje, setMensaje] = useState('')

  const onSubmit = async (data: FormData) => {
    setMensaje('Registrando...')

    // Crear usuario en Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password
    })

    const user = authData?.user

    if (authError || !user) {
      setMensaje('Error en el registro: ' + (authError?.message || ''))
      return
    }

// Crear tienda
const res = await fetch('/api/crear-tienda', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nombre: data.nombreTienda })
})

const json = await res.json()
if (!res.ok || !json.tienda) {
  setMensaje('Error al crear la tienda: ' + (json.error || ''))
  return
}
const tienda = json.tienda


    // Insertar usuario en tabla usuarios
    const { error: userInsertError } = await supabase
      .from('usuarios')
      .insert({
        id: user.id,
        nombre: data.nombre,
        email: data.email,
        tienda_id: tienda.id,
        rol: 'admin',
        visible: true
      })

    if (userInsertError) {
      setMensaje('Error al registrar usuario en la tienda: ' + userInsertError.message)
      return
    }

    // Insertar en tabla usuario_tienda
    const { error: vinculoError } = await supabase
      .from('usuario_tienda')
      .insert({
        usuario_id: user.id,
        tienda_id: tienda.id
      })

    if (vinculoError) {
      setMensaje('Error al vincular usuario con la tienda: ' + vinculoError.message)
      return
    }

    // Permisos por defecto para admin
    const rutasAdmin = [
      '/app/dashboard',
      '/app/productos',
      '/app/ventas',
      '/app/usuarios',
      '/app/reportes',
      '/app/configuracion'
    ]

    const { error: permisosError } = await supabase
      .from('permisos')
      .insert(rutasAdmin.map(r => ({
        usuario_id: user.id,
        ruta: r
      })))

    if (permisosError) {
      setMensaje('Error al asignar permisos: ' + permisosError.message)
      return
    }

    setMensaje('Registro exitoso. Revisá tu correo para confirmar tu cuenta.')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-sm bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="card-title justify-center">Registro de Tienda</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input {...register('nombre')} placeholder="Tu nombre" className="input input-bordered w-full" />
            {errors.nombre && <p className="text-error text-sm">{errors.nombre.message}</p>}

            <input {...register('nombreTienda')} placeholder="Nombre de la tienda" className="input input-bordered w-full" />
            {errors.nombreTienda && <p className="text-error text-sm">{errors.nombreTienda.message}</p>}

            <input {...register('email')} type="email" placeholder="Email" className="input input-bordered w-full" />
            {errors.email && <p className="text-error text-sm">{errors.email.message}</p>}

            <input {...register('password')} type="password" placeholder="Contraseña" className="input input-bordered w-full" />
            {errors.password && <p className="text-error text-sm">{errors.password.message}</p>}

            <button type="submit" className="btn btn-primary w-full">Registrar</button>
          </form>

          {mensaje && <p className="text-success text-sm text-center mt-4">{mensaje}</p>}
        </div>
      </div>
    </div>
  )
}
