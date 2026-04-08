// app/refund/page.tsx

export const metadata = {
  title: 'Refund Policy — PRDraft',
}

export default function RefundPage() {
  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #060912; color: #cbd5e1; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        a { color: #22d3ee; text-decoration: none; }
        a:hover { text-decoration: underline; }
      `}</style>
      <div style={{ background: '#060912', minHeight: '100vh', padding: '48px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ marginBottom: 48 }}>
            <a href="https://prdraft.carrd.co" style={{ fontSize: 14, color: '#475569', display: 'inline-block', marginBottom: 32 }}>
              ← PRDraft
            </a>
            <h1 style={{ fontSize: 32, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.02em', marginBottom: 8 }}>
              Refund Policy
            </h1>
            <p style={{ fontSize: 13, color: '#475569' }}>Last updated: April 7, 2026</p>
          </div>

          {/* Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32, fontSize: 15, lineHeight: 1.7, color: '#94a3b8' }}>

            <section>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e2e8f0', marginBottom: 12 }}>30-day refund policy</h2>
              <p>If you are not satisfied with PRDraft for any reason, you may request a full refund within 30 days of your purchase. No questions asked. To request a refund, email <a href="mailto:merinjeffrin0@gmail.com">merinjeffrin0@gmail.com</a> with your GitHub account login and we will process your refund within 5 business days.</p>
            </section>

            <section>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e2e8f0', marginBottom: 12 }}>Cancellations</h2>
              <p>You may cancel your subscription at any time. Cancellation takes effect at the end of the current billing period. You will not be charged again and will retain Pro access until the period ends. No refund is issued for the remaining days.</p>
            </section>

            <section>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e2e8f0', marginBottom: 12 }}>Free tier</h2>
              <p>The free tier is provided at no cost. No refunds are applicable to free tier usage.</p>
            </section>

            <section>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e2e8f0', marginBottom: 12 }}>Contact</h2>
              <p>For refund requests or billing questions, contact <a href="mailto:merinjeffrin0@gmail.com">merinjeffrin0@gmail.com</a>.</p>
            </section>

          </div>

          {/* Footer */}
          <div style={{ marginTop: 64, paddingTop: 24, borderTop: '1px solid #0f172a', display: 'flex', gap: 24, fontSize: 13, color: '#475569' }}>
            <a href="/terms">Terms of Service</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="https://prdraft.carrd.co">Home</a>
          </div>

        </div>
      </div>
    </>
  )
}
