import http from './http'
import { USE_MOCK } from './config'
import * as mock from './mock/kuis'

export const mulai = () => (USE_MOCK ? mock.mulai() : http.post('/kuis/mulai').then((r) => r.data))
export const jawab = (gameId, payload) => (USE_MOCK ? mock.jawab(gameId, payload) : http.post(`/kuis/${gameId}/jawab`, payload).then((r) => r.data))
export const selesai = (gameId) => (USE_MOCK ? mock.selesai(gameId) : http.post(`/kuis/${gameId}/selesai`).then((r) => r.data))
