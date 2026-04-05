// app/dashboard/page.tsx
//
// HOW TO USE:
// 1. Copy this file to your project at: app/dashboard/page.tsx
// 2. In GitHub App settings → "Setup URL": https://prdraft-app.vercel.app/dashboard
//    GitHub will append ?installation_id=XXX automatically after every install.
// 3. (Optional) Update your Carrd CTA to link here too, with a note:
//    "After installing, you'll be redirected to your dashboard automatically."
//
// This page reads ?installation_id from the URL, fetches from Supabase,
// and renders the dashboard — no OAuth needed for v1.

import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'

// ─── Types ────────────────────────────────────────────────────────────────────

type Install = {
  installation_id: number
  account_login: string
  account_type: string
  plan: 'free' | 'pro'
  pr_count: number
  status: string
  installed_at: string
  uninstalled_at: string | null
}

type PREvent = {
  id: number
  installation_id: number
  repo_full_name: string
  pr_number: number
  created_at: string
}

// ─── Supabase (server-side only — uses service role key) ─────────────────────

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function NoInstallation() {
  return (
    <Shell>
      <div style={styles.emptyState}>
        <div style={styles.emptyIcon}>⚠</div>
        <h2 style={styles.emptyTitle}>No installation found</h2>
        <p style={styles.emptyText}>
          Install PRDraft on GitHub and you&apos;ll be redirected here automatically.
        </p>
        <a
          href="https://github.com/apps/prdraft"
          style={styles.ctaButton}
        >
          Install PRDraft →
        </a>
      </div>
    </Shell>
  )
}

