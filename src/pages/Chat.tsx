import type { KeyboardEvent } from 'react'
import { useEffect, useRef, useState } from 'react'

type Message = {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

type ChatApiResponse = {
  sessionId: string
  reply: string
  timestampUtc: string
}

const SESSION_STORAGE_KEY = 'loan-eligibility-chat-session-id'
const sanitizeUrl = (url: string) => url.replace(/\/$/, '')
const chatApiEnvValue = import.meta.env.VITE_CHAT_API_URL?.trim()
const CHAT_API_URL = chatApiEnvValue && chatApiEnvValue.length > 0 ? sanitizeUrl(chatApiEnvValue) : '/api/Chat'
const DEFAULT_CHAT_USER = import.meta.env.VITE_CHAT_DEFAULT_USER?.trim() || 'default-user'

const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const createWelcomeMessage = (): Message => ({
  id: 'welcome-message',
  text: 'Hello! How can I help you with your loan eligibility today?',
  sender: 'bot',
  timestamp: new Date(),
})

const readStoredSessionId = () => {
  if (typeof window === 'undefined') {
    return ''
  }
  return window.localStorage.getItem(SESSION_STORAGE_KEY) ?? ''
}

// Insert a line break whenever a list marker follows plain text on the same line.
const LIST_ITEM_BREAK_REGEX = /([^\n\r])[ \t]+(?=(?:[-*•]|\d+[.)])\s+)/g

const ensureListItemsAreOnSeparateLines = (text: string) =>
  text.replace(
    LIST_ITEM_BREAK_REGEX,
    (_match: string, char: string) => `${char}\n`,
  )

const getMessageDisplayLines = (message: Message) => {
  const normalized = message.text.replace(/\r\n/g, '\n')
  const prepared =
    message.sender === 'bot'
      ? ensureListItemsAreOnSeparateLines(normalized)
      : normalized

  const lines = prepared
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)

  if (lines.length === 0) {
    const fallback = normalized.trim()
    return fallback ? [fallback] : []
  }

  return lines
}

export function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([createWelcomeMessage()])
  const [inputValue, setInputValue] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [sessionId, setSessionId] = useState(() => {
    const storedId = readStoredSessionId()
    return storedId || generateId()
  })

  const messagesContainerRef = useRef<HTMLDivElement | null>(null)
  const userIdentifier = DEFAULT_CHAT_USER

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }
    window.localStorage.setItem(SESSION_STORAGE_KEY, sessionId)
  }, [sessionId])

  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) {
      return
    }
    container.scrollTop = container.scrollHeight
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isSending) {
      return
    }

    const messageText = inputValue.trim()
    const userMessage: Message = {
      id: generateId(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsSending(true)
    setError(null)

    try {
      const response = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          user: userIdentifier,
          message: messageText,
        }),
      })

      if (!response.ok) {
        const details = await response.text()
        throw new Error(details || 'Failed to send message')
      }

      const data: ChatApiResponse = await response.json()
      if (data.sessionId && data.sessionId !== sessionId) {
        setSessionId(data.sessionId)
      }

      const botMessage: Message = {
        id: generateId(),
        text: data.reply,
        sender: 'bot',
        timestamp: new Date(data.timestampUtc ?? Date.now()),
      }

      setMessages(prev => [...prev, botMessage])
    } catch (err) {
      console.error('Failed to send chat message', err)
      setError('Could not send the message. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  const handleClearChat = async () => {
    if (isClearing) {
      return
    }

    setIsClearing(true)
    setError(null)

    try {
      if (sessionId) {
        const response = await fetch(`${CHAT_API_URL}/${encodeURIComponent(sessionId)}`, {
          method: 'DELETE',
        })

        if (!response.ok && response.status !== 404) {
          throw new Error('Failed to clear session on server')
        }
      }
    } catch (err) {
      console.error('Failed to clear chat session', err)
      setError('Could not clear the chat history. Please try again.')
      setIsClearing(false)
      return
    }

    setMessages([createWelcomeMessage()])
    setSessionId(generateId())
    setInputValue('')
    setIsClearing(false)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="page">
      <header className="pageHeader">
        <div>
          <h1 className="pageTitle">Chat</h1>
          <p className="pageSubtitle">Ask questions about our various loans products and check your eligibility.</p>
        </div>
        <button
          onClick={handleClearChat}
          className="clearChatButton"
          title="Clear chat history"
          disabled={isClearing}
        >
          {isClearing ? 'Clearing…' : 'New Chat'}
        </button>
      </header>

      <div className="chatContainer">
        <div className="chatMessages" ref={messagesContainerRef}>
          {messages.map(message => {
            const displayLines = getMessageDisplayLines(message)

            return (
              <div
                key={message.id}
                className={`chatMessage ${message.sender === 'user' ? 'chatMessage--user' : 'chatMessage--bot'}`}
              >
                <div className="chatMessage__content">
                  {displayLines.length === 0
                    ? message.text
                    : displayLines.map((line, index) => (
                        <span key={`${message.id}-line-${index}`}>
                          {line}
                          {index < displayLines.length - 1 && <br />}
                        </span>
                      ))}
                </div>
                <div className="chatMessage__timestamp">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            )
          })}
        </div>

        {error && (
          <div className="chatStatus chatStatus--error" role="alert">
            {error}
          </div>
        )}

        <div className="chatInput">
          <div className="chatInput__container">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="chatInput__field"
              disabled={isSending}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isSending}
              className="chatInput__send"
            >
              {isSending ? 'Sending…' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
