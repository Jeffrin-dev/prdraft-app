// app/privacy/page.tsx

export const metadata = {
  title: 'Privacy Policy — PRDraft',
}

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p style={{ fontSize: 13, color: '#475569' }}>Last updated: April 7, 2026</p>
          </div>

          {/* Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32, fontSize: 15, lineHeight: 1.7, color: '#94a3b8' }}>

            <section>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e2e8f0', marginBottom: 12 }}>What we collect</h2>
              <p>When you install PRDraft, we store:</p>
              <ul style={{ marginTop: 12, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <li>Your GitHub installation ID</li>
                <li>Your GitHub account login and account type (User or Organization)</li>
                <li>PR metadata: repository name, PR number, PR title, and timestamp</li>
                <li>Your plan (free or pro) and PR count for billing purposes</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e2e8f0', marginBottom: 12 }}>What we do not collect</h2>
              <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <li>We do not store your code or PR diffs</li>
                <li>We do not store the generated PR descriptions</li>
                <li>We do not collect your email address</li>
                <li>We do not track you across other websites</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e2e8f0', marginBottom: 12 }}>How your diff is processed</h2>
              <p>When you open a pull request, PRDraft fetches the diff via the GitHub API and sends it to Groq's API (groq.com) to generate a description. The diff is processed in real time and is not stored by PRDraft or Groq. Groq's privacy policy applies to this processing.</p>
            </section>

            <section>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e2e8f0', marginBottom: 12 }}>Third-party services</h2>
              <p>PRDraft uses the following third-party services:</p>
              <ul style={{ marginTop: 12, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <li><strong style={{ color: '#e2e8f0' }}>Supabase</strong> — stores installation and PR metadata</li>
                <li><strong style={{ color: '#e2e8f0' }}>Groq</strong> — processes diffs to generate descriptions</li>
                <li><strong style={{ color: '#e2e8f0' }}>Vercel</strong> — hosts the application</li>
                <li><strong style={{ color: '#e2e8f0' }}>GitHub</strong> — provides the App platform and webhook events</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e2e8f0', marginBottom: 12 }}>Data retention</h2>
              <p>We retain your installation data for as long as your GitHub App installation is active. When you uninstall PRDraft, your installation is marked as inactive. You can request deletion of your data by contacting us.</p>
            </section>

            <section>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e2e8f0', marginBottom: 12 }}>Your rights</h2>
              <p>You may request access to, correction of, or deletion of your personal data at any time by contacting us at <a href="mailto:merinjeffrin0@gmail.com">merinjeffrin0@gmail.com</a>. We will respond within 30 days.</p>
            </section>

            <section>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#e2e8f0', marginBottom: 12 }}>Contact</h2>
              <p>For privacy questions, contact <a href="mailto:merinjeffrin0@gmail.com">merinjeffrin0@gmail.com</a>.</p>
            </section>

          </div>

          {/* Footer */}
          <div style={{ marginTop: 64, paddingTop: 24, borderTop: '1px solid #0f172a', display: 'flex', gap: 24, fontSize: 13, color: '#475569' }}>
            <a href="/terms">Terms of Service</a>
            <a href="/refund">Refund Policy</a>
            <a href="https://prdraft.carrd.co">Home</a>
          </div>

        </div>
      </div>
    </>
  )
}
