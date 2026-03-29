import { sendReceiptEmail } from '@/lib/email'
import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { receiptId, email } = await req.json()

    const { data: receipt } = await supabase
      .from('receipts')
      .select('*')
      .eq('id', receiptId)
      .single()

    if (!receipt) return NextResponse.json({ error: 'Receipt not found' }, { status: 404 })

    await supabase.from('receipts').update({ user_email: email }).eq('id', receiptId)

    await sendReceiptEmail({
      to: email,
      receiptId: receipt.id,
      storeName: receipt.store_name,
      storeOrgnr: receipt.store_orgnr,
      storeAddress: receipt.store_address,
      total: receipt.total,
      vat: receipt.vat,
      items: receipt.items || [],
      date: receipt.date,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}