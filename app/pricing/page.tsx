// app/pricing/page.tsx

export const metadata = {
  title: 'Pricing — PRDraft',
}

export default function PricingPage() {
  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #060912; color: #cbd5e1; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
        a { color: #22d3ee; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .card:hover { border-color: #22d3ee !important; }
      `}</style>
      <div style={{ background: '#060912', minHeight: '100vh', padding: '48px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>

          {/* Header */}
          <div style={{ marginBottom: 64, textAlign: 'center' }}>
            <a href="https://prdraft.carrd.co" style={{ fontSize: 14, color: '#475569', display: 'inline-block', marginBottom: 32 }}>
              ← PRDraft
            </a>
            <h1 style={{ fontSize: 36, fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.02em', marginBottom: 12 }}>
              Simple pricing
            </h1>
            <p style={{ fontSize: 16, color: '#64748b', maxWidth: 420, margin: '0 auto' }}>
              Start free. Upgrade when you need more.
            </p>
          </div>

          {/* Pricing cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 64 }}>

            {/* Free */}
            <div className="card" style={{
              background: '#0d1117',
              border: '1px solid #1e293b',
              borderRadius: 12,
              padding: '32px 28px',
              transition: 'border-color 0.2s',
            }}>
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#475569', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 12 }}>Free</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: 40, fontWeight: 700, color: '#f1f5f9' }}>$0</span>
                  <span style={{ fontSize: 14, color: '#475569' }}>/month</span>
                </div>
                <p style={{ fontSize: 14, color: '#64748b', marginTop: 8 }}>No credit card required</p>
              </div>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                {[
                  '5 PR descriptions/month',
                  'Auto-generated from diff',
                  'Structured format',
                  '2-click GitHub install',
                  'Dashboard with usage stats',
                ].map((item) => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#94a3b8' }}>
                    <span style={{ color: '#22d3ee', fontSize: 12 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href="https://github.com/apps/prdraft"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '12px 20px',
                  background: 'transparent',
                  border: '1px solid #1e293b',
                  borderRadius: 8,
                  color: '#94a3b8',
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: 'monospace',
                }}
              >
                Install on GitHub →
              </a>
            </div>

            {/* Pro */}
            <div className="card" style={{
              background: '#0d1117',
              border: '1px solid #22d3ee',
              borderRadius: 12,
              padding: '32px 28px',
              position: 'relative',
              transition: 'border-color 0.2s',
            }}>
              <div style={{
                position: 'absolute',
                top: -12,
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#22d3ee',
                color: '#060912',
                fontSize: 11,
                fontWeight: 700,
                fontFamily: 'monospace',
                padding: '4px 12px',
                borderRadius: 20,
                whiteSpace: 'nowrap',
              }}>
                MOST POPULAR
              </div>

              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#22d3ee', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'monospace', marginBottom: 12 }}>Pro</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: 40, fontWeight: 700, color: '#f1f5f9' }}>$9</span>
                  <span style={{ fontSize: 14, color: '#475569' }}>/month</span>
                </div>
                <p style={{ fontSize: 14, color: '#64748b', marginTop: 8 }}>Cancel anytime</p>
              </div>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                {[
                  'Unlimited PR descriptions',
                  'Auto-generated from diff',
                  'Structured format',
                  '2-click GitHub install',
                  'Dashboard with usage stats',
                  'Priority support',
                ].map((item) => (
                  <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#94a3b8' }}>
                    <span style={{ color: '#22d3ee', fontSize: 12 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href="https://github.com/apps/prdraft"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '12px 20px',
                  background: '#22d3ee',
                  border: '1px solid #22d3ee',
                  borderRadius: 8,
                  color: '#060912',
                  fontSize: 14,
                  fontWeight: 700,
                  fontFamily: 'monospace',
                }}
              >
                Get Started →
              </a>
            </div>

          </div>

          {/* FAQ */}
          <div style={{ marginBottom: 64 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 32, textAlign: 'center' }}>Common questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {[
                {
                  q: 'How does the free tier work?',
                  a: 'Install PRDraft on GitHub and you get 5 auto-generated PR descriptions per month at no cost. No credit card required.',
                },
                {
                  q: 'What happens when I hit the free tier cap?',
                  a: 'PRDraft posts a comment on your PR letting you know the cap has been reached. Your existing PRs are unaffected.',
                },
                {
                  q: 'Does PRDraft store my code?',
                  a: 'No. Your diff is sent to Groq\'s API to generate the description and is never stored. We only store PR metadata like repo name, PR number, and PR title.',
                },
                {
                  q: 'Can I cancel anytime?',
                  a: 'Yes. Cancel from your dashboard at any time. You keep Pro access until the end of the billing period.',
                },
              ].map(({ q, a }) => (
                <div key={q} style={{ borderBottom: '1px solid #0f172a', paddingBottom: 24 }}>
                  <p style={{ fontSize: 15, fontWeight: 600, color: '#e2e8f0', marginBottom: 8 }}>{q}</p>
                  <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>{a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{ paddingTop: 24, borderTop: '1px solid #0f172a', display: 'flex', gap: 24, fontSize: 13, color: '#475569' }}>
            <a href="/terms">Terms of Service</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/refund">Refund Policy</a>
            <a href="https://prdraft.carrd.co">Home</a>
          </div>

        </div>
      </div>
    </>
  )
}
