import { NextRequest, NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  const { id, permisos } = await req.json()

  if (!id || !Array.isArray(permisos)) {
    return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })
  }

  // Eliminar permisos anteriores
  const { error: deleteError } = await supabaseAdmin
    .from('permisos')
    .delete()
    .eq('usuario_id', id)

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 })
  }

  // Insertar nuevos permisos
  const nuevos = permisos.map((ruta: string) => ({
    usuario_id: id,
    ruta
  }))

  const { error: insertError } = await supabaseAdmin
    .from('permisos')
    .insert(nuevos)

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
