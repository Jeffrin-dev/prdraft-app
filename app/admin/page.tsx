// app/admin/page.tsx
// Your private admin dashboard — access at /admin?key=YOUR_ADMIN_KEY
// Set ADMIN_KEY in your .env.local and Vercel env vars

import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'

type Install = {
  installation_id: number
  account_login: string
  account_type: string
  plan: 'free' | 'pro' | 'canceling'
  pr_count: number
  status: string
  installed_at: string
  uninstalled_at: string | null
  paddle_customer_id: string | null
  paddle_subscription_id: string | null
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'today'
  if (days === 1) return '1d ago'
  return `${days}d ago`
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>
}) {
  const params = await searchParams
  const adminKey = process.env.ADMIN_KEY

  // Simple key-based auth — set ADMIN_KEY in env vars
  if (!adminKey || params.key !== adminKey) return notFound()

  const supabase = getSupabase()

  const { data: installs } = await supabase
    .from('installs')
    .select('*')
    .order('installed_at', { ascending: false })

  const all = (installs ?? []) as Install[]

  const totalInstalls = all.length
  const activeInstalls = all.filter(i => i.status === 'active').length
  const proUsers = all.filter(i => i.plan === 'pro').length
  const freeUsers = all.filter(i => i.plan === 'free' && i.status === 'active').length
  const totalPRs = all.reduce((sum, i) => sum + (i.pr_count ?? 0), 0)
  const mrr = proUsers * 9

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #030507; }
        a { text-decoration: none; color: inherit; }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: '#030507',
        color: '#e2e8f0',
        fontFamily: "'IBM Plex Sans', sans-serif",
        padding: '40px 32px 80px',
        maxWidth: 1000,
        margin: '0 auto',
      }}>

        {/* Header */}
        <div style={{ marginBottom: 40, borderBottom: '1px solid #0f172a', paddingBottom: 24 }}>
          <p style={{ fontSize: 11, color: '#22d3ee', fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>PRDraft</p>
          <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', color: '#f1f5f9' }}>Admin Dashboard</h1>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 40 }}>
          {[
            { label: 'Total installs', value: totalInstalls, accent: '#22d3ee' },
            { label: 'Active', value: activeInstalls, accent: '#34d399' },
            { label: 'Pro users', value: proUsers, accent: '#a78bfa' },
            { label: 'Free users', value: freeUsers, accent: '#94a3b8' },
            { label: 'MRR', value: `$${mrr}`, accent: '#fbbf24' },
          ].map(({ label, value, accent }) => (
            <div key={label} style={{
              background: '#0d1117',
              border: '1px solid #1e293b',
              borderTop: `2px solid ${accent}`,
              borderRadius: 8,
              padding: '16px 20px',
            }}>
              <p style={{ fontSize: 11, color: '#475569', fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</p>
              <p style={{ fontSize: 26, fontWeight: 600, color: accent, fontFamily: "'IBM Plex Mono', monospace" }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Total PRs */}
        <div style={{
          background: '#0d1117',
          border: '1px solid #1e293b',
          borderRadius: 8,
          padding: '16px 24px',
          marginBottom: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: 13, color: '#64748b', fontFamily: "'IBM Plex Mono', monospace" }}>Total PR descriptions generated</span>
          <span style={{ fontSize: 22, fontWeight: 600, color: '#22d3ee', fontFamily: "'IBM Plex Mono', monospace" }}>{totalPRs}</span>
        </div>

        {/* Installs table */}
        <h2 style={{ fontSize: 11, color: '#94a3b8', fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #0f172a' }}>
          All installs
        </h2>

        <div style={{ border: '1px solid #1e293b', borderRadius: 8, overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '180px 80px 70px 100px 130px 1fr',
            padding: '10px 20px',
            background: '#0a0f1a',
            borderBottom: '1px solid #1e293b',
            fontSize: 11,
            color: '#475569',
            fontFamily: "'IBM Plex Mono', monospace",
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>
            <span>Account</span>
            <span>Plan</span>
            <span>PRs</span>
            <span>Status</span>
            <span>Installed</span>
            <span>Install ID</span>
          </div>

          {all.map((install, i) => {
            const planColor = install.plan === 'pro' ? '#a78bfa' : install.plan === 'canceling' ? '#fbbf24' : '#475569'
            const statusColor = install.status === 'active' ? '#34d399' : '#f87171'

            return (
              <div key={install.installation_id} style={{
                display: 'grid',
                gridTemplateColumns: '180px 80px 70px 100px 130px 1fr',
                padding: '14px 20px',
                borderBottom: i < all.length - 1 ? '1px solid #0f172a' : 'none',
                background: '#0d1117',
                alignItems: 'center',
                fontSize: 13,
              }}>
                <span style={{ color: '#e2e8f0', fontWeight: 500 }}>{install.account_login}</span>
                <span style={{
                  display: 'inline-block',
                  padding: '2px 8px',
                  borderRadius: 4,
                  fontSize: 11,
                  fontFamily: "'IBM Plex Mono', monospace",
                  color: planColor,
                  background: `${planColor}18`,
                  border: `1px solid ${planColor}40`,
                  width: 'fit-content',
                }}>
                  {install.plan}
                </span>
                <span style={{ color: '#22d3ee', fontFamily: "'IBM Plex Mono', monospace" }}>{install.pr_count ?? 0}</span>
                <span style={{ color: statusColor, fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" }}>
                  {install.status}
                </span>
                <span style={{ color: '#64748b', fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" }}>
                  {formatDate(install.installed_at)}
                  <span style={{ color: '#334155', display: 'block', fontSize: 11 }}>{timeAgo(install.installed_at)}</span>
                </span>
                <span style={{ color: '#334155', fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" }}>
                  {install.installation_id}
                </span>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <p style={{ marginTop: 40, fontSize: 12, color: '#1e293b', fontFamily: "'IBM Plex Mono', monospace", textAlign: 'center' }}>
          PRDraft Admin · Private · Do not share this URL
        </p>
      </div>
    </>
  )
}
