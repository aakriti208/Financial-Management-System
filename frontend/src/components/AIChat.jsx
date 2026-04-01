// TODO: Maintain messages state: array of { role: 'user'|'ai', text: string }
// TODO: On user submit, append user message and call aiService.askQuestion(text)
// TODO: Append AI response to messages on success
// TODO: Show loading spinner while awaiting response
// TODO: Auto-scroll chat window to bottom on new message
// TODO: Disable input while request is in flight

import { useState } from 'react'

function AIChat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return
    // TODO: Append { role: 'user', text: input } to messages
    // TODO: setLoading(true)
    // TODO: const response = await aiService.askQuestion(input)
    // TODO: Append { role: 'ai', text: response.answer } to messages
    // TODO: setLoading(false)
    // TODO: setInput('')
  }

  return (
    <div className="bg-white rounded-lg shadow flex flex-col h-[600px]">
      {/* Chat messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-gray-400 text-center mt-8">
            Ask me anything about your finances!
          </p>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg text-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {/* TODO: Show loading indicator when loading === true */}
      </div>

      {/* Input area */}
      <div className="border-t p-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a financial question..."
          className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default AIChat
