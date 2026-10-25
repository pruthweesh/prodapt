import { useEffect, useState } from 'react'
import './index.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function StatusBadge({ status }) {
  if (status === 'loading') {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-slate-300 backdrop-blur-sm border border-white/10">
        <span className="size-2 rounded-full bg-yellow-400 animate-pulse" />
        Checking API…
      </span>
    )
  }
  if (status === 'ok') {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-1.5 text-sm font-medium text-emerald-300 backdrop-blur-sm border border-emerald-500/30">
        <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
        API online
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-rose-500/20 px-4 py-1.5 text-sm font-medium text-rose-300 backdrop-blur-sm border border-rose-500/30">
      <span className="size-2 rounded-full bg-rose-400" />
      API unreachable
    </span>
  )
}

export default function App() {
  const [apiStatus, setApiStatus] = useState('loading')

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((r) => r.json())
      .then((data) => setApiStatus(data.status === 'ok' ? 'ok' : 'error'))
      .catch(() => setApiStatus('error'))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center px-4">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 size-[600px] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 size-[400px] rounded-full bg-violet-600/15 blur-[100px]" />
      </div>

      <main className="relative z-10 flex flex-col items-center gap-8 text-center">
        {/* Logo / wordmark */}
        <div className="flex flex-col items-center gap-3">
          <div className="size-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-xl shadow-indigo-900/50">
            <span className="text-3xl font-black text-white tracking-tight">P</span>
          </div>
          <h1 className="text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-violet-300 to-purple-400">
            Prodapt
          </h1>
          <p className="text-slate-400 text-lg max-w-md leading-relaxed">
            Intelligent Product Adaptation &amp; Multi-Market Business Expansion Platform
          </p>
        </div>

        {/* API health badge */}
        <StatusBadge status={apiStatus} />

        {/* Endpoint hint */}
        <p className="text-slate-600 text-xs font-mono">
          {API_URL}/health
        </p>
      </main>
    </div>
  )
}
