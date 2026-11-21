import http from './http'
import { USE_MOCK } from './config'
import * as mock from './mock/koleksi'

export const getKoleksi = () => (USE_MOCK ? mock.getKoleksi() : http.get('/koleksi').then((r) => r.data))
