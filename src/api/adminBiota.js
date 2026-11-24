import http from './http'
import { USE_MOCK } from './config'
import { buatCrudApi } from './adminCrud'
import * as mock from './mock/adminBiota'

export const biotaAdmin = {
  ...buatCrudApi('biota', mock),
  // Pilihan (id dan nama) untuk <select> di form edukasi, soal, dan kartu. params: { tanpa_kartu: 1 }
  opsi: (params = {}) =>
    USE_MOCK ? mock.opsi(params) : http.get('/admin/biota/opsi', { params }).then((r) => r.data),
}
