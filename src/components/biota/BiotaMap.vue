<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

const props = defineProps({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  nama: { type: String, default: '' },
})

// Perbaikan umum Leaflet + Vite: alamat gambar ikon pin bawaan menjadi rusak setelah build, jadi diarahkan ke berkas hasil impor.
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl })

const wadah = ref(null)   // terhubung ke elemen <div ref="wadah"> di template
let peta = null
let penanda = null

onMounted(() => {
  peta = L.map(wadah.value).setView([props.latitude, props.longitude], 8)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; kontributor <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(peta)

  // Isi popup berupa elemen teks, BUKAN string HTML. bindPopup(string) menafsirkan HTML sehingga nama dari API
  // yang berisi tag akan dieksekusi (XSS). textContent memperlakukannya sebagai teks biasa.
  const isiPopup = document.createElement('span')
  isiPopup.textContent = props.nama

  penanda = L.marker([props.latitude, props.longitude]).addTo(peta).bindPopup(isiPopup)
})

// Jika koordinat berubah (komponen dipakai ulang untuk biota lain), pindahkan peta dan pin.
watch(
  () => [props.latitude, props.longitude],
  ([lat, lng]) => {
    if (!peta) return
    peta.setView([lat, lng], 8)
    penanda.setLatLng([lat, lng])
  },
)

onBeforeUnmount(() => {
  peta?.remove()
  peta = null
})
</script>

<template>
  <!-- Leaflet butuh elemen dengan TINGGI yang pasti (h-72). Tanpa tinggi, peta tampak kosong. -->
  <div ref="wadah" class="h-72 w-full rounded-lg border" role="img" :aria-label="`Peta lokasi ${nama}`"></div>
</template>