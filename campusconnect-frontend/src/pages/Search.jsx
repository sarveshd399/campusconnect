import { useState, useEffect } from 'react'
import { searchCommunities, joinCommunity, leaveCommunity } from '../services/api'
import CommunityCard from '../components/CommunityCard'
import axios from 'axios'

export default function Search() {
  const [query,       setQuery]       = useState('')
  const [type,        setType]        = useState('')
  const [communities, setCommunities] = useState([])
  const [loading,     setLoading]     = useState(false)

  // Create community modal state
  const [showModal,   setShowModal]   = useState(false)
  const [newForm,     setNewForm]     = useState({ name: '', type: 'CITY', description: '' })
  const [creating,    setCreating]    = useState(false)
  const [createError, setCreateError] = useState('')

  // Load all communities on first visit
  useEffect(() => { doSearch() }, [])

  const doSearch = async () => {
    setLoading(true)
    try {
      const res = await searchCommunities(query, type)
      setCommunities(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') doSearch()
  }

  const handleJoin = async (id) => {
    const res = await joinCommunity(id)
    setCommunities(prev => prev.map(c => c.id === id ? res.data : c))
  }

  const handleLeave = async (id) => {
    const res = await leaveCommunity(id)
    setCommunities(prev => prev.map(c => c.id === id ? res.data : c))
  }

  // ── Create community ───────────────────────────────────────────────────────
  const handleNewFormChange = (e) =>
    setNewForm({ ...newForm, [e.target.name]: e.target.value })

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreateError('')
    setCreating(true)
    try {
      const token = localStorage.getItem('token')
      const res = await axios.post('/api/communities', newForm, {
        headers: { Authorization: `Bearer ${token}` }
      })
      // Add new community to list and close modal
      setCommunities(prev => [res.data, ...prev])
      setShowModal(false)
      setNewForm({ name: '', type: 'CITY', description: '' })
    } catch (err) {
      setCreateError(err.response?.data?.error || 'Failed to create community.')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div>
      <div style={styles.titleRow}>
        <h2 style={styles.title}>🔍 Search Communities</h2>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Create Community
        </button>
      </div>

      {/* Search bar */}
      <div className="card" style={styles.searchBox}>
        <div style={styles.row}>
          <input
            className="input"
            placeholder="Search by city, college or school name..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ flex: 1 }}
          />
          <select
            className="input"
            value={type}
            onChange={e => setType(e.target.value)}
            style={{ width: 140 }}
          >
            <option value="">All Types</option>
            <option value="CITY">City</option>
            <option value="COLLEGE">College</option>
            <option value="SCHOOL">School</option>
          </select>
          <button className="btn btn-primary" onClick={doSearch}>
            Search
          </button>
        </div>
      </div>

      {/* Results */}
      {loading && <p style={styles.hint}>Searching...</p>}

      {!loading && communities.length === 0 && (
        <p style={styles.hint}>No communities found. Try a different search.</p>
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

      {/* ── Create Community Modal ──────────────────────────────────────────── */}
      {showModal && (
        <div style={styles.overlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Create a Community</h3>
              <button style={styles.closeBtn} onClick={() => setShowModal(false)}>✕</button>
            </div>

            {createError && <div className="error-msg">{createError}</div>}

            <form onSubmit={handleCreate} style={styles.form}>
              <div style={styles.field}>
                <label style={styles.label}>Community Name</label>
                <input
                  className="input"
                  name="name"
                  placeholder="e.g. Gorakhpur, MMMUT, DPS Noida"
                  value={newForm.name}
                  onChange={handleNewFormChange}
                  required
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Type</label>
                <select
                  className="input"
                  name="type"
                  value={newForm.type}
                  onChange={handleNewFormChange}
                >
                  <option value="CITY">City</option>
                  <option value="COLLEGE">College</option>
                  <option value="SCHOOL">School</option>
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Description</label>
                <input
                  className="input"
                  name="description"
                  placeholder="Brief description of this community"
                  value={newForm.description}
                  onChange={handleNewFormChange}
                />
              </div>

              <div style={styles.modalActions}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={creating}
                >
                  {creating ? 'Creating...' : 'Create Community'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  titleRow:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title:     { fontSize: 22, fontWeight: 700 },
  searchBox: { marginBottom: 24 },
  row:       { display: 'flex', gap: 12, alignItems: 'center' },
  grid:      { display: 'flex', flexDirection: 'column', gap: 14 },
  hint:      { color: '#9ca3af', fontSize: 14, marginTop: 12 },

  // Modal
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    padding: 16,
  },
  modal: {
    background: 'white',
    borderRadius: 16,
    padding: 28,
    width: '100%',
    maxWidth: 460,
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: 700 },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: 18,
    cursor: 'pointer',
    color: '#6b7280',
  },
  form:    { display: 'flex', flexDirection: 'column', gap: 16 },
  field:   { display: 'flex', flexDirection: 'column', gap: 6 },
  label:   { fontSize: 13, fontWeight: 600, color: '#374151' },
  modalActions: { display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 4 },
}
