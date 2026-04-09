'use client'

import { useEffect, useState } from 'react'

declare global {
  interface Window { Paddle: any }
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
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (document.getElementById('paddle-js')) {
      if (window.Paddle) {
        window.Paddle.Initialize({ token: CLIENT_TOKEN })
        setReady(true)
      }
      return
    }
    const script = document.createElement('script')
    script.id = 'paddle-js'
    script.src = 'https://cdn.paddle.com/paddle/v2/paddle.js'
    script.async = true
    script.onload = () => {
      window.Paddle.Initialize({ token: CLIENT_TOKEN })
      setReady(true)
    }
    document.head.appendChild(script)
  }, [])

  function handleUpgrade() {
    if (!ready || !window.Paddle) return
    window.Paddle.Checkout.open({
      items: [{ priceId: PRICE_ID, quantity: 1 }],
      customData: { installation_id: String(installationId) },
    })
  }

  const urgentStyle = {
    flexShrink: 0 as const,
    padding: '10px 20px',
    background: ready ? '#ef4444' : '#7f1d1d',
    border: '1px solid #ef4444',
    borderRadius: 6,
    color: '#fff',
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "'IBM Plex Mono', monospace",
    cursor: ready ? 'pointer' : 'wait',
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
    cursor: ready ? 'pointer' : 'wait',
    whiteSpace: 'nowrap' as const,
  }

  return (
    <button onClick={handleUpgrade} style={urgent ? urgentStyle : normalStyle}>
      {ready ? 'Upgrade — $9/mo →' : 'Loading...'}
    </button>
  )
}
