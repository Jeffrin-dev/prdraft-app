// app/api/cancel-subscription/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { installation_id } = await req.json()

    if (!installation_id) {
      return NextResponse.json({ error: 'Missing installation_id' }, { status: 400 })
    }

    // Fetch the subscription ID from Supabase
    const { data: install, error: fetchError } = await supabase
      .from('installs')
      .select('paddle_subscription_id, plan')
      .eq('installation_id', installation_id)
      .single()

    if (fetchError || !install) {
      return NextResponse.json({ error: 'Install not found' }, { status: 404 })
    }

    if (install.plan !== 'pro') {
      return NextResponse.json({ error: 'No active subscription' }, { status: 400 })
    }

    if (!install.paddle_subscription_id) {
      return NextResponse.json({ error: 'No subscription ID on record' }, { status: 400 })
    }

    // Tell Paddle to cancel at end of current billing period
    const paddleRes = await fetch(
      `https://api.paddle.com/subscriptions/${install.paddle_subscription_id}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${process.env.PADDLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scheduled_change: {
            action: 'cancel',
            effective_at: 'next_billing_period',
          },
        }),
      }
    )

    if (!paddleRes.ok) {
      const errBody = await paddleRes.text()
      console.error('Paddle cancel error:', errBody)
      return NextResponse.json({ error: 'Paddle API error' }, { status: 500 })
    }

    // Optionally mark as canceling in Supabase so the dashboard can show a "cancels on X" notice
    // The subscription.updated webhook will fire and you can handle it there too
    await supabase
      .from('installs')
      .update({ plan: 'canceling' })
      .eq('installation_id', installation_id)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Cancel subscription error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
