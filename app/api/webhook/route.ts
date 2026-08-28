import { App } from '@octokit/app'
import { createClient } from '@supabase/supabase-js'
import Groq from 'groq-sdk'

const FREE_TIER_PR_LIMIT = 10

const app = new App({
  appId: process.env.GITHUB_APP_ID!,
  privateKey: process.env.GITHUB_PRIVATE_KEY!.replace(/\\n/g, '\n'),
  webhooks: {
    secret: process.env.GITHUB_WEBHOOK_SECRET!,
  },
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

type LogContext = {
  deliveryId: string
  event: string
  action?: string
  installationId?: number
  repoFullName?: string
  prNumber?: number
}

type Install = {
  installation_id: number
  plan: 'free' | 'pro' | 'canceling'
  status: string
  pr_count: number | null
}

function logWebhookStep(step: string, context: LogContext, details: Record<string, unknown> = {}) {
  console.log('[webhook]', step, { ...context, ...details })
}

function logWebhookExit(reason: string, context: LogContext, details: Record<string, unknown> = {}) {
  console.log('[webhook] exit', { reason, ...context, ...details })
}

function repoParts(repoFullName: string) {
  const [owner, repo] = repoFullName.split('/')
  return { owner, repo }
}

async function generatePRDescription(diff: string, prTitle: string): Promise<string> {
  const prompt = `You are a senior software engineer writing a pull request description.
Analyze this diff and write a clear, structured PR description.

PR Title: ${prTitle}

Diff:
${diff.slice(0, 8000)}

Write the description in this exact format:

## What changed
[2-4 bullet points describing what actually changed in the code]

## Why
[1-2 sentences explaining the reason for this change]

## How to test
[2-3 bullet points with specific steps to test this change]

## Notes
[Any edge cases, concerns, or things reviewers should watch for. Write "None" if not applicable]

Rules:
- Be specific, not generic
- Reference actual function names, file names, or line numbers from the diff
- Do not say "this PR" or "this commit"
- Keep it under 200 words total`

  const result = await groq.chat.completions.create({
    model: 'openai/gpt-oss-120b',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 500,
  })
  return result.choices[0]?.message?.content ?? ''
}

async function claimWebhookDelivery(deliveryId: string, context: LogContext) {
  const { data, error } = await supabase
    .from('webhook_deliveries')
    .upsert(
      { delivery_id: deliveryId, status: 'processing' },
      { onConflict: 'delivery_id', ignoreDuplicates: true }
    )
    .select('delivery_id')

  if (error) {
    console.error('[webhook] delivery claim failed', { ...context, error })
    throw new Error('Delivery claim failed')
  }

  return Boolean(data?.length)
}

async function markWebhookDelivery(deliveryId: string, status: 'done' | 'failed') {
  await supabase
    .from('webhook_deliveries')
    .update({ status, completed_at: new Date().toISOString() })
    .eq('delivery_id', deliveryId)
}

export async function GET() {
  console.log('[webhook] GET health check')
  return Response.json({ ok: true, status: 'PRDraft webhook is live' })
}

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('x-hub-signature-256') ?? ''
  const event = req.headers.get('x-github-event') ?? ''
  const deliveryId = req.headers.get('x-github-delivery') ?? ''
  const context: LogContext = { deliveryId, event }

  logWebhookStep('received', context, { hasSignature: Boolean(signature), bodyLength: body.length })

  if (!deliveryId) {
    logWebhookExit('missing delivery id', context)
    return Response.json({ error: 'Missing X-GitHub-Delivery header' }, { status: 400 })
  }

  try {
    await app.webhooks.verifyAndReceive({
      id: deliveryId,
      name: event as 'pull_request' | 'installation',
      signature,
      payload: body,
    })
    logWebhookStep('signature verified', context)
  } catch (err) {
    console.error('[webhook] verification failed', { ...context, err })
    logWebhookExit('unauthorized', context)
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const claimed = await claimWebhookDelivery(deliveryId, context)
    if (!claimed) {
      logWebhookExit('duplicate delivery', context)
      return Response.json({ ok: true, skipped: 'duplicate delivery' })
    }
  } catch {
    return Response.json({ error: 'Delivery claim failed' }, { status: 500 })
  }

  try {
    const payload = JSON.parse(body)
    context.action = payload.action
    context.installationId = payload.installation?.id
    context.repoFullName = payload.repository?.full_name
    context.prNumber = payload.pull_request?.number

    if (event !== 'pull_request' && event !== 'installation') {
      logWebhookExit('unsupported event', context)
      await markWebhookDelivery(deliveryId, 'done')
      return Response.json({ ok: true, skipped: true })
    }

    if (event === 'installation') {
      const installationId = payload.installation?.id
      const accountLogin = payload.installation?.account?.login ?? 'unknown'
      const accountType = payload.installation?.account?.type ?? 'User'

      logWebhookStep('installation event', context, { accountLogin, accountType })

      if (payload.action === 'created') {
        const { error } = await supabase.from('installs').upsert({
          installation_id: installationId,
          account_login: accountLogin,
          account_type: accountType,
          plan: 'free',
          pr_count: 0,
          status: 'active',
          installed_at: new Date().toISOString(),
          uninstalled_at: null,
        })

        if (error) throw error
        await markWebhookDelivery(deliveryId, 'done')
        logWebhookExit('installation recorded', context, { accountLogin })
        return Response.json({ ok: true, event: 'installed' })
      }

      if (payload.action === 'deleted') {
        const { error } = await supabase.from('installs').update({
          status: 'uninstalled',
          uninstalled_at: new Date().toISOString(),
        }).eq('installation_id', installationId)

        if (error) throw error
        await markWebhookDelivery(deliveryId, 'done')
        logWebhookExit('installation marked uninstalled', context, { accountLogin })
        return Response.json({ ok: true, event: 'uninstalled' })
      }

      await markWebhookDelivery(deliveryId, 'done')
      logWebhookExit('unsupported installation action', context)
      return Response.json({ ok: true, skipped: 'unsupported installation action' })
    }

    const installationId = payload.installation?.id
    const repoFullName = payload.repository?.full_name
    const prNumber = payload.pull_request?.number
    const prTitle = payload.pull_request?.title ?? 'Untitled PR'

    if (!installationId || !repoFullName || !prNumber) {
      logWebhookExit('missing required pull_request fields', context)
      await markWebhookDelivery(deliveryId, 'failed')
      return Response.json({ error: 'Missing fields' }, { status: 400 })
    }

    logWebhookStep('loading install', context)
    const { data: install, error: installError } = await supabase
      .from('installs')
      .select('installation_id,plan,status,pr_count')
      .eq('installation_id', installationId)
      .maybeSingle<Install>()

    if (installError) throw installError

    const plan = install?.plan ?? 'free'
    logWebhookStep('install loaded', context, { plan, status: install?.status })

    logWebhookStep('checking duplicate pr_event', context)
    const { data: existing, error: existingError } = await supabase
      .from('pr_events')
      .select('id,repo_full_name')
      .eq('installation_id', installationId)
      .eq('repo_full_name', repoFullName)
      .eq('pr_number', prNumber)
      .maybeSingle()

    if (existingError) throw existingError
    if (existing) {
      await markWebhookDelivery(deliveryId, 'done')
      logWebhookExit('already processed', context, { existingId: existing.id })
      return Response.json({ ok: true, skipped: 'already processed' })
    }

    logWebhookStep('recording pr_event and incrementing usage atomically', context)
    const { data: recordResults, error: recordError } = await supabase.rpc('record_pr_event_and_increment', {
      p_installation_id: installationId,
      p_repo_full_name: repoFullName,
      p_pr_number: prNumber,
      p_pr_title: prTitle,
    })

    if (recordError) throw recordError

    const recordResult = recordResults?.[0]
    if (!recordResult) throw new Error('PR event recording returned no result')

    if (recordResult.reason === 'cap_exceeded') {
      logWebhookStep('free tier cap hit', context, {
        currentCount: recordResult.pr_count,
        limit: FREE_TIER_PR_LIMIT,
      })
      const octokit = await app.getInstallationOctokit(installationId)
      const { owner, repo } = repoParts(repoFullName)
      await octokit.request('POST /repos/{owner}/{repo}/issues/{issue_number}/comments', {
        owner,
        repo,
        issue_number: prNumber,
        body: `**PRDraft free tier limit reached** (${recordResult.pr_count}/${FREE_TIER_PR_LIMIT} PRs used).\n\nUpgrade to Pro for unlimited PR descriptions → [View your dashboard](https://prdraft-app.vercel.app/dashboard?installation_id=${installationId})`,
      })
      await markWebhookDelivery(deliveryId, 'done')
      logWebhookExit('free tier capped', context, {
        currentCount: recordResult.pr_count,
        limit: FREE_TIER_PR_LIMIT,
      })
      return Response.json({ ok: true, capped: true })
    }

    if (!recordResult.inserted) {
      await markWebhookDelivery(deliveryId, 'done')
      logWebhookExit('already processed', context, { reason: recordResult.reason })
      return Response.json({ ok: true, skipped: 'already processed' })
    }

    logWebhookStep('creating installation octokit', context)
    const octokit = await app.getInstallationOctokit(installationId)
    const { owner, repo } = repoParts(repoFullName)

    logWebhookStep('fetching PR diff from GitHub', context)
    const { data: diffData } = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}', {
      owner,
      repo,
      pull_number: prNumber,
      headers: { accept: 'application/vnd.github.v3.diff' },
    })

    const diff = diffData as unknown as string
    logWebhookStep('diff fetched', context, { diffLength: diff?.length ?? 0 })

    if (!diff || diff.length < 10) {
      await markWebhookDelivery(deliveryId, 'done')
      logWebhookExit('empty diff', context, { diffLength: diff?.length ?? 0 })
      return Response.json({ ok: true, skipped: 'empty diff' })
    }

    logWebhookStep('calling Groq', context, { model: 'openai/gpt-oss-120b' })
    const description = await generatePRDescription(diff, prTitle)
    logWebhookStep('Groq completed', context, { descriptionLength: description.length })

    logWebhookStep('updating PR body on GitHub', context)
    await octokit.request('PATCH /repos/{owner}/{repo}/pulls/{pull_number}', {
      owner,
      repo,
      pull_number: prNumber,
      body: description + `\n\n---\nGenerated by [PRDraft](https://prdraft.carrd.co) · [View your dashboard](https://prdraft-app.vercel.app/dashboard?installation_id=${installationId})`,
    })

    await markWebhookDelivery(deliveryId, 'done')
    logWebhookExit('generated description', context, { recordResult })
    return Response.json({ ok: true })
  } catch (err) {
    console.error('[webhook] error processing webhook', { ...context, err })
    await markWebhookDelivery(deliveryId, 'failed')
    logWebhookExit('internal error', context)
    return Response.json({ error: 'Internal error' }, { status: 500 })
  }
}
