import http from './http'
import { USE_MOCK } from './config'

// Mengubah objek form menjadi FormData. Wajib bila ada file: JSON tidak bisa membawa file.
export function keFormData(data) {
  const form = new FormData()
  for (const [kunci, nilai] of Object.entries(data)) {
    if (nilai === undefined) continue
    if (nilai instanceof File) form.append(kunci, nilai)
    else form.append(kunci, nilai === null ? '' : nilai) // string kosong: Laravel mengubahnya menjadi null
  }
  return form
}

// Membuat lima fungsi (daftar, detail, tambah, ubah, hapus) untuk satu modul. "mock" dipakai bila VITE_USE_MOCK=true.
export function buatCrudApi(path, mock) {
  return {
    daftar: (params = {}) =>
      USE_MOCK ? mock.daftar(params) : http.get(`/admin/${path}`, { params }).then((r) => r.data),
    detail: (id) =>
      USE_MOCK ? mock.detail(id) : http.get(`/admin/${path}/${id}`).then((r) => r.data),
    tambah: (data) =>
      USE_MOCK
        ? mock.tambah(data)
        : http.post(`/admin/${path}`, keFormData(data)).then((r) => r.data),

    // Ubah data (yang mungkin berisi file) memakai POST + _method=PUT, karena PHP tidak membaca data multipart pada PUT asli.
    ubah: (id, data) =>
      USE_MOCK
        ? mock.ubah(id, data)
        : http
            .post(`/admin/${path}/${id}`, keFormData({ ...data, _method: 'PUT' }))
            .then((r) => r.data),

    hapus: (id) => (USE_MOCK ? mock.hapus(id) : http.delete(`/admin/${path}/${id}`)),
  }
}
