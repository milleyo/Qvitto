export async function sendReceiptEmail({ to, receiptId, storeName, storeOrgnr, storeAddress, total, vat, items = [], date }) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'placeholder') return
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)

  const itemsHtml = items.length > 0 ? items.map(item => `
    <tr>
      <td style="padding:8px 0;font-size:14px;color:#111">${item.name}</td>
      <td style="padding:8px 0;font-size:14px;color:#111;text-align:right">${item.qty} × ${item.price} kr</td>
    </tr>
  `).join('') : `
    <tr>
      <td style="padding:8px 0;font-size:14px;color:#111">Köp</td>
      <td style="padding:8px 0;font-size:14px;color:#111;text-align:right">${total} kr</td>
    </tr>
  `

  await resend.emails.send({
    from: 'Qvitto <onboarding@resend.dev>',
    to,
    subject: `Kvitto från ${storeName}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:520px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08)">
    
    <!-- Header -->
    <div style="padding:32px 32px 24px;border-bottom:1px solid #E5E7EB">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div>
          <p style="margin:0 0 2px;font-size:26px;font-weight:800;letter-spacing:-0.03em;color:#111">qvitto</p>
          <p style="margin:0;font-size:13px;color:#6B7280">Digitalt kvitto</p>
        </div>
        <div style="text-align:right">
          <p style="margin:0;font-size:12px;color:#6B7280">Kvittonr</p>
          <p style="margin:0;font-size:13px;font-weight:600;color:#111">${receiptId}</p>
        </div>
      </div>
    </div>

    <!-- Store info -->
    <div style="padding:24px 32px;border-bottom:1px solid #E5E7EB;background:#fafafa">
      <p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#111">${storeName}</p>
      <p style="margin:0;font-size:13px;color:#6B7280">Org.nr: ${storeOrgnr || '—'}</p>
      <p style="margin:0;font-size:13px;color:#6B7280">${storeAddress || '—'}</p>
      <p style="margin:8px 0 0;font-size:13px;color:#6B7280">Datum: ${new Date(date).toLocaleDateString('sv-SE')}</p>
    </div>

    <!-- Items -->
    <div style="padding:24px 32px;border-bottom:1px solid #E5E7EB">
      <table style="width:100%;border-collapse:collapse">
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr style="border-top:1px dashed #E5E7EB">
            <td style="padding:12px 0 4px;font-size:13px;color:#6B7280">Varav moms</td>
            <td style="padding:12px 0 4px;font-size:13px;color:#6B7280;text-align:right">${vat ? vat + ' kr' : '—'}</td>
          </tr>
          <tr>
            <td style="padding:4px 0;font-size:16px;font-weight:800;color:#111">Totalt</td>
            <td style="padding:4px 0;font-size:16px;font-weight:800;color:#4ED1D1;text-align:right">${total} kr</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- CTA -->
    <div style="padding:24px 32px;border-bottom:1px solid #E5E7EB;text-align:center">
      <a href="https://qvitto-cw2b.vercel.app/r/${receiptId}" 
         style="display:inline-block;background:#4ED1D1;color:#fff;padding:13px 32px;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px">
        Öppna kvitto →
      </a>
      <p style="margin:12px 0 0;font-size:12px;color:#6B7280">Eller skanna QR-koden i butik för retur</p>
    </div>

    <!-- Trust -->
    <div style="padding:20px 32px;border-bottom:1px solid #E5E7EB;background:#fafafa">
      <p style="margin:0 0 6px;font-size:13px;color:#6B7280">✔ Detta kvitto är digitalt verifierat</p>
      <p style="margin:0 0 6px;font-size:13px;color:#6B7280">✔ Giltigt för retur i 30 dagar</p>
      <p style="margin:0;font-size:13px;color:#6B7280">✔ Sparas i 7 år enligt bokföringslagen</p>
    </div>

    <!-- Footer -->
    <div style="padding:20px 32px;text-align:center">
      <p style="margin:0 0 8px;font-size:13px;color:#6B7280">
        Få alla dina kvitton automatiskt →
        <a href="https://qvitto-cw2b.vercel.app" style="color:#4ED1D1;text-decoration:none;font-weight:600">Skapa konto på Qvitto</a>
      </p>
      <p style="margin:8px 0 0;font-size:11px;color:#9CA3AF">Qvitto — The financial layer after every payment · Cheaper than paper.</p>
    </div>

  </div>
</body>
</html>
    `
  })
}