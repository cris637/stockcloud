import { NextRequest, NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  const { userId } = await req.json()

  if (!userId) {
    return NextResponse.json({ error: 'Falta userId' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('permisos')
    .select('ruta')
    .eq('usuario_id', userId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ permisos: data })
}
