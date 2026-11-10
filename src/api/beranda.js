import http from './http'
import { USE_MOCK } from './config'
import * as mock from './mock/beranda'

export const getBeranda = () => (USE_MOCK ? mock.getBeranda() : http.get('/beranda').then((r) => r.data))