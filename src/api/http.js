import axios from 'axios'

// Satu instance Axios untuk seluruh aplikasi. Alamatnya RELATIF: tidak ada http://localhost di kode.
const http = axios.create({
  baseURL: '/api/v1',
  headers: { Accept: 'application/json' },
})

let ambilToken = () => null
let saatTidakLogin = () => {}

// Dipanggil sekali di main.js. Memberi tahu http.js cara mengambil token dan apa yang dilakukan saat 401,
// tanpa http.js perlu mengimpor store atau router (menghindari impor melingkar).
export function configureHttp({ getToken, onUnauthorized }) {
  ambilToken = getToken
  saatTidakLogin = onUnauthorized
}

// Interceptor permintaan: tempel token ke setiap request.
http.interceptors.request.use((config) => {
  const token = ambilToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Interceptor respons: 401 berarti token tidak valid atau kedaluwarsa.
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) saatTidakLogin()
    return Promise.reject(error)
  },
)

export default http