import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client/dist/sockjs.min.js'
import { getMessages, getCommunity } from '../services/api'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

export default function Chat() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [messages,  setMessages]  = useState([])
  const [input,     setInput]     = useState('')
  const [community, setCommunity] = useState(null)
  const [connected, setConnected] = useState(false)
  const [sending,   setSending]   = useState(false)

  const stompClient = useRef(null)
  const bottomRef   = useRef(null)

  // Load community info + old messages
  useEffect(() => {
    getCommunity(id).then(r => setCommunity(r.data))
    getMessages(id).then(r => setMessages(r.data))
  }, [id])

  // Connect WebSocket for RECEIVING messages only
  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      onConnect: () => {
        setConnected(true)
        // Subscribe to this community's live messages
        client.subscribe(`/topic/community/${id}`, (msg) => {
          const newMsg = JSON.parse(msg.body)
          setMessages(prev => {
            // Avoid duplicate if sender already added it optimistically
            const exists = prev.some(m => m.id === newMsg.id)
            return exists ? prev : [...prev, newMsg]
          })
        })
      },
      onDisconnect: () => setConnected(false),
      onStompError:  () => setConnected(false),
    })

    client.activate()
    stompClient.current = client

    return () => client.deactivate()
  }, [id])

  // Auto scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Send message via REST (reliable JWT auth) → backend broadcasts via WebSocket
  const sendMessage = async () => {
    if (!input.trim() || sending) return

    const content = input.trim()
    setInput('')       // clear input immediately for good UX
    setSending(true)

    try {
      const token = localStorage.getItem('token')
      await axios.post(
        `/api/communities/${id}/messages`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      // Backend will broadcast to /topic/community/{id}
      // WebSocket subscription above will receive it and add to messages
    } catch (err) {
      console.error('Failed to send message:', err)
      setInput(content) // restore input if failed
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <div style={styles.page}>

      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate(`/community/${id}`)} style={styles.back}>
          ←
        </button>
        <div>
          <h2 style={styles.headerTitle}>
            {community?.name || 'Loading...'}
          </h2>
          <span style={connected ? styles.online : styles.offline}>
            {connected ? '🟢 Connected' : '🔴 Connecting...'}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div style={styles.messages}>
        {messages.length === 0 && (
          <div style={styles.empty}>
            No messages yet. Say hello! 👋
          </div>
        )}

        {messages.map((msg, i) => {
          const isMe = msg.senderId === user.userId
          return (
            <div
              key={msg.id || i}
              style={{ ...styles.msgRow, justifyContent: isMe ? 'flex-end' : 'flex-start' }}
            >
              <div style={isMe ? styles.myBubble : styles.theirBubble}>
                {!isMe && (
                  <div style={styles.senderName}>{msg.senderName}</div>
                )}
                <div style={styles.msgText}>{msg.content}</div>
                <div style={styles.time}>{formatTime(msg.timestamp)}</div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={styles.inputBar}>
        <input
          style={styles.textInput}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Enter to send)"
        />
        <button
          style={{
            ...styles.sendBtn,
            opacity: (!input.trim() || sending) ? 0.5 : 1
          }}
          onClick={sendMessage}
          disabled={!input.trim() || sending}
        >
          {sending ? '...' : 'Send'}
        </button>
      </div>
    </div>
  )
}

const styles = {
  page: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#f0f2f5',
  },
  header: {
    background: 'white',
    borderBottom: '1px solid #e2e8f0',
    padding: '12px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  back: {
    background: 'none',
    border: 'none',
    fontSize: 22,
    cursor: 'pointer',
    color: '#4f46e5',
    fontWeight: 700,
  },
  headerTitle: { fontSize: 17, fontWeight: 700 },
  online:  { fontSize: 12, color: '#16a34a' },
  offline: { fontSize: 12, color: '#dc2626' },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  empty: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: 60,
    fontSize: 15,
  },
  msgRow: { display: 'flex' },
  myBubble: {
    background: '#4f46e5',
    color: 'white',
    borderRadius: '16px 16px 4px 16px',
    padding: '10px 14px',
    maxWidth: '70%',
  },
  theirBubble: {
    background: 'white',
    color: '#1a1a2e',
    borderRadius: '16px 16px 16px 4px',
    padding: '10px 14px',
    maxWidth: '70%',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  senderName: {
    fontSize: 11,
    fontWeight: 700,
    color: '#4f46e5',
    marginBottom: 4,
  },
  msgText: { fontSize: 14, lineHeight: 1.5 },
  time: {
    fontSize: 10,
    opacity: 0.6,
    marginTop: 4,
    textAlign: 'right',
  },
  inputBar: {
    background: 'white',
    borderTop: '1px solid #e2e8f0',
    padding: '12px 16px',
    display: 'flex',
    gap: 10,
  },
  textInput: {
    flex: 1,
    padding: '10px 16px',
    border: '1.5px solid #e2e8f0',
    borderRadius: 24,
    fontSize: 14,
    outline: 'none',
  },
  sendBtn: {
    background: '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: 24,
    padding: '10px 22px',
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
}
