import axios from 'axios'

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
})

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Auth ──────────────────────────────────────────────
export const register = (data) => api.post('/auth/register', data)
export const login    = (data) => api.post('/auth/login', data)

// ── Communities ───────────────────────────────────────
export const searchCommunities = (query = '', type = '') =>
  api.get(`/communities/search?query=${query}&type=${type}`)

export const getMyCommunities = () => api.get('/communities/mine')

export const getCommunity = (id) => api.get(`/communities/${id}`)

export const joinCommunity  = (id) => api.post(`/communities/${id}/join`)
export const leaveCommunity = (id) => api.post(`/communities/${id}/leave`)

// ── Messages ──────────────────────────────────────────
export const getMessages = (communityId) =>
  api.get(`/communities/${communityId}/messages`)

export const sendMessage = (communityId, content) =>
  api.post(`/communities/${communityId}/messages`, { content })

// ── User ──────────────────────────────────────────────
export const getProfile = () => api.get('/users/me')
