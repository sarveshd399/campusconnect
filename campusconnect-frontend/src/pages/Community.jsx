import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCommunity, joinCommunity, leaveCommunity } from '../services/api'

const badgeClass = { CITY: 'badge-city', COLLEGE: 'badge-college', SCHOOL: 'badge-school' }

export default function Community() {
  const { id }    = useParams()
  const navigate  = useNavigate()
  const [community, setCommunity] = useState(null)
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    getCommunity(id)
      .then(res => setCommunity(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  const handleJoin = async () => {
    const res = await joinCommunity(id)
    setCommunity(res.data)
  }

  const handleLeave = async () => {
    const res = await leaveCommunity(id)
    setCommunity(res.data)
  }

  if (loading) return <p style={{ color: '#9ca3af' }}>Loading...</p>
  if (!community) return <p>Community not found.</p>

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        style={styles.back}
      >
        ← Back
      </button>

      <div className="card" style={styles.hero}>
        <span className={`badge ${badgeClass[community.type]}`}>
          {community.type}
        </span>
        <h1 style={styles.name}>{community.name}</h1>
        <p style={styles.desc}>{community.description}</p>

        <div style={styles.stats}>
          <span>👥 {community.memberCount} members</span>
        </div>

        <div style={styles.actions}>
          {community.joined ? (
            <>
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/community/${id}/chat`)}
              >
                💬 Open Chat
              </button>
              <button className="btn btn-danger" onClick={handleLeave}>
                Leave Community
              </button>
            </>
          ) : (
            <button className="btn btn-outline" onClick={handleJoin}>
              + Join Community
            </button>
          )}
        </div>
      </div>

      {community.joined && (
        <div className="card" style={styles.chatPreview}>
          <h3 style={{ marginBottom: 8, fontWeight: 600 }}>💬 Community Chat</h3>
          <p style={{ color: '#6b7280', fontSize: 14 }}>
            You're a member! Click below to join the real-time group chat.
          </p>
          <button
            className="btn btn-primary"
            style={{ marginTop: 14 }}
            onClick={() => navigate(`/community/${id}/chat`)}
          >
            Open Chat Room →
          </button>
        </div>
      )}
    </div>
  )
}

const styles = {
  back: {
    background: 'none',
    border: 'none',
    color: '#4f46e5',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: 14,
    marginBottom: 16,
    padding: 0,
  },
  hero: { marginBottom: 20 },
  name: { fontSize: 26, fontWeight: 700, marginTop: 10, marginBottom: 8 },
  desc: { color: '#6b7280', fontSize: 15, marginBottom: 16 },
  stats: { color: '#374151', fontSize: 14, marginBottom: 20 },
  actions: { display: 'flex', gap: 12 },
  chatPreview: { background: '#f8fafc' },
}
