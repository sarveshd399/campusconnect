import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProfile, getMyCommunities, leaveCommunity } from '../services/api'
import { useAuth } from '../context/AuthContext'
import CommunityCard from '../components/CommunityCard'

export default function Profile() {
  const { logout } = useAuth()
  const navigate   = useNavigate()
  const [profile,      setProfile]      = useState(null)
  const [communities,  setCommunities]  = useState([])

  useEffect(() => {
    getProfile().then(r => setProfile(r.data))
    getMyCommunities().then(r => setCommunities(r.data))
  }, [])

  const handleLeave = async (id) => {
    await leaveCommunity(id)
    setCommunities(prev => prev.filter(c => c.id !== id))
    setProfile(prev => ({ ...prev, communitiesJoined: prev.communitiesJoined - 1 }))
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div>
      <h2 style={styles.title}>My Profile</h2>

      {profile && (
        <div className="card" style={styles.profileCard}>
          <div style={styles.avatar}>
            {profile.name?.charAt(0).toUpperCase()}
          </div>
          <div style={styles.info}>
            <h3 style={styles.name}>{profile.name}</h3>
            <p style={styles.detail}>📧 {profile.email}</p>
            {profile.city && <p style={styles.detail}>📍 {profile.city}</p>}
            <p style={styles.detail}>🏘️ {profile.communitiesJoined} communities joined</p>
          </div>
          <button className="btn btn-danger" onClick={handleLogout}
            style={{ alignSelf: 'flex-start' }}>
            Logout
          </button>
        </div>
      )}

      <h3 style={styles.sectionTitle}>My Communities</h3>

      {communities.length === 0 && (
        <div className="card" style={styles.empty}>
          <p>No communities joined yet.</p>
          <button
            className="btn btn-outline"
            onClick={() => navigate('/search')}
            style={{ marginTop: 12 }}
          >
            Find Communities
          </button>
        </div>
      )}

      <div style={styles.grid}>
        {communities.map(c => (
          <CommunityCard
            key={c.id}
            community={c}
            onJoin={() => {}}
            onLeave={handleLeave}
          />
        ))}
      </div>
    </div>
  )
}

const styles = {
  title:       { fontSize: 22, fontWeight: 700, marginBottom: 20 },
  profileCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    marginBottom: 28,
    flexWrap: 'wrap',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    fontSize: 30,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  info:        { flex: 1 },
  name:        { fontSize: 20, fontWeight: 700, marginBottom: 8 },
  detail:      { fontSize: 14, color: '#6b7280', marginBottom: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 700, marginBottom: 16 },
  grid:        { display: 'flex', flexDirection: 'column', gap: 14 },
  empty:       { textAlign: 'center', color: '#6b7280', padding: 40 },
}
