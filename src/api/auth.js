import http from './http'
import { USE_MOCK } from './config'
import * as mock from './mock/auth'

// Pola semua berkas src/api/*.js: pilih mock atau API asli. Yang dikembalikan selalu BODY respons (bentuk kontrak).
export const register = (payload) => (USE_MOCK ? mock.register(payload) : http.post('/auth/register', payload).then((r) => r.data))
export const login = (payload) => (USE_MOCK ? mock.login(payload) : http.post('/auth/login', payload).then((r) => r.data))
export const logout = () => (USE_MOCK ? mock.logout() : http.post('/auth/logout'))
export const me = () => (USE_MOCK ? mock.me() : http.get('/auth/me').then((r) => r.data))