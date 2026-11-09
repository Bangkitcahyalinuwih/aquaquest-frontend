import http from './http'
import { USE_MOCK } from './config'
import * as mock from './mock/biota'

// params: { q, kategori, page }. Axios membuang parameter yang undefined dari query string.
export const getBiotaList = (params = {}) => (USE_MOCK ? mock.getBiotaList(params) : http.get('/biota', { params }).then((r) => r.data))
export const getKategori = () => (USE_MOCK ? mock.getKategori() : http.get('/biota/kategori').then((r) => r.data))
export const getBiota = (slug) => (USE_MOCK ? mock.getBiota(slug) : http.get(`/biota/${slug}`).then((r) => r.data))