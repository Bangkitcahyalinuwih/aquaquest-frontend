export function galat(status, data) {
  const error = new Error(data?.message ?? `Galat ${status}`)
  error.response = { status, data }
  return error
}

export function paginasi(daftar, halaman = 1, ukuran = 9) {
  const page = Math.max(1, Number(halaman) || 1)
  const total = daftar.length
  const data = daftar.slice((page - 1) * ukuran, page * ukuran)

  return {
    data,
    links: { first: null, last: null, prev: null, next: null },
    meta: {
      current_page: page,
      from: total === 0 ? null : (page - 1) * ukuran + 1,
      last_page: Math.max(1, Math.ceil(total / ukuran)),
      per_page: ukuran,
      to: total === 0 ? null : (page - 1) * ukuran + data.length,
      total,
    },
  }
}