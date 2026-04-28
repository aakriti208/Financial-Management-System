import { useState, useEffect, useRef } from 'react'
import { askQuestion } from '../services/aiService'

const SUGGESTIONS = [
  'Why am I spending so much this month?',
  'How can I reduce my expenses?',
  'Am I saving enough from my income?',
  'What are my biggest expense categories?',
]

function AIChat({ className = 'h-[620px]' }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = async (text) => {
    const question = (text ?? input).trim()
    if (!question || loading) return

    setInput('')
    setError(null)
    setMessages(prev => [...prev, { role: 'user', text: question }])
    setLoading(true)

    try {
      const response = await askQuestion(question)
      setMessages(prev => [...prev, { role: 'ai', text: response.answer }])
    } catch {
      setError('Failed to get a response. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`card flex flex-col ${className}`}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-xl">
              ✦
            </div>
            <div>
              <p className="text-sm font-medium text-slate-600">Ask about your finances</p>
              <p className="text-xs text-slate-400 mt-0.5">Powered by your real expense and income data</p>
            </div>
            <div className="flex flex-col gap-2 w-full max-w-sm mt-2">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s)}
                  className="text-left text-xs text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-lg px-4 py-2.5 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'ai' && (
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs text-purple-600 mr-2 mt-0.5 flex-shrink-0">
                ✦
              </div>
            )}
            <div
              className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#0f2035] text-white rounded-tr-sm'
                  : 'bg-slate-100 text-slate-700 rounded-tl-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-xs text-purple-600 mr-2 mt-0.5 flex-shrink-0">
              ✦
            </div>
            <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mx-auto max-w-sm px-4 py-2.5 bg-rose-50 border border-rose-100 rounded-lg text-xs text-rose-600 text-center">
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-100 px-4 py-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask a financial question..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-colors"
          disabled={loading}
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="px-4 py-2 bg-[#0f2035] text-white text-sm font-medium rounded-xl hover:bg-[#1a3050] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default AIChat
