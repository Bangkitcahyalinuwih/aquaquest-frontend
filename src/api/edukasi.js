import http from './http'
import { USE_MOCK } from './config'
import * as mock from './mock/edukasi'

export const getEdukasiList = (params = {}) => (USE_MOCK ? mock.getEdukasiList(params) : http.get('/edukasi', { params }).then((r) => r.data))
export const getEdukasi = (slug) => (USE_MOCK ? mock.getEdukasi(slug) : http.get(`/edukasi/${slug}`).then((r) => r.data))