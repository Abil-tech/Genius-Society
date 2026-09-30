import axios from 'axios'

// Cookie HTTP-only dikirim otomatis; JWT tidak pernah disimpan di localStorage.
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',
  withCredentials: true,
})
