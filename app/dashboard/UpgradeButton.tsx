'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    Paddle: any
  }
}

const PRICE_ID = 'pri_01knnrvdjr8gch5t25ys4st725'
const CLIENT_TOKEN = 'live_4d2e98f3ce38116ab471ce559b3'

export default function UpgradeButton({
  installationId,
  urgent,
}: {
  installationId: number
  urgent: boolean
}) {
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js'
    script.async = true
    script.onload = () => {
      window.Paddle.Initialize({
        token: CLIENT_TOKEN,
        eventCallback: (event: any) => {
          if (event.name === 'checkout.completed') {
            window.location.href = `/dashboard?installation_id=${installationId}&upgraded=true`
          }
        },
      })
    }
    document.head.appendChild(script)
  }, [installationId])

  function handleUpgrade() {
    if (!window.Paddle) return
    window.Paddle.Checkout.open({
      items: [{ priceId: PRICE_ID, quantity: 1 }],
      customData: { installation_id: String(installationId) },
    })
  }

  const urgentStyle = {
    flexShrink: 0 as const,
    padding: '10px 20px',
    background: '#ef4444',
    border: '1px solid #ef4444',
    borderRadius: 6,
    color: '#fff',
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "'IBM Plex Mono', monospace",
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
  }

  const normalStyle = {
    flexShrink: 0 as const,
    padding: '10px 20px',
    background: 'transparent',
    border: '1px solid #22d3ee',
    borderRadius: 6,
    color: '#22d3ee',
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "'IBM Plex Mono', monospace",
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
  }

  return (
    <button onClick={handleUpgrade} style={urgent ? urgentStyle : normalStyle}>
      Upgrade — $9/mo →
    </button>
  )
}
