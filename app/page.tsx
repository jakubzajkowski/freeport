'use client'
import {useEffect, useRef, useState} from 'react'

export default function Home() {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([])
  const [input, setInput] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMessage = input
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      })

      const data = await res.json()

      setMessages((prev) => [...prev, { role: 'bot', text: data.response }])
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'bot', text: '❌ Server side error' }])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-fuchsia-500 to-cyan-400 text-transparent bg-clip-text">
            💬 Helpdesk Form Chat
          </h1>

          <div ref={chatContainerRef} className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            {messages.map((m, i) => (
                <div
                    key={i}
                    className={`p-3 rounded-xl max-w-[80%] ${
                        m.role === 'user'
                            ? 'bg-fuchsia-600 self-end text-right ml-auto'
                            : 'bg-gray-700 self-start text-left mr-auto'
                    }`}
                >
              <span className="block text-sm font-medium mb-1 opacity-70">
                {m.role === 'user' ? 'You' : 'Assistant'}
              </span>
                  <span>{m.text}</span>
                </div>
            ))}
          </div>

          <div className="flex gap-2 items-center">
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask"
                className="flex-1 bg-gray-800 border border-gray-700 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-white"
            />
            <button
                onClick={sendMessage}
                disabled={loading}
                className="bg-fuchsia-600 hover:bg-fuchsia-500 transition px-5 py-3 rounded-xl text-white font-semibold disabled:opacity-50"
            >
              {loading ? '...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
  )
}
