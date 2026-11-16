import http from './http'
import { USE_MOCK } from './config'
import * as mock from './mock/leaderboard'

export const getLeaderboard = () => (USE_MOCK ? mock.getLeaderboard() : http.get('/leaderboard').then((r) => r.data))