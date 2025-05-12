import { NextRequest, NextResponse } from 'next/server'
import supabaseAdmin from '@/lib/supabaseAdmin'

export async function POST(req: NextRequest) {
  const { nombre } = await req.json()

  const { data, error } = await supabaseAdmin
    .from('tiendas')
    .insert({ nombre })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ tienda: data })
}
