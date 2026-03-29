'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function VerifyPage() {
  const { token } = useParams()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/sessions?token=${token}`)
      .then(r => r.json())
      .then(d => { setResult(d); setLoading(false) })
      .catch(() => { setResult({ status: 'invalid' }); setLoading(false) })
  }, [token])

  const config = {
    verified: { color: '#10B981', icon: '✓', title: 'GODKÄND', sub: 'Retur godkänd. Markera varan som returnerad.' },
    invalid: { color: '#EF4444', icon: '✗', title: 'OGILTIG', sub: 'Token hittades inte. Be kunden generera en ny.' },
    expired: { color: '#F59E0B', icon: '!', title: 'UTGÅNGEN', sub: 'Token gick ut (>60s). Be kunden generera en ny.' },
    already_used: { color: '#EF4444', icon: '✗', title: 'REDAN ANVÄND', sub: 'Denna retur har redan behandlats.' },
  }

  if (loading) return (
    <div style={{ padding: 40, textAlign: 'center', color: '#6B7280', fontFamily: 'sans-serif' }}>
      Verifierar…
    </div>
  )

  const cfg = config[result?.status] || config.invalid

  return (
    <div style={{ maxWidth: 440, margin: '0 auto', padding: '40px 24px', fontFamily: 'sans-serif' }}>
      <div style={{ marginBottom: 32 }}>
        <span style={{ fontWeight: 800, fontSize: 18 }}>Qvitto</span>
        <span style={{ marginLeft: 8, fontSize: 13, color: '#6B7280' }}>Personalvy</span>
      </div>

      <div style={{ border: `1px solid ${cfg.color}40`, borderRadius: 16, padding: 32, textAlign: 'center', background: cfg.color + '06' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: cfg.color + '15', border: `3px solid ${cfg.color}`,
          margin: '0 auto 20px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: 32, color: cfg.color, fontWeight: 800
        }}>
          {cfg.icon}
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 900, color: cfg.color, margin: '0 0 8px', letterSpacing: '0.02em' }}>
          {cfg.title}
        </h2>
        <p style={{ fontSize: 14, color: '#6B7280', margin: '0 0 24px' }}>{cfg.sub}</p>

        {result?.receipt && (
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
      </div>
    </div>
  )
}