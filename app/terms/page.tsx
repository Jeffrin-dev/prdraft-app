// app/terms/page.tsx

export const metadata = {
  title: 'Terms of Service — PRDraft',
}

export default function TermsPage() {
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
              Terms of Service
            </h1>
            <p style={{ fontSize: 13, color: '#475569' }}>Last updated: April 7, 2026</p>
          </div>

          {/* Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32, fontSize: 15, lineHeight: 1.7, color: '#94a3b8' }}>

            <section>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e2e8f0', marginBottom: 12 }}>1. Acceptance of Terms</h2>
              <p>These Terms of Service are issued by PRDraft ("the Company", "we", "us"). By installing or using PRDraft ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>
            </section>

            <section>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e2e8f0', marginBottom: 12 }}>2. Description of Service</h2>
              <p>PRDraft is a GitHub App that reads pull request diffs and automatically generates structured pull request descriptions using AI. The Service is provided as a software-as-a-service (SaaS) subscription.</p>
            </section>

            <section>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e2e8f0', marginBottom: 12 }}>3. Free Tier and Paid Plans</h2>
              <p>PRDraft offers a free tier limited to 10 PR descriptions per month. Paid plans provide unlimited PR descriptions for $9 per month. Pricing may change with 30 days notice to existing subscribers.</p>
            </section>

            <section>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e2e8f0', marginBottom: 12 }}>4. Your Data</h2>
              <p>PRDraft accesses your pull request diffs solely to generate descriptions. Diffs are sent to Groq's API for processing and are never stored permanently, sold, or used for training. We store only your GitHub installation ID, account login, and PR metadata (repository name, PR number, PR title) for dashboard functionality.</p>
            </section>

            <section>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e2e8f0', marginBottom: 12 }}>5. Acceptable Use</h2>
              <p>You agree not to misuse the Service, attempt to reverse-engineer it, or use it for any unlawful purpose. You are responsible for all activity that occurs under your GitHub installation.</p>
            </section>

            <section>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e2e8f0', marginBottom: 12 }}>6. Service Availability</h2>
              <p>PRDraft is provided "as is" without guarantees of uptime or availability. We will make reasonable efforts to maintain the Service but are not liable for any downtime or interruption.</p>
            </section>

            <section>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e2e8f0', marginBottom: 12 }}>7. Termination</h2>
              <p>You may stop using the Service at any time by uninstalling the GitHub App. We reserve the right to suspend or terminate access for violations of these terms.</p>
            </section>

            <section>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e2e8f0', marginBottom: 12 }}>8. Limitation of Liability</h2>
              <p>PRDraft is not liable for any indirect, incidental, or consequential damages arising from use of the Service. Our total liability shall not exceed the amount paid by you in the 30 days prior to the claim.</p>
            </section>

            <section>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e2e8f0', marginBottom: 12 }}>9. Changes to Terms</h2>
              <p>We may update these terms from time to time. Continued use of the Service after changes constitutes acceptance of the new terms.</p>
            </section>

            <section>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e2e8f0', marginBottom: 12 }}>10. Contact</h2>
              <p>For questions about these terms, contact us at <a href="mailto:merinjeffrin0@gmail.com">merinjeffrin0@gmail.com</a>.</p>
            </section>

          </div>

          {/* Footer */}
          <div style={{ marginTop: 64, paddingTop: 24, borderTop: '1px solid #0f172a', display: 'flex', gap: 24, fontSize: 13, color: '#475569' }}>
            <a href="/privacy">Privacy Policy</a>
            <a href="/refund">Refund Policy</a>
            <a href="https://prdraft.carrd.co">Home</a>
          </div>

        </div>
      </div>
    </>
  )
}
