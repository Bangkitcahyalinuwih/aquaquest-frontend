import http from './http'
import { USE_MOCK } from './config'
import * as mock from './mock/adminDashboard'

export const getAdminDashboard = () =>
  USE_MOCK ? mock.getAdminDashboard() : http.get('/admin/dashboard').then((r) => r.data)
