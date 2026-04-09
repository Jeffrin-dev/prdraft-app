// app/dashboard/CancelButton.tsx
'use client'

import { useState } from 'react'

export default function CancelButton({ installationId }: { installationId: number }) {
  const [status, setStatus] = useState<'idle' | 'confirming' | 'loading' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleCancel() {
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ installation_id: installationId }),
      })

      if (!res.ok) {
        const data = await res.json()
        setErrorMsg(data.error || 'Something went wrong')
        setStatus('error')
        return
      }

      setStatus('done')
    } catch (err) {
      setErrorMsg('Network error — please try again')
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <p className="text-sm text-gray-500">
        ✓ Your subscription will cancel at the end of the current billing period. You&apos;ll keep Pro access until then.
      </p>
    )
  }

  if (status === 'confirming') {
    return (
      <div className="flex items-center gap-3">
        <p className="text-sm text-gray-600">Are you sure? You&apos;ll lose Pro access at end of billing period.</p>
        <button
          onClick={handleCancel}
          className="text-sm text-red-600 underline hover:text-red-800"
        >
          Yes, cancel
        </button>
        <button
          onClick={() => setStatus('idle')}
          className="text-sm text-gray-500 underline hover:text-gray-700"
        >
          Never mind
        </button>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={() => setStatus('confirming')}
        className="text-sm text-gray-400 underline hover:text-red-500"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Canceling...' : 'Cancel subscription'}
      </button>
      {status === 'error' && (
        <p className="text-xs text-red-500 mt-1">{errorMsg}</p>
      )}
    </div>
  )
}
