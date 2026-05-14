import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyCommunities, joinCommunity, leaveCommunity } from '../services/api'
import { useAuth } from '../context/AuthContext'
import CommunityCard from '../components/CommunityCard'

export default function Home() {
  const { user } = useAuth()
  const navigate  = useNavigate()
  const [communities, setCommunities] = useState([])
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    getMyCommunities()
      .then(res => setCommunities(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleJoin = async (id) => {
    const res = await joinCommunity(id)
    setCommunities(prev => prev.map(c => c.id === id ? res.data : c))
  }

  const handleLeave = async (id) => {
    await leaveCommunity(id)
    setCommunities(prev => prev.filter(c => c.id !== id))
  }

  return (
    <div>
      {/* Welcome banner */}
      <div className="card" style={styles.banner}>
        <h2 style={styles.welcome}>👋 Welcome, {user.name}!</h2>
        <p style={styles.sub}>
          Connect with people from your city, college, or school.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/search')}
          style={{ marginTop: 16 }}
        >
          🔍 Find Communities
        </button>
      </div>

      {/* My Communities */}
      <h3 style={styles.sectionTitle}>My Communities</h3>

      {loading && <p style={styles.hint}>Loading...</p>}

      {!loading && communities.length === 0 && (
        <div className="card" style={styles.empty}>
          <p>You haven't joined any community yet.</p>
          <button
            className="btn btn-outline"
            onClick={() => navigate('/search')}
            style={{ marginTop: 12 }}
          >
            Browse Communities
          </button>
        </div>
      )}

      <div style={styles.grid}>
        {communities.map(c => (
          <CommunityCard
            key={c.id}
            community={c}
            onJoin={handleJoin}
            onLeave={handleLeave}
          />
        ))}
      </div>
    </div>
  )
}

const styles = {
  banner: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    marginBottom: 28,
  },
  welcome: { fontSize: 22, fontWeight: 700, color: 'white' },
  sub:     { color: 'rgba(255,255,255,0.85)', marginTop: 6, fontSize: 14 },
  sectionTitle: { fontSize: 18, fontWeight: 700, marginBottom: 16 },
  grid: { display: 'flex', flexDirection: 'column', gap: 14 },
  empty: { textAlign: 'center', color: '#6b7280', padding: 40 },
  hint:  { color: '#9ca3af', fontSize: 14 },
}
