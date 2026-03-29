import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

function generateToken() {
  return 'TK' + Math.random().toString(36).slice(2, 10).toUpperCase()
}

export async function POST(req) {
  try {
    const { receiptId, email } = await req.json()

    const { data: receipt } = await supabase
      .from('receipts')
      .select('*')
      .eq('id', receiptId)
      .single()

    if (!receipt) return NextResponse.json({ error: 'Receipt not found' }, { status: 404 })
    if (receipt.used_for_return) return NextResponse.json({ error: 'already_used' }, { status: 400 })

    const deadline = new Date(receipt.return_deadline)
    if (new Date() > deadline) return NextResponse.json({ error: 'expired_window' }, { status: 400 })

    const token = generateToken()
    const expiresAt = new Date(Date.now() + 60000)

    const { data, error } = await supabase.from('receipt_sessions').insert({
      receipt_id: receiptId,
      user_email: email,
      token,
      expires_at: expiresAt.toISOString(),
    }).select().single()

    if (error) throw error

    return NextResponse.json({ token, expires_at: expiresAt.toISOString() })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')

  if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 })

  const { data: session } = await supabase
    .from('receipt_sessions')
    .select('*')
    .eq('token', token)
    .single()

  if (!session) return NextResponse.json({ status: 'invalid' })
  if (session.used) return NextResponse.json({ status: 'already_used' })
  if (new Date() > new Date(session.expires_at)) return NextResponse.json({ status: 'expired' })

  const { data: receipt } = await supabase
    .from('receipts')
    .select('*')
    .eq('id', session.receipt_id)
    .single()

  if (!receipt || receipt.used_for_return) return NextResponse.json({ status: 'already_used' })

  // Mark as used
  await supabase.from('receipt_sessions').update({ used: true }).eq('token', token)
  await supabase.from('receipts').update({
    used_for_return: true,
    returned_at: new Date().toISOString()
  }).eq('id', receipt.id)

  await supabase.from('returns_log').insert({
    receipt_id: receipt.id,
    user_email: session.user_email,
    status: 'approved'
  })

  return NextResponse.json({ status: 'verified', receipt, session })
}