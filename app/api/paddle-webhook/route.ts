// app/api/paddle-webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createHmac } from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function verifyPaddleSignature(rawBody: string, signatureHeader: string | null): boolean {
  if (!signatureHeader) return false
  const secret = process.env.PADDLE_WEBHOOK_SECRET!
  const parts = Object.fromEntries(
    signatureHeader.split(';').map(p => p.split('='))
  )
  const ts = parts['ts']
  const h1 = parts['h1']
  if (!ts || !h1) return false

  const signed = createHmac('sha256', secret)
    .update(`${ts}:${rawBody}`)
    .digest('hex')

  return signed === h1
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get('paddle-signature')

  if (!verifyPaddleSignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(rawBody)
  const { event_type, data } = event

  if (event_type === 'transaction.completed') {
    const installationId = data?.custom_data?.installation_id
    const customerId = data?.customer_id
    const subscriptionId = data?.subscription_id

    if (installationId) {
      await supabase
        .from('installs')
        .update({
          plan: 'pro',
          paddle_customer_id: customerId,
          paddle_subscription_id: subscriptionId,
        })
        .eq('installation_id', installationId)

      console.log(`✅ Upgraded install ${installationId} to pro`)
    }
  }

  if (event_type === 'subscription.canceled') {
    const subscriptionId = data?.id

    if (subscriptionId) {
      await supabase
        .from('installs')
        .update({ plan: 'free' })
        .eq('paddle_subscription_id', subscriptionId)

      console.log(`⬇️ Downgraded subscription ${subscriptionId} to free`)
    }
  }

  return NextResponse.json({ ok: true })
}
