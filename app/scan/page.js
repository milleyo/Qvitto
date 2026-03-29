'use client'
import { useState } from 'react'

export default function ScanPage() {
  const [token, setToken] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleVerify = async () => {
    if (!token.trim()) return
    setLoading(true)
    const res = await fetch(`/api/sessions?token=${token.trim()}`)
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  const config = {
    verified: { color: '#10B981', icon: '✓', title: 'GODKÄND', sub: 'Retur godkänd. Markera varan som returnerad.' },
    invalid: { color: '#EF4444', icon: '✗', title: 'OGILTIG', sub: 'Token hittades inte. Be kunden generera en ny.' },
    expired: { color: '#F59E0B', icon: '!', title: 'UTGÅNGEN', sub: 'Token gick ut (>60s). Be kunden generera en ny.' },
    already_used: { color: '#EF4444', icon: '✗', title: 'REDAN ANVÄND', sub: 'Denna retur har redan behandlats.' },
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '40px 24px', fontFamily: 'sans-serif' }}>
      <div style={{ marginBottom: 32 }}>
        <span style={{ fontWeight: 800, fontSize: 18 }}>Qvitto</span>
        <span style={{ marginLeft: 8, fontSize: 13, color: '#6B7280' }}>Personalvy</span>
      </div>

      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Skanna & verifiera</h1>
      <p style={{ color: '#6B7280', fontSize: 15, marginBottom: 32 }}>Ange kundens returtoken för att godkänna retur.</p>

      <div style={{ border: '1px solid #E5E7EB', borderRadius: 16, padding: 24, marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#6B7280', marginBottom: 6, textTransform: 'uppercase' }}>Returtoken</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            style={{ flex: 1, padding: '11px 14px', borderRadius: 10, border: '1px solid #E5E7EB', fontSize: 15, fontFamily: 'monospace', letterSpacing: '0.05em' }}
            placeholder="t.ex. TKAB12CD"
            value={token}
            onChange={e => setToken(e.target.value.toUpperCase())}
            onKeyDown={e => e.key === 'Enter' && handleVerify()}
          />
          <button
            onClick={handleVerify}
            disabled={loading}
            style={{ background: '#4ED1D1', color: '#fff', border: 'none', borderRadius: 10, padding: '11px 20px', fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
          >
            {loading ? '…' : 'Verifiera'}
          </button>
        </div>
      </div>

      {result && (() => {
        const cfg = config[result.status] || config.invalid
        return (
          <div style={{ border: `1px solid ${cfg.color}40`, borderRadius: 16, padding: 32, textAlign: 'center', background: cfg.color + '06' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: cfg.color + '15', border: `3px solid ${cfg.color}`, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, color: cfg.color, fontWeight: 800 }}>
              {cfg.icon}
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: cfg.color, margin: '0 0 8px' }}>{cfg.title}</h2>
            <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 24px' }}>{cfg.sub}</p>
            {result.receipt && (
              <div style={{ background: '#F5F5F5', borderRadius: 10, padding: 16, textAlign: 'left' }}>
                {[
                  { label: 'Butik', value: result.receipt.store_name },
                  { label: 'Totalt', value: result.receipt.total + ' kr' },
                  { label: 'E-post', value: result.session?.user_email },
                  { label: 'Kvitto', value: result.receipt.id },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
                    <span style={{ color: '#6B7280' }}>{row.label}</span>
                    <span style={{ fontWeight: 600 }}>{row.value}</span>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => { setResult(null); setToken('') }}
              style={{ background: '#fff', color: '#111', border: '1px solid #E5E7EB', borderRadius: 10, padding: '10px 20px', fontSize: 13, cursor: 'pointer', marginTop: 16 }}>
              Verifiera ny token
            </button>
          </div>
        )
      })()}
    </div>
  )
}