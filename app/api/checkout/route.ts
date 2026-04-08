import { NextRequest, NextResponse } from 'next/server'

const PADDLE_API_KEY = process.env.PADDLE_API_KEY!
const PRICE_ID = 'pri_01knnrvdjr8gch5t25ys4st725'
const PADDLE_BASE = 'https://api.paddle.com'

export async function GET(req: NextRequest) {
  const installationId = req.nextUrl.searchParams.get('installation_id')

  if (!installationId) {
    return NextResponse.redirect('https://github.com/apps/prdraft')
  }

  try {
    const res = await fetch(`${PADDLE_BASE}/transactions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PADDLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{ price_id: PRICE_ID, quantity: 1 }],
        custom_data: { installation_id: installationId },
        checkout: {
          url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?installation_id=${installationId}&upgraded=true`
        }
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('Paddle error:', data)
      return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 })
    }

    const checkoutUrl = data?.data?.checkout?.url
    if (!checkoutUrl) {
      return NextResponse.json({ error: 'No checkout URL returned' }, { status: 500 })
    }

    return NextResponse.redirect(checkoutUrl)
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
