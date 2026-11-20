import http from './http'
import { USE_MOCK } from './config'
import * as mock from './mock/profil'

export const updateProfil = (payload) => (USE_MOCK ? mock.updateProfil(payload) : http.put('/profil', payload).then((r) => r.data))
