// true bila VITE_USE_MOCK=true. Semua berkas src/api/*.js memeriksanya untuk memilih mock atau API asli.
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))