function Uninstalled({ login }: { login: string }) {
  return (
    <Shell>
      <div style={styles.emptyState}>
        <div style={{ ...styles.emptyIcon, color: '#f87171' }}>✕</div>
        <h2 style={styles.emptyTitle}>App uninstalled</h2>
        <p style={styles.emptyText}>
          PRDraft was removed from <strong style={{ color: '#e2e8f0' }}>{login}</strong>.
          Reinstall to start generating PR descriptions again.
        </p>
        <a
          href="https://github.com/apps/prdraft"
          style={styles.ctaButton}
        >
          Reinstall PRDraft →
        </a>
      </div>
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{globalStyles}</style>
      <div style={styles.root}>
        <div style={styles.dotGrid} aria-hidden />
        <header style={styles.header}>
          <div style={styles.headerInner}>
            <div style={styles.logo}>
              <span style={styles.logoMark}>◈</span>
              <span style={styles.logoText}>PRDraft</span>
            </div>
            <a
              href="https://prdraft.carrd.co"
              style={styles.headerLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              ↗ prdraft.carrd.co
            </a>
          </div>
        </header>
        <main style={styles.main}>{children}</main>
        <footer style={styles.footer}>
          <span style={styles.footerText}>
            PRDraft · Built by Jeffrin · Kerala, India
          </span>
          <div style={styles.footerLinks}>
            <a href="https://prdraft.carrd.co" style={styles.footerLink}>Home</a>
            <span style={{ color: '#334155' }}>·</span>
            <a href="https://github.com/Jeffrin-dev/prdraft-app" style={styles.footerLink}>GitHub</a>
          </div>
        </footer>
      </div>
    </>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

function Dashboard({
  install,
  recentPRs,
}: {
  install: Install
  recentPRs: PREvent[]
}) {
  const prCount = install.pr_count ?? 0
  const isPro = install.plan === 'pro'
  const cap = 5 // free tier cap
  const pct = isPro ? 100 : Math.min((prCount / cap) * 100, 100)
  const isAtCap = !isPro && prCount >= cap
  const isNearCap = !isPro && prCount >= cap - 1 && prCount < cap

  const barColor = isAtCap
    ? '#f87171'
    : isNearCap
    ? '#fbbf24'
    : '#22d3ee'

  return (
    <Shell>
      {/* Page heading */}
      <div style={styles.pageHeading}>
        <div>
          <p style={styles.pageSubtitle}>Dashboard</p>
          <h1 style={styles.pageTitle}>
            {install.account_login}
            <span style={styles.accountType}>{install.account_type}</span>
          </h1>
        </div>
        <span style={isPro ? styles.badgePro : styles.badgeFree}>
          {isPro ? '★ Pro' : 'Free'}
        </span>
      </div>

      {/* Stat cards */}
      <div style={styles.statsGrid}>
        <StatCard
          label="PRs Described"
          value={String(prCount)}
          sub={isPro ? 'unlimited plan' : `of ${cap} this month`}
          accent="#22d3ee"
        />
        <StatCard
          label="Plan"
          value={isPro ? 'Pro' : 'Free'}
          sub={isPro ? '$9 / month' : '5 PRs / month'}
          accent={isPro ? '#a78bfa' : '#94a3b8'}
        />
        <StatCard
          label="Installed"
          value={formatDate(install.installed_at)}
          sub="active installation"
          accent="#34d399"
          mono={false}
        />
      </div>

      {/* Usage bar */}
      {!isPro && (
        <div style={styles.usageCard}>
          <div style={styles.usageHeader}>
            <span style={styles.usageLabel}>Free tier usage</span>
            <span style={{ ...styles.usageCount, color: barColor }}>
              {prCount} / {cap} PRs
            </span>
          </div>
          <div style={styles.barTrack}>
            <div
              style={{
                ...styles.barFill,
                width: `${pct}%`,
                background: barColor,
                boxShadow: `0 0 12px ${barColor}60`,
              }}
            />
          </div>
          {isAtCap && (
            <p style={{ ...styles.usageNote, color: '#f87171' }}>
              ✕ Cap reached — new PRs won&apos;t get descriptions until you upgrade.
            </p>
          )}
          {isNearCap && (
            <p style={{ ...styles.usageNote, color: '#fbbf24' }}>
              ⚠ 1 PR left on the free tier.
            </p>
          )}
          {!isAtCap && !isNearCap && (
            <p style={styles.usageNote}>
              {cap - prCount} PR{cap - prCount !== 1 ? 's' : ''} remaining this month.
            </p>
          )}
        </div>
      )}

      {/* Upgrade CTA */}
      {!isPro && (
        <div style={isAtCap ? styles.upgradeCardUrgent : styles.upgradeCard}>
          <div>
            <p style={styles.upgradeTitle}>
              {isAtCap ? 'Upgrade to keep going' : 'Upgrade to Pro'}
            </p>
            <p style={styles.upgradeText}>
              {isAtCap
                ? 'You\'ve hit the free tier cap. Upgrade for unlimited PR descriptions.'
                : 'Unlimited PR descriptions, priority support. $9/month.'}
            </p>
          </div>
          <a
            href={`mailto:merinjeffrin0@gmail.com?subject=PRDraft Pro upgrade&body=Hi, I'd like to upgrade to Pro. My installation: ${install.installation_id} (${install.account_login})`}
            style={isAtCap ? styles.upgradeButtonUrgent : styles.upgradeButton}
          >
            Upgrade — $9/mo →
          </a>
        </div>
      )}

      {/* Recent activity */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Recent activity</h2>

        {recentPRs.length === 0 ? (
          <div style={styles.emptyActivity}>
            <p style={styles.emptyActivityText}>
              No PRs yet. Open a pull request on any repo where PRDraft is installed.
            </p>
          </div>
        ) : (
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <span style={styles.colRepo}>Repository</span>
              <span style={styles.colPR}>PR</span>
              <span style={styles.colTime}>When</span>
            </div>
            {recentPRs.map((pr) => (
              <a
                key={pr.id}
                href={`https://github.com/${pr.repo_full_name}/pull/${pr.pr_number}`}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.tableRow}
              >
                <span style={styles.colRepo}>
                  <span style={styles.repoIcon}>◈</span>
                  {pr.repo_full_name}
                </span>
                <span style={styles.colPR}>
                  <span style={styles.prNumber}>#{pr.pr_number}</span>
                </span>
                <span style={{ ...styles.colTime, color: '#64748b' }}>
                  {timeAgo(pr.created_at)}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Installed on */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Installation</h2>
        <div style={styles.infoCard}>
          <InfoRow label="Account" value={install.account_login} />
          <InfoRow label="Type" value={install.account_type} />
          <InfoRow label="Installation ID" value={String(install.installation_id)} mono />
          <InfoRow label="Plan" value={install.plan === 'pro' ? 'Pro ($9/mo)' : 'Free (5 PRs/month)'} />
          <InfoRow label="Installed" value={formatDate(install.installed_at)} />
          <InfoRow label="Status" value={install.status} />
        </div>
      </div>
    </Shell>
  )
}

function StatCard({
  label,
  value,
  sub,
  accent,
  mono = true,
}: {
  label: string
  value: string
  sub: string
  accent: string
  mono?: boolean
}) {
  return (
    <div style={{ ...styles.statCard, borderTopColor: accent }}>
      <p style={styles.statLabel}>{label}</p>
      <p style={{ ...styles.statValue, color: accent, fontFamily: mono ? 'var(--font-mono)' : 'inherit' }}>
        {value}
      </p>
      <p style={styles.statSub}>{sub}</p>
    </div>
  )
}

function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div style={styles.infoRow}>
      <span style={styles.infoLabel}>{label}</span>
      <span style={{ ...styles.infoValue, fontFamily: mono ? 'var(--font-mono)' : 'inherit' }}>
        {value}
      </span>
    </div>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Syne:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #060912; }

  a { text-decoration: none; }
  a:hover { opacity: 0.8; }

  .table-row-hover:hover {
    background: rgba(34, 211, 238, 0.04) !important;
    border-color: rgba(34, 211, 238, 0.15) !important;
  }
`

const styles: Record<string, React.CSSProperties> = {
  root: {
    minHeight: '100vh',
    background: '#060912',
    color: '#e2e8f0',
    fontFamily: "'Syne', sans-serif",
    position: 'relative',
    overflow: 'hidden',
  },
  dotGrid: {
    position: 'fixed',
    inset: 0,
    backgroundImage: 'radial-gradient(circle, #1e293b 1px, transparent 1px)',
    backgroundSize: '28px 28px',
    opacity: 0.35,
    pointerEvents: 'none',
    zIndex: 0,
  },

  // Header
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    borderBottom: '1px solid #0f172a',
    background: 'rgba(6, 9, 18, 0.85)',
    backdropFilter: 'blur(12px)',
  },
  headerInner: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '16px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  logoMark: {
    fontSize: 20,
    color: '#22d3ee',
    lineHeight: 1,
  },
  logoText: {
    fontSize: 17,
    fontWeight: 700,
    letterSpacing: '-0.02em',
    color: '#f1f5f9',
  },
  headerLink: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: "'IBM Plex Mono', monospace",
    letterSpacing: '0.02em',
  },

  // Main
  main: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '48px 24px 80px',
    position: 'relative',
    zIndex: 1,
  },

  // Page heading
  pageHeading: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  pageSubtitle: {
    fontSize: 12,
    color: '#22d3ee',
    fontFamily: "'IBM Plex Mono', monospace",
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: 700,
    letterSpacing: '-0.03em',
    color: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  accountType: {
    fontSize: 13,
    fontWeight: 500,
    color: '#475569',
    fontFamily: "'IBM Plex Mono', monospace",
    letterSpacing: '0.02em',
  },
  badgeFree: {
    padding: '4px 12px',
    borderRadius: 4,
    border: '1px solid #1e293b',
    background: 'transparent',
    color: '#64748b',
    fontSize: 12,
    fontFamily: "'IBM Plex Mono', monospace",
    letterSpacing: '0.05em',
  },
  badgePro: {
    padding: '4px 12px',
    borderRadius: 4,
    border: '1px solid #7c3aed40',
    background: '#7c3aed18',
    color: '#a78bfa',
    fontSize: 12,
    fontFamily: "'IBM Plex Mono', monospace",
    letterSpacing: '0.05em',
  },

  // Stats grid
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    background: '#0d1117',
    border: '1px solid #1e293b',
    borderTop: '2px solid',
    borderRadius: 8,
    padding: '20px 24px',
  },
  statLabel: {
    fontSize: 11,
    color: '#475569',
    fontFamily: "'IBM Plex Mono', monospace",
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: '-0.03em',
    marginBottom: 4,
    fontFamily: "'IBM Plex Mono', monospace",
  },
  statSub: {
    fontSize: 12,
    color: '#475569',
  },

  // Usage bar
  usageCard: {
    background: '#0d1117',
    border: '1px solid #1e293b',
    borderRadius: 8,
    padding: '20px 24px',
    marginBottom: 16,
  },
  usageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  usageLabel: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: "'IBM Plex Mono', monospace",
    letterSpacing: '0.05em',
  },
  usageCount: {
    fontSize: 13,
    fontFamily: "'IBM Plex Mono', monospace",
    fontWeight: 500,
  },
  barTrack: {
    height: 4,
    background: '#1e293b',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 10,
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
    transition: 'width 0.6s ease',
  },
  usageNote: {
    fontSize: 12,
    color: '#475569',
    fontFamily: "'IBM Plex Mono', monospace",
  },

  // Upgrade cards
  upgradeCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
    background: '#0d1117',
    border: '1px solid #1e293b',
    borderRadius: 8,
    padding: '20px 24px',
    marginBottom: 40,
  },
  upgradeCardUrgent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 24,
    background: '#1a0a0a',
    border: '1px solid #7f1d1d',
    borderRadius: 8,
    padding: '20px 24px',
    marginBottom: 40,
  },
  upgradeTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: '#e2e8f0',
    marginBottom: 4,
  },
  upgradeText: {
    fontSize: 13,
    color: '#64748b',
    maxWidth: 380,
  },
  upgradeButton: {
    flexShrink: 0,
    padding: '10px 20px',
    background: 'transparent',
    border: '1px solid #22d3ee',
    borderRadius: 6,
    color: '#22d3ee',
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "'IBM Plex Mono', monospace",
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  upgradeButtonUrgent: {
    flexShrink: 0,
    padding: '10px 20px',
    background: '#ef4444',
    border: '1px solid #ef4444',
    borderRadius: 6,
    color: '#fff',
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "'IBM Plex Mono', monospace",
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },

  // Sections
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: '#94a3b8',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    fontFamily: "'IBM Plex Mono', monospace",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottom: '1px solid #0f172a',
  },

  // Table
  table: {
    border: '1px solid #1e293b',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '1fr 80px 100px',
    padding: '10px 20px',
    background: '#0a0f1a',
    borderBottom: '1px solid #1e293b',
    fontSize: 11,
    color: '#475569',
    fontFamily: "'IBM Plex Mono', monospace",
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 80px 100px',
    padding: '14px 20px',
    borderBottom: '1px solid #0f172a',
    background: '#0d1117',
    cursor: 'pointer',
    transition: 'background 0.15s, border-color 0.15s',
    color: 'inherit',
    alignItems: 'center',
  },
  colRepo: {
    fontSize: 13,
    color: '#cbd5e1',
    fontFamily: "'IBM Plex Mono', monospace",
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  colPR: {
    fontSize: 13,
    fontFamily: "'IBM Plex Mono', monospace",
  },
  colTime: {
    fontSize: 12,
    fontFamily: "'IBM Plex Mono', monospace",
    textAlign: 'right' as const,
  },
  repoIcon: {
    color: '#22d3ee',
    fontSize: 10,
    flexShrink: 0,
  },
  prNumber: {
    color: '#22d3ee',
  },

  // Info card
  infoCard: {
    background: '#0d1117',
    border: '1px solid #1e293b',
    borderRadius: 8,
    overflow: 'hidden',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 20px',
    borderBottom: '1px solid #0f172a',
    fontSize: 13,
  },
  infoLabel: {
    color: '#475569',
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 12,
  },
  infoValue: {
    color: '#cbd5e1',
    fontFamily: 'inherit',
    fontSize: 13,
  },

  // Empty states
  emptyState: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    textAlign: 'center' as const,
    gap: 16,
  },
  emptyIcon: {
    fontSize: 36,
    color: '#22d3ee',
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: '#f1f5f9',
    letterSpacing: '-0.02em',
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
    maxWidth: 340,
    lineHeight: 1.6,
  },
  emptyActivity: {
    background: '#0d1117',
    border: '1px solid #1e293b',
    borderRadius: 8,
    padding: '32px 24px',
    textAlign: 'center' as const,
  },
  emptyActivityText: {
    fontSize: 13,
    color: '#475569',
    fontFamily: "'IBM Plex Mono', monospace",
  },

  // CTA button (empty state)
  ctaButton: {
    marginTop: 8,
    padding: '12px 24px',
    background: '#22d3ee',
    borderRadius: 6,
    color: '#060912',
    fontSize: 14,
    fontWeight: 700,
    fontFamily: "'IBM Plex Mono', monospace",
    display: 'inline-block',
  },

  // Footer
  footer: {
    position: 'relative',
    zIndex: 1,
    borderTop: '1px solid #0f172a',
    padding: '20px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: 900,
    margin: '0 auto',
  },
  footerText: {
    fontSize: 12,
    color: '#334155',
    fontFamily: "'IBM Plex Mono', monospace",
  },
  footerLinks: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
  },
  footerLink: {
    fontSize: 12,
    color: '#475569',
    fontFamily: "'IBM Plex Mono', monospace",
  },
}

// ─── Page entry point ─────────────────────────────────────────────────────────

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ installation_id?: string }>
}) {
  const params = await searchParams
  const rawId = params.installation_id

  if (!rawId) return <NoInstallation />

  const installationId = parseInt(rawId, 10)
  if (isNaN(installationId)) return <NoInstallation />

  const supabase = getSupabase()

  const { data: install } = await supabase
    .from('installs')
    .select('*')
    .eq('installation_id', installationId)
    .single<Install>()

  if (!install) return notFound()

  if (install.status === 'uninstalled') {
    return <Uninstalled login={install.account_login} />
  }

  const { data: recentPRs } = await supabase
    .from('pr_events')
    .select('*')
    .eq('installation_id', installationId)
    .order('created_at', { ascending: false })
    .limit(10)

  return <Dashboard install={install} recentPRs={recentPRs ?? []} />
}
