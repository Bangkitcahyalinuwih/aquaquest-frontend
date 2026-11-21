import http from './http'
import { USE_MOCK } from './config'
import * as mock from './mock/dashboard'

export const getDashboard = () => (USE_MOCK ? mock.getDashboard() : http.get('/dashboard').then((r) => r.data))