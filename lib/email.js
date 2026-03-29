export async function sendReceiptEmail({ to, receiptId, storeName, total, date }) {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'placeholder') return

  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)

  await resend.emails.send({
    from: 'Qvitto <onboarding@resend.dev>',
    to,
    subject: `Ditt kvitto från ${storeName}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
        <h2 style="font-size:24px;font-weight:800;margin-bottom:4px">Qvitto</h2>
        <p style="color:#6B7280;margin-bottom:32px">Digitalt kvitto</p>
        <div style="border:1px solid #E5E7EB;border-radius:12px;padding:24px;margin-bottom:24px">
          <p style="font-size:18px;font-weight:700;margin:0 0 4px">${storeName}</p>
          <p style="color:#6B7280;font-size:14px;margin:0 0 20px">${new Date(date).toLocaleDateString('sv-SE')}</p>
          <p style="font-size:28px;font-weight:800;color:#4ED1D1;margin:0">${total} kr</p>
        </div>
        <a href="https://qvitto-nine.vercel.app/r/${receiptId}" 
           style="display:block;background:#4ED1D1;color:#fff;text-align:center;padding:14px;border-radius:10px;text-decoration:none;font-weight:600">
          Öppna kvitto
        </a>
        <p style="color:#6B7280;font-size:12px;text-align:center;margin-top:24px">
          Cheaper than paper. · Qvitto
        </p>
      </div>
    `
  })
}
