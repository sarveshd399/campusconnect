import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          🎓 CampusConnect
        </Link>

        {/* Links */}
        <div style={styles.links}>
          <Link to="/"        style={styles.link}>Home</Link>
          <Link to="/search"  style={styles.link}>Search</Link>
          <Link to="/profile" style={styles.link}>Profile</Link>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    background: 'white',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  inner: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '0 16px',
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    fontSize: 20,
    fontWeight: 700,
    color: '#4f46e5',
    textDecoration: 'none',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: 24,
  },
  link: {
    color: '#4b5563',
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: 14,
  },
  logoutBtn: {
    background: 'none',
    border: 'none',
    color: '#ef4444',
    fontWeight: 600,
    fontSize: 14,
    cursor: 'pointer',
  },
}
