export function validationErrors(error) {
  return error?.response?.status === 422 ? (error.response.data.errors ?? {}) : {}
}

export function errorMessage(error, cadangan = 'Terjadi kesalahan. Coba lagi.') {
  return error?.response?.data?.message ?? cadangan
}