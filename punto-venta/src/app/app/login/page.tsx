'use client'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import supabase from '@/lib/supabaseClient'
import { useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const [mensaje, setMensaje] = useState('')
  const { register, handleSubmit } = useForm()

  const onSubmit = async (data: any) => {
    setMensaje('Verificando...')
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password
    })

    if (error) {
      setMensaje('Error: ' + error.message)
    } else {
      setMensaje('Login exitoso')
      router.push('/app/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card w-full max-w-sm bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="card-title justify-center">Iniciar Sesión</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              type="email"
              {...register('email')}
              placeholder="Email"
              className="input input-bordered w-full"
              required
            />
            <input
              type="password"
              {...register('password')}
              placeholder="Contraseña"
              className="input input-bordered w-full"
              required
            />
            <button type="submit" className="btn btn-primary w-full">Ingresar</button>
          </form>
          {mensaje && <p className="text-sm text-center text-success mt-4">{mensaje}</p>}
        </div>
      </div>
    </div>
  )
}
