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
      console.log('[SESSION] Iniciando obtención de usuario')

      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      console.log('[SESSION] Datos de sesión:', session)
      console.log('[SESSION] Error de sesión:', sessionError)

      const id = session?.user?.id
      console.log('[SESSION] UID actual:', id)

      if (!id) return

      // Obtener tienda_id desde tabla usuario_tienda
      const { data: tiendaData, error: tiendaIdError } = await supabase
        .from('usuario_tienda')
        .select('tienda_id')
        .eq('usuario_id', id)
        .limit(1)

      if (tiendaIdError || !tiendaData || tiendaData.length === 0) {
        console.error('[SESSION] Error obteniendo tienda_id desde usuario_tienda:', tiendaIdError || 'No se encontró tienda')
        return
      }

      const tienda_id = tiendaData[0].tienda_id
      console.log('[SESSION] tienda_id desde usuario_tienda:', tienda_id)

      // Obtener datos básicos del usuario
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('id, nombre, rol')
        .eq('id', id)
        .single()

      if (userError || !userData) {
        console.error('[SESSION] Error al obtener usuario:', userError)
        return
      }

      // Verificar si la tienda está activa
      const { data: tienda, error: tiendaError } = await supabase
        .from('tiendas')
        .select('activa')
        .eq('id', tienda_id)
        .single()

      if (tiendaError) {
        console.error('[SESSION] Error al obtener tienda:', tiendaError)
      }

      const usuarioExtendido: UsuarioExtendido = {
        ...userData,
        tienda_id,
        tienda_activa: tienda?.activa ?? true
      }

      console.log('[SESSION] Usuario final:', usuarioExtendido)
      setUsuario(usuarioExtendido)
    }

    obtenerUsuario()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`[AUTH] Cambio de estado: ${event}`)
      if (event === 'SIGNED_OUT') {
        setUsuario(null)
      } else if (session) {
        obtenerUsuario()
      }
    })

    return () => subscription?.unsubscribe()
  }, [])

  return (
    <SessionContext.Provider value={usuario}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => useContext(SessionContext)
