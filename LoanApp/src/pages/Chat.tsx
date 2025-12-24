import { useState, useRef } from 'react'

type Message = {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I help you with your loan eligibility today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const messageIdRef = useRef(2)

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: messageIdRef.current.toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    messageIdRef.current += 1
    setInputValue('')

    // Mock bot response
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue)
      const botMessage: Message = {
        id: messageIdRef.current.toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, botMessage])
      messageIdRef.current += 1
    }, 1000)
  }

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()
    if (input.includes('eligibility')) {
      return 'To check loan eligibility, you need to provide your income, credit score, and employment details. Would you like me to guide you through the application process?'
    }
    if (input.includes('status')) {
      return 'You can check your application status in the "Check Application Status" section. Do you have your application ID ready?'
    }
    if (input.includes('apply')) {
      return 'Great! You can apply for a loan by going to the "Apply for Loan" section. I can help you prepare the required documents.'
    }
    return 'I\'m here to help with your loan questions. Could you please provide more details about what you\'re looking for?'
  }

  const handleClearChat = () => {
    setMessages([
      {
        id: '1',
        text: 'Hello! How can I help you with your loan eligibility today?',
        sender: 'bot',
        timestamp: new Date(),
      },
    ])
    messageIdRef.current = 2
    setInputValue('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
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
          <p className="pageSubtitle">Ask questions about eligibility or status.</p>
        </div>
        <button
          onClick={handleClearChat}
          className="clearChatButton"
          title="Clear chat history"
        >
          Clear Chat
        </button>
      </header>

      <div className="chatContainer">
        <div className="chatMessages">
          {messages.map(message => (
            <div
              key={message.id}
              className={`chatMessage ${message.sender === 'user' ? 'chatMessage--user' : 'chatMessage--bot'}`}
            >
              <div className="chatMessage__content">
                {message.text}
              </div>
              <div className="chatMessage__timestamp">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
        </div>

        <div className="chatInput">
          <div className="chatInput__container">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="chatInput__field"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="chatInput__send"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
