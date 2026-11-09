export const potong = (teks, n) => (teks.length > n ? `${teks.slice(0, n - 3)}...` : teks)

export const biotaPenuh = [
  { id: 1, slug: 'penyu-hijau', nama: 'Penyu Hijau', nama_latin: 'Chelonia mydas', kategori: 'Reptil Laut', status_konservasi: 'LC', habitat: 'Perairan tropis dan subtropis, padang lamun, pantai peneluran', deskripsi: 'Penyu hijau adalah salah satu penyu laut terbesar dengan cangkang keras berwarna cokelat hingga hijau zaitun. Saat dewasa, penyu hijau memakan lamun dan alga sehingga ikut menjaga kesehatan padang lamun.', latitude: 2.2867, longitude: 118.2425, gambar_url: null },
  { id: 2, slug: 'hiu-paus', nama: 'Hiu Paus', nama_latin: 'Rhincodon typus', kategori: 'Ikan', status_konservasi: 'EN', habitat: 'Laut terbuka tropis dan hangat', deskripsi: 'Hiu paus adalah ikan terbesar di dunia. Meski berukuran raksasa, ia jinak dan makan dengan menyaring plankton serta ikan kecil dari air. Di Indonesia, hiu paus sering terlihat di Teluk Cenderawasih.', latitude: -3.25, longitude: 134.9, gambar_url: null },
  { id: 3, slug: 'pari-manta-karang', nama: 'Pari Manta Karang', nama_latin: 'Mobula alfredi', kategori: 'Ikan', status_konservasi: 'VU', habitat: 'Terumbu karang dan perairan dangkal tropis', deskripsi: 'Pari manta karang adalah ikan bertulang rawan dengan sirip dada lebar menyerupai sayap. Ia menyaring plankton dan sering mengunjungi stasiun pembersihan di terumbu karang.', latitude: -0.57, longitude: 130.53, gambar_url: null },
  { id: 4, slug: 'dugong', nama: 'Dugong', nama_latin: 'Dugong dugon', kategori: 'Mamalia Laut', status_konservasi: 'VU', habitat: 'Padang lamun di perairan dangkal pesisir', deskripsi: 'Dugong adalah mamalia laut herbivora yang hidupnya bergantung pada padang lamun. Hilangnya padang lamun dan terjerat jaring nelayan menjadi ancaman utamanya.', latitude: 1.1, longitude: 104.5, gambar_url: null },
  { id: 5, slug: 'paus-biru', nama: 'Paus Biru', nama_latin: 'Balaenoptera musculus', kategori: 'Mamalia Laut', status_konservasi: 'EN', habitat: 'Laut terbuka, jalur migrasi samudra', deskripsi: 'Paus biru adalah hewan terbesar yang pernah diketahui hidup di Bumi. Ia menyaring krill dalam jumlah sangat besar. Perairan Laut Sawu dikenal sebagai koridor migrasi paus.', latitude: -9.8, longitude: 122.0, gambar_url: null },
  { id: 6, slug: 'kima-raksasa', nama: 'Kima Raksasa', nama_latin: 'Tridacna gigas', kategori: 'Moluska', status_konservasi: 'VU', habitat: 'Terumbu karang dangkal', deskripsi: 'Kima raksasa adalah kerang terbesar di dunia. Sebagian makanannya berasal dari alga simbion di dalam mantelnya, sisanya dari menyaring plankton.', latitude: -5.3, longitude: 123.6, gambar_url: null },
  { id: 7, slug: 'ikan-badut', nama: 'Ikan Badut', nama_latin: 'Amphiprion ocellaris', kategori: 'Ikan', status_konservasi: 'LC', habitat: 'Terumbu karang, berlindung di anemon laut', deskripsi: 'Ikan badut hidup berdampingan dengan anemon laut dalam hubungan saling menguntungkan: anemon melindungi ikan, dan ikan menjaga serta membersihkan anemon.', latitude: 1.62, longitude: 124.76, gambar_url: null },
  { id: 8, slug: 'ikan-napoleon', nama: 'Ikan Napoleon', nama_latin: 'Cheilinus undulatus', kategori: 'Ikan', status_konservasi: 'EN', habitat: 'Terumbu karang dan laguna', deskripsi: 'Ikan napoleon dikenali dari tonjolan di dahi dan bibirnya yang tebal. Penangkapan untuk perdagangan ikan karang hidup menyebabkan populasinya menurun.', latitude: -6.55, longitude: 121.05, gambar_url: null },
  { id: 9, slug: 'penyu-belimbing', nama: 'Penyu Belimbing', nama_latin: 'Dermochelys coriacea', kategori: 'Reptil Laut', status_konservasi: 'VU', habitat: 'Laut terbuka, bertelur di pantai tropis', deskripsi: 'Penyu belimbing adalah penyu terbesar dengan cangkang berkulit yang memiliki tonjolan memanjang. Makanan utamanya ubur-ubur.', latitude: -0.43, longitude: 132.35, gambar_url: null },
  { id: 10, slug: 'lumba-lumba-spinner', nama: 'Lumba-lumba Spinner', nama_latin: 'Stenella longirostris', kategori: 'Mamalia Laut', status_konservasi: 'LC', habitat: 'Perairan tropis, teluk, dan laut terbuka', deskripsi: 'Lumba-lumba spinner terkenal karena kebiasaannya melompat dan berputar di udara. Hewan cerdas ini memakai ekolokasi untuk menemukan mangsa.', latitude: -5.77, longitude: 105.17, gambar_url: null },
]

