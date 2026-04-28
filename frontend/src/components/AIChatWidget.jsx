import { useState, useEffect, useRef } from 'react'
import AIChat from './AIChat'

function NumoMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 30 30" fill="none">
      <rect width="30" height="30" rx="6.6" fill="#10b981" />
      <path
        d="M8.1 22.5L8.1 7.5L21.9 22.5L21.9 7.5"
        stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M15.5 7.5L22.9 4.5"
        stroke="white" strokeWidth="1.65" strokeLinecap="round" opacity="0.6"
      />
    </svg>
  )
}

function AIChatWidget() {
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3" ref={panelRef}>

      {/* Chat panel */}
      {open && (
        <div className="w-[360px] shadow-2xl rounded-2xl overflow-hidden border border-slate-200 bg-white animate-chat-pop">
          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0f2035]">
            <div className="flex items-center gap-2">
              <NumoMark />
              <span className="text-white text-sm font-semibold">Ask Numo</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-white transition-colors text-lg leading-none"
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          {/* Chat body */}
          <AIChat className="h-[420px] rounded-none border-0 shadow-none" />
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="relative flex items-center gap-2.5 pl-3 pr-4 py-2.5 rounded-full bg-[#0f2035] text-white
                   shadow-lg hover:bg-[#1a3050] transition-all duration-200 hover:scale-105 active:scale-95"
        aria-label="Open AI Financial Advisor"
      >
        {/* Pulse ring — only when closed */}
        {!open && (
          <span className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
        )}
        <span className="relative flex items-center gap-2.5">
          <NumoMark />
          <span className="text-sm font-semibold tracking-tight">
            {open ? <span className="text-lg leading-none">×</span> : 'Ask Numo'}
          </span>
        </span>
      </button>
    </div>
  )
}

export default AIChatWidget
