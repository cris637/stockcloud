'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import supabase from '@/lib/supabaseClient'

interface UsuarioExtendido {
  id: string
  nombre: string
  rol: string
  tienda_id: string
  tienda_activa: boolean
}

const SessionContext = createContext<UsuarioExtendido | null>(null)

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuario] = useState<UsuarioExtendido | null>(null)

  useEffect(() => {
    const obtenerUsuario = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const id = sessionData?.session?.user?.id

      if (id) {
        const { data: userData } = await supabase
          .from('usuarios')
          .select('id, nombre, rol, tienda_id')
          .eq('id', id)
          .single()

        if (userData) {
          const { data: tienda } = await supabase
            .from('tiendas')
            .select('activa')
            .eq('id', userData.tienda_id)
            .single()

          setUsuario({
            ...userData,
            tienda_activa: tienda?.activa ?? true
          })
        }
      }
    }

    obtenerUsuario()
  }, [])

  return (
    <SessionContext.Provider value={usuario}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => useContext(SessionContext)
