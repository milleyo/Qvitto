'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function ReceiptPage() {
  const { id } = useParams()
  const [receipt, setReceipt] = useState(null)
  const [view, setView] = useState('receipt')
  const [email, setEmail] = useState('')
  const [saved, setSaved] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [returnSession, setReturnSession] = useState(null)
  const [timer, setTimer] = useState(60)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/receipts?id=${id}`)
      .then(r => r.json())
      .then(d => { setReceipt(d.receipt); setLoading(false) })
      .catch(() => { setError('Kvitto hittades inte.'); setLoading(false) })
  }, [id])

  useEffect(() => {
    if (view === 'qr' && timer > 0) {
      const t = setTimeout(() => setTimer(s => s - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [view, timer])

  const handleSave = async () => {
    if (!email.includes('@')) { setError('Ogiltig e-postadress.'); return }
    await fetch('/api/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receiptId: id, email })
    })
    setSaved(true)
    setView('receipt')
    setError('')
  }

  const handleSendOtp = () => {
    if (!email.includes('@')) { setError('Ogiltig e-postadress.'); return }
    setOtpSent(true)
    setError('')
  }

  const handleVerifyOtp = async () => {
    if (otp !== '482951') { setError('Fel kod. Testa: 482951'); return }
    const res = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receiptId: id, email })
    })
    const data = await res.json()
    if (data.error === 'already_used') { setError('Kvittot har redan använts för en retur.'); return }
    if (data.error === 'expired_window') { setError('Returperioden har gått ut.'); return }
    if (data.error) { setError(data.error); return }
    setReturnSession(data)
    setTimer(60)
    setView('qr')
    setError('')
  }

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#6B7280' }}>Laddar kvitto…</div>
  if (!receipt) return <div style={{ padding: 40, textAlign: 'center', color: '#EF4444' }}>{error || 'Kvitto hittades inte.'}</div>

  const daysLeft = Math.max(0, Math.ceil((new Date(receipt.return_deadline) - new Date()) / 86400000))

  return (
    <div style={{ maxWidth: 440, margin: '0 auto', padding: '24px 16px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <span style={{ fontWeight: 800, fontSize: 18 }}>Qvitto</span>
        <span style={{ background: '#4ED1D115', color: '#4ED1D1', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>🌿 {receipt.co2_saved}g CO₂ sparat</span>
      </div>

      {view === 'receipt' && (
        <>
          <div style={{ border: '1px solid #E5E7EB', borderRadius: 16, padding: 24, marginBottom: 16 }}>
            <div style={{ borderBottom: '1px dashed #E5E7EB', paddingBottom: 20, marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: 18, fontWeight: 700, margin: '0 0 2px' }}>{receipt.store_name}</p>
                  <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>Org.nr {receipt.store_orgnr}</p>
                  <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>{receipt.store_address}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 11, color: '#6B7280', margin: '0 0 2px' }}>Kvitto #{receipt.id}</p>
                  <p style={{ fontSize: 12, fontWeight: 600, margin: 0 }}>{new Date(receipt.date).toLocaleDateString('sv-SE')}</p>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 14, color: '#6B7280' }}>Moms (20%)</span>
                <span style={{ fontSize: 14, color: '#6B7280' }}>{receipt.vat} kr</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>Totalt</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#4ED1D1' }}>{receipt.total} kr</span>
              </div>
            </div>
            <div style={{ background: '#F5F5F5', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#6B7280' }}>
              ⏱ Returperiod: {daysLeft} dagar kvar
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {saved ? (
              <div style={{ textAlign: 'center', padding: 12, background: '#10B98110', borderRadius: 10, fontSize: 14, color: '#10B981', fontWeight: 600 }}>✓ Sparat till {email}</div>
            ) : (
              <button onClick={() => setView('save')} style={{ background: '#4ED1D1', color: '#fff', border: 'none', borderRadius: 10, padding: 14, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
                Spara kvitto →
              </button>
            )}
            <button onClick={() => setView('return')} disabled={receipt.used_for_return || daysLeft === 0}
              style={{ background: '#fff', color: '#111', border: '1px solid #E5E7EB', borderRadius: 10, padding: 13, fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: (receipt.used_for_return || daysLeft === 0) ? 0.5 : 1 }}>
              {receipt.used_for_return ? 'Retur redan behandlad' : 'Returnera vara'}
            </button>
          </div>
        </>
      )}

      {view === 'save' && (
        <div style={{ border: '1px solid #E5E7EB', borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Spara kvitto</h3>
          <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 20 }}>Inget lösenord. Inget konto. Bara din e-post.</p>
          {error && <p style={{ color: '#EF4444', fontSize: 13, marginBottom: 8 }}>{error}</p>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input style={{ padding: '11px 14px', borderRadius: 10, border: '1px solid #E5E7EB', fontSize: 15 }}
              placeholder="din@email.com" value={email} onChange={e => setEmail(e.target.value)} autoFocus />
            <button onClick={handleSave} style={{ background: '#4ED1D1', color: '#fff', border: 'none', borderRadius: 10, padding: 13, fontWeight: 600, cursor: 'pointer' }}>Skicka kvitto →</button>
            <button onClick={() => setView('receipt')} style={{ background: '#fff', color: '#111', border: '1px solid #E5E7EB', borderRadius: 10, padding: 11, fontSize: 13, cursor: 'pointer' }}>Avbryt</button>
          </div>
        </div>
      )}

      {view === 'return' && (
        <div style={{ border: '1px solid #E5E7EB', borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Returnera vara</h3>
          <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 20 }}>Verifiera din identitet för att generera en retur-QR.</p>
          {error && <p style={{ color: '#EF4444', fontSize: 13, marginBottom: 8 }}>{error}</p>}
          {!otpSent ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input style={{ padding: '11px 14px', borderRadius: 10, border: '1px solid #E5E7EB', fontSize: 15 }}
                placeholder="din@email.com" value={email} onChange={e => setEmail(e.target.value)} autoFocus />
              <button onClick={handleSendOtp} style={{ background: '#4ED1D1', color: '#fff', border: 'none', borderRadius: 10, padding: 13, fontWeight: 600, cursor: 'pointer' }}>Skicka verifieringskod</button>
              <button onClick={() => setView('receipt')} style={{ background: '#fff', color: '#111', border: '1px solid #E5E7EB', borderRadius: 10, padding: 11, fontSize: 13, cursor: 'pointer' }}>Avbryt</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ background: '#4ED1D110', borderRadius: 10, padding: 12, fontSize: 13, color: '#4ED1D1', textAlign: 'center' }}>
                Demo-kod: <strong>482951</strong>
              </div>
              <input style={{ padding: '11px 14px', borderRadius: 10, border: '1px solid #E5E7EB', fontSize: 24, textAlign: 'center', letterSpacing: '0.3em', fontWeight: 700 }}
                placeholder="______" maxLength={6} value={otp} onChange={e => setOtp(e.target.value)} autoFocus />
              <button onClick={handleVerifyOtp} style={{ background: '#4ED1D1', color: '#fff', border: 'none', borderRadius: 10, padding: 13, fontWeight: 600, cursor: 'pointer' }}>Verifiera →</button>
              <button onClick={() => setView('receipt')} style={{ background: '#fff', color: '#111', border: '1px solid #E5E7EB', borderRadius: 10, padding: 11, fontSize: 13, cursor: 'pointer' }}>Avbryt</button>
            </div>
          )}
        </div>
      )}

      {view === 'qr' && returnSession && (
        <div style={{ border: '1px solid #E5E7EB', borderRadius: 16, padding: 24, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#F59E0B15', color: '#F59E0B', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
            ⏱ Går ut om {timer}s
          </div>
          {timer === 0 && <p style={{ color: '#EF4444', fontWeight: 600 }}>QR-koden har gått ut. Börja om.</p>}
          <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 16 }}>Visa denna QR-kod för personalen.</p>
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${window.location.origin}/verify/${returnSession.token}`}
            alt="Retur QR"
            style={{ borderRadius: 8 }}
          />
          <p style={{ fontSize: 11, color: '#6B7280', marginTop: 12 }}>Token: {returnSession.token}</p>
          <button onClick={() => setView('receipt')} style={{ background: '#fff', color: '#111', border: '1px solid #E5E7EB', borderRadius: 10, padding: 11, fontSize: 13, cursor: 'pointer', marginTop: 16 }}>Avbryt</button>
        </div>
      )}
    </div>
  )
}