export const edukasiPenuh = [
  { id: 1, slug: 'mengenal-sdg-14-ekosistem-lautan', judul: 'Mengenal SDG 14: Ekosistem Lautan', created_at: '2026-11-06T08:00:00+07:00', biota: null, gambar_url: null, isi: 'SDG 14 atau Life Below Water adalah salah satu Tujuan Pembangunan Berkelanjutan PBB yang berfokus pada pelestarian samudra, laut, dan sumber daya kelautan.\n\nIndonesia sebagai negara kepulauan memiliki kepentingan besar pada tujuan ini. Laut menjadi sumber pangan, mata pencaharian, dan penyangga iklim bagi jutaan orang.' },
  { id: 2, slug: 'mengapa-terumbu-karang-penting', judul: 'Mengapa Terumbu Karang Penting?', created_at: '2026-11-05T08:00:00+07:00', biota: null, gambar_url: null, isi: 'Terumbu karang hanya menutupi sebagian kecil dasar laut, tetapi menjadi rumah bagi sangat banyak jenis biota laut.\n\nTerumbu karang juga melindungi garis pantai dari hantaman ombak dan mendukung perikanan serta pariwisata.' },
  { id: 3, slug: 'bahaya-sampah-plastik-bagi-biota-laut', judul: 'Bahaya Sampah Plastik bagi Biota Laut', created_at: '2026-11-04T08:00:00+07:00', biota: null, gambar_url: null, isi: 'Sampah plastik yang berakhir di laut dapat dimakan atau melilit biota laut. Penyu sering mengira kantong plastik sebagai ubur-ubur.\n\nMengurangi plastik sekali pakai dan membuang sampah pada tempatnya membantu mengurangi masalah ini.' },
  { id: 4, slug: 'padang-lamun-penjaga-pesisir-yang-sering-terlupakan', judul: 'Padang Lamun: Penjaga Pesisir yang Sering Terlupakan', created_at: '2026-11-03T08:00:00+07:00', biota: { slug: 'dugong', nama: 'Dugong' }, gambar_url: null, isi: 'Lamun adalah tumbuhan berbunga yang hidup di dasar perairan dangkal. Hamparannya disebut padang lamun.\n\nPadang lamun menjadi tempat mencari makan dan berlindung bagi banyak hewan, termasuk dugong dan penyu hijau.' },
  { id: 5, slug: 'memahami-status-konservasi-iucn', judul: 'Memahami Status Konservasi IUCN', created_at: '2026-11-02T08:00:00+07:00', biota: null, gambar_url: null, isi: 'IUCN Red List menilai risiko kepunahan suatu jenis makhluk hidup. Kategori yang sering ditemui antara lain LC (risiko rendah), VU (rentan), EN (genting), dan CR (kritis).\n\nStatus sebuah spesies dapat berubah ketika penilaian diperbarui.' },
  { id: 6, slug: 'cara-sederhana-menjaga-laut-dari-rumah', judul: 'Cara Sederhana Menjaga Laut dari Rumah', created_at: '2026-11-01T08:00:00+07:00', biota: null, gambar_url: null, isi: 'Menjaga laut tidak harus dimulai dari pantai. Kebiasaan di rumah juga berpengaruh karena banyak sampah di laut berasal dari daratan.\n\nKurangi plastik sekali pakai, pilih makanan laut yang ditangkap secara bertanggung jawab, dan ikut kegiatan bersih pantai di daerahmu.' },
]

export const biotaKeRingkas = (b) => ({
  slug: b.slug,
  nama: b.nama,
  nama_latin: b.nama_latin,
  kategori: b.kategori,
  status_konservasi: b.status_konservasi,
  gambar_url: b.gambar_url,
  deskripsi_singkat: potong(b.deskripsi, 90),
})

export const edukasiKeRingkas = (e) => ({
  slug: e.slug,
  judul: e.judul,
  ringkasan: potong(e.isi, 130),
  gambar_url: e.gambar_url,
  created_at: e.created_at,
})