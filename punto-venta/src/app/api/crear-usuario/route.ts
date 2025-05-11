import { NextRequest, NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { email, password, nombre, tienda_id, permisos } = body

  // Crear usuario en Supabase Auth
  const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password
  })

  if (userError || !userData?.user) {
    return NextResponse.json({ error: userError?.message || 'No se pudo crear el usuario' }, { status: 400 })
  }

  const userId = userData.user.id

  // Insertar en tabla usuarios
  const { error: dbError } = await supabaseAdmin
    .from('usuarios')
    .insert([{ id: userId, nombre, tienda_id, rol: 'generico' }])

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 400 })
  }

  // Insertar permisos
  const permisosInsert = permisos.map((ruta: string) => ({
    usuario_id: userId,
    ruta
  }))

  const { error: permisosError } = await supabaseAdmin
    .from('permisos')
    .insert(permisosInsert)

  if (permisosError) {
    return NextResponse.json({ error: permisosError.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
