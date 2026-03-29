import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: '#111' }}>
      
      {/* Nav */}
      <nav style={{ borderBottom: '1px solid #E5E7EB', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', zIndex: 100 }}>
        <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.04em', color: '#111' }}>qvitto</span>
        <Link href="/create" style={{ background: '#4ED1D1', color: '#fff', padding: '8px 20px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
          Skapa kvitto
        </Link>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '100px 24px 80px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#4ED1D110', color: '#2BB3B3', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 32 }}>
          🌿 ~5g CO₂ sparat per kvitto
        </div>
        <h1 style={{ fontSize: 52, fontWeight: 900, letterSpacing: '-0.04em', margin: '0 0 20px', lineHeight: 1.08, color: '#111' }}>
          Kvitton, levererade<br />
          <span style={{ color: '#4ED1D1' }}>direkt vid kassan.</span>
        </h1>
        <p style={{ fontSize: 18, color: '#6B7280', maxWidth: 420, margin: '0 auto 48px', lineHeight: 1.65 }}>
          Det finansiella lagret efter varje betalning.<br />Billigare än papper. Noll friktion.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/create" style={{ background: '#111', color: '#fff', padding: '14px 28px', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: 15, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Skapa kvitto →
          </Link>
          <Link href="/scan" style={{ background: '#fff', color: '#111', padding: '14px 28px', borderRadius: 12, textDecoration: 'none', fontWeight: 600, fontSize: 15, border: '1px solid #E5E7EB' }}>
            Skanna & verifiera
          </Link>
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px 100px', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
        {[
          { icon: '⚡', title: 'Instant', desc: 'QR genereras på millisekunder. Snabbare än att skriva ut.' },
          { icon: '🔒', title: 'Anti-bedrägeri', desc: 'Säkert returflöde med engångs-QR-tokens som går ut efter 60 sekunder.' },
          { icon: '🌿', title: '~5g CO₂ sparat', desc: 'Per kvitto. Miljöpåverkan visas direkt för kunden.' },
          { icon: '📧', title: 'Email-fallback', desc: 'Om QR inte fungerar skickas kvittot direkt till kundens inbox.' },
          { icon: '📋', title: 'Juridiskt korrekt', desc: 'Org.nr, moms, adress, kvittonummer — allt enligt bokföringslagen.' },
          { icon: '🔄', title: 'Returhantering', desc: 'Kunden verifierar sig, genererar QR, personalen godkänner. Klart.' },
        ].map(f => (
          <div key={f.title} style={{ border: '1px solid #E5E7EB', borderRadius: 14, padding: '24px 20px', background: '#fff' }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: '#111' }}>{f.title}</div>
            <div style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.6 }}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div style={{ borderTop: '1px solid #E5E7EB', background: '#fafafa', padding: '64px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', margin: '0 0 16px' }}>Redo att testa?</h2>
        <p style={{ fontSize: 16, color: '#6B7280', margin: '0 0 32px' }}>Skapa ditt första digitala kvitto på under 30 sekunder.</p>
        <Link href="/create" style={{ background: '#4ED1D1', color: '#fff', padding: '15px 32px', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontSize: 16 }}>
          Skapa kvitto gratis →
        </Link>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #E5E7EB', padding: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0 }}>
          <strong style={{ color: '#111', fontWeight: 800, letterSpacing: '-0.02em' }}>qvitto</strong> · The financial layer after every payment · Cheaper than paper.
        </p>
      </footer>

    </div>
  )
}