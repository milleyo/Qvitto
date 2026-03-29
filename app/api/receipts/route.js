import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

function generateId() {
  return 'QV' + Math.random().toString(36).slice(2, 10).toUpperCase()
}

export async function POST(req) {
  try {
    const body = await req.json()
    const { storeName, storeOrgnr, storeAddress, total, vat } = body

    if (!storeName || !total) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const id = generateId()
    const returnDeadline = new Date()
    returnDeadline.setDate(returnDeadline.getDate() + 30)

    const { data, error } = await supabase.from('receipts').insert({
      id,
      store_name: storeName,
      store_orgnr: storeOrgnr || '556XXX-XXXX',
      store_address: storeAddress || 'Stockholm',
      total: parseFloat(total),
      vat: parseFloat(vat) || parseFloat(total) * 0.2,
      return_deadline: returnDeadline.toISOString(),
      co2_saved: 5,
    }).select().single()

    if (error) throw error

    return NextResponse.json({ receipt: data })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const { data, error } = await supabase.from('receipts').select('*').eq('id', id).single()

  if (error) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ receipt: data })
}