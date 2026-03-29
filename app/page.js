import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', fontFamily: 'sans-serif', color: '#111' }}>
      <nav style={{ borderBottom: '1px solid #E5E7EB', padding: '0 24px', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 800, fontSize: 18 }}>Qvitto</span>
        <Link href="/create" style={{ background: '#4ED1D1', color: '#fff', padding: '8px 18px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
          Skapa kvitto
        </Link>
      </nav>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 48, fontWeight: 800, letterSpacing: '-0.04em', margin: '0 0 16px', lineHeight: 1.1 }}>
          Kvitton, levererade<br />
          <span style={{ color: '#4ED1D1' }}>direkt vid kassan.</span>
        </h1>
        <p style={{ fontSize: 18, color: '#6B7280', maxWidth: 400, margin: '0 auto 48px', lineHeight: 1.6 }}>
          Det finansiella lagret efter varje betalning. Billigare än papper. Noll friktion.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64 }}>
          <Link href="/create" style={{ background: '#4ED1D1', color: '#fff', padding: '14px 28px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 16, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Skapa kvitto →
          </Link>
          <Link href="/scan" style={{ background: '#fff', color: '#111', padding: '14px 28px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 16, border: '1px solid #E5E7EB' }}>
            Skanna & verifiera
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, textAlign: 'left' }}>
          {[
            { icon: '⚡', title: 'Instant', desc: 'QR genereras på millisekunder. Snabbare än att skriva ut.' },
            { icon: '🔒', title: 'Anti-bedrägeri', desc: 'Säkert returflöde med engångs-QR-tokens.' },
            { icon: '🌿', title: '~5g CO₂ sparat', desc: 'Per kvitto. Synligt för kunder.' },
          ].map(f => (
            <div key={f.title} style={{ border: '1px solid #E5E7EB', borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <footer style={{ borderTop: '1px solid #E5E7EB', padding: '20px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: '#6B7280', margin: 0 }}>
          <strong style={{ color: '#111' }}>Qvitto</strong> · Det finansiella lagret efter varje betalning · Billigare än papper.
        </p>
      </footer>
    </div>
  )
}