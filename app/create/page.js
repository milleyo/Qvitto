'use client'
import { useState } from 'react'

export default function CreatePage() {
  const [form, setForm] = useState({ storeName: '', storeOrgnr: '', storeAddress: '', total: '', vat: '' })
  const [receipt, setReceipt] = useState(null)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async () => {
    if (!form.storeName || !form.total) { setError('Butiksnamn och totalbelopp krävs.'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setReceipt(data.receipt)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  const handleEmail = async () => {
    if (!email.includes('@')) { setError('Ogiltig e-postadress.'); return }
    try {
      await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiptId: receipt.id, email })
      })
      setEmailSent(true)
    } catch {
      setError('Kunde inte skicka e-post.')
    }
  }

  if (receipt) return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, padding: 24, textAlign: 'center', marginBottom: 16 }}>
        <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 16 }}>Kunden skannar denna QR-kod</p>
        <img
          src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/r/${receipt.id}`}
          alt="QR kod"
          style={{ borderRadius: 8 }}
        />
        <p style={{ fontSize: 20, fontWeight: 700, marginTop: 16 }}>{receipt.store_name}</p>
        <p style={{ fontSize: 28, fontWeight: 800, color: '#4ED1D1', margin: '4px 0' }}>{receipt.total} kr</p>
        <p style={{ fontSize: 12, color: '#6B7280' }}>{receipt.id}</p>
      </div>

      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, padding: 24, marginBottom: 16 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', marginBottom: 12 }}>Skicka via e-post</p>
        {emailSent ? (
          <p style={{ color: '#10B981', fontWeight: 600 }}>✓ Skickat!</p>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              style={{ flex: 1, padding: '11px 14px', borderRadius: 10, border: '1px solid #E5E7EB', fontSize: 15 }}
              placeholder="kund@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button onClick={handleEmail} style={{ background: '#4ED1D1', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 16px', fontWeight: 600, cursor: 'pointer' }}>
              Skicka
            </button>
          </div>
        )}
      </div>

      {error && <p style={{ color: '#EF4444', fontSize: 14 }}>{error}</p>}

      <button onClick={() => { setReceipt(null); setForm({ storeName: '', storeOrgnr: '', storeAddress: '', total: '', vat: '' }); setEmailSent(false) }}
        style={{ width: '100%', background: '#4ED1D1', color: '#fff', border: 'none', borderRadius: 10, padding: 14, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>
        Nytt kvitto
      </button>
    </div>
  )

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '40px 24px' }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Skapa kvitto</h1>
      <p style={{ color: '#6B7280', marginBottom: 32 }}>Personalvy — ingen utbildning krävs.</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#6B7280', marginBottom: 6, textTransform: 'uppercase' }}>Butiksnamn *</label>
          <input style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #E5E7EB', fontSize: 15, boxSizing: 'border-box' }}
            placeholder="t.ex. Acta Fashion Stockholm"
            value={form.storeName}
            onChange={e => setForm(f => ({ ...f, storeName: e.target.value }))} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#6B7280', marginBottom: 6, textTransform: 'uppercase' }}>Org.nr</label>
            <input style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #E5E7EB', fontSize: 15, boxSizing: 'border-box' }}
              placeholder="556XXX-XXXX"
              value={form.storeOrgnr}
              onChange={e => setForm(f => ({ ...f, storeOrgnr: e.target.value }))} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#6B7280', marginBottom: 6, textTransform: 'uppercase' }}>Moms (kr)</label>
            <input style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #E5E7EB', fontSize: 15, boxSizing: 'border-box' }}
              type="number" placeholder="Auto (20%)"
              value={form.vat}
              onChange={e => setForm(f => ({ ...f, vat: e.target.value }))} />
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#6B7280', marginBottom: 6, textTransform: 'uppercase' }}>Adress</label>
          <input style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #E5E7EB', fontSize: 15, boxSizing: 'border-box' }}
            placeholder="Drottninggatan 1, Stockholm"
            value={form.storeAddress}
            onChange={e => setForm(f => ({ ...f, storeAddress: e.target.value }))} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#6B7280', marginBottom: 6, textTransform: 'uppercase' }}>Totalbelopp (kr) *</label>
          <input style={{ width: '100%', padding: '14px', borderRadius: 10, border: '1px solid #E5E7EB', fontSize: 20, fontWeight: 700, boxSizing: 'border-box' }}
            type="number" placeholder="0.00"
            value={form.total}
            onChange={e => setForm(f => ({ ...f, total: e.target.value }))} />
        </div>

        {error && <p style={{ color: '#EF4444', fontSize: 14 }}>{error}</p>}

        <button onClick={handleCreate} disabled={loading}
          style={{ width: '100%', background: '#4ED1D1', color: '#fff', border: 'none', borderRadius: 10, padding: 15, fontSize: 16, fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
          {loading ? 'Skapar...' : 'Skapa kvitto →'}
        </button>
      </div>
    </div>
  )
}