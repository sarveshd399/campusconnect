import { useNavigate } from 'react-router-dom'

const typeLabel = { CITY: 'City', COLLEGE: 'College', SCHOOL: 'School' }
const badgeClass = { CITY: 'badge-city', COLLEGE: 'badge-college', SCHOOL: 'badge-school' }

export default function CommunityCard({ community, onJoin, onLeave }) {
  const navigate = useNavigate()

  return (
    <div className="card" style={styles.card}>
      <div style={styles.top}>
        <div>
          <span className={`badge ${badgeClass[community.type]}`}>
            {typeLabel[community.type]}
          </span>
          <h3 style={styles.name}>{community.name}</h3>
          <p style={styles.desc}>{community.description}</p>
        </div>
      </div>

      <div style={styles.bottom}>
        <span style={styles.members}>👥 {community.memberCount} members</span>
        <div style={styles.actions}>
          {community.joined ? (
            <>
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/community/${community.id}/chat`)}
              >
                💬 Chat
              </button>
              <button
                className="btn btn-danger"
                onClick={() => onLeave(community.id)}
              >
                Leave
              </button>
            </>
          ) : (
            <button
              className="btn btn-outline"
              onClick={() => onJoin(community.id)}
            >
              + Join
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  top: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 17,
    fontWeight: 600,
    marginTop: 6,
    color: '#1a1a2e',
  },
  desc: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  bottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  members: {
    fontSize: 13,
    color: '#6b7280',
  },
  actions: {
    display: 'flex',
    gap: 8,
  },
}
