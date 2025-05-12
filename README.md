# Dashboard Monitoring Server IoT

![ServerMonitor](https://api.placeholder.com/820/300)

## 📊 Gambaran Umum

ServerMonitor adalah dashboard real-time untuk memantau parameter kelistrikan infrastruktur server. Dibangun dengan HTML, CSS, dan JavaScript, dashboard ini menyediakan visualisasi komprehensif tentang metrik tegangan, arus, dan daya dengan integrasi Firebase Realtime Database.

**Penulis:** Diky Aditia ([@dasaraul](https://github.com/dasaraul))

## ✨ Fitur

- **Pemantauan Real-Time:** Pantau tegangan, arus, konsumsi daya, dan metrik kesehatan server secara real-time
- **Visualisasi Data Dinamis:** Grafik interaktif dibangun dengan Chart.js untuk visualisasi data deret waktu yang jelas
- **Mode Gelap/Terang:** Tema antarmuka yang dapat dipilih pengguna untuk kenyamanan melihat di berbagai lingkungan
- **Integrasi Firebase:** Koneksi mulus ke Firebase Realtime Database untuk penyimpanan data yang andal
- **Desain Responsif:** Antarmuka yang sepenuhnya responsif dan berfungsi pada perangkat desktop dan seluler
- **Kontrol Status Data:** Beralih antara mode tampilan data dinamis (pembaruan otomatis) dan statis
- **Analitik Komprehensif:** Analisis terperinci tentang konsumsi daya harian, mingguan, dan bulanan

## 🛠️ Teknologi yang Digunakan

- **Frontend:** HTML5, CSS3, JavaScript
- **Visualisasi:** Chart.js
- **Database:** Firebase Realtime Database
- **Styling:** CSS kustom dengan desain responsif
- **Deployment:** Hosting statis (kompatibel dengan GitHub Pages)

## 📦 Instalasi & Pengaturan

### Prasyarat

- Node.js dan npm (untuk pengembangan)
- Akun Firebase (untuk integrasi database)

### Memulai

1. **Kloning repositori:**
   ```bash
   git clone https://github.com/dasaraul/Monitoring-IoT.git
   cd Monitoring-IoT
   ```

2. **Instal dependensi:**
   ```bash
   npm install
   ```

3. **Konfigurasi Firebase:**
   - Buat proyek Firebase di [Firebase Console](https://console.firebase.google.com/)
   - Siapkan Realtime Database
   - Perbarui konfigurasi Firebase di `js/firebase-init.js`:
     ```javascript
     const firebaseConfig = {
       databaseURL: "URL_DATABASE_FIREBASE_ANDA",
     };
     ```

4. **Jalankan aplikasi:**
   - Buka `index.html` di browser Anda untuk pengujian lokal
   - Atau siapkan server lokal:
     ```bash
     npx serve
     ```

## 📊 Struktur Dashboard

Dashboard terdiri dari dua tab utama:

### Tab Status
- Ikhtisar status server dengan indikator uptime, beban CPU, suhu, dan efisiensi
- Pemantauan tegangan real-time di tiga fase
- Grafik arus dan konsumsi daya
- Tabel data sensor dengan pembacaan terbaru
- Evaluasi metrik aturan

### Tab Analitik
- Informasi server komprehensif
- Analitik konsumsi daya (rata-rata harian, mingguan, bulanan)
- Tabel konsumsi daya per jam
- Log peringatan dengan indikator tingkat keparahan
- Tampilan data JSON lengkap untuk debugging

## 🧩 Struktur Proyek

```
Monitoring-IoT/
├── css/
│   └── styles.css             # Stylesheet utama dengan dukungan tema terang/gelap
├── js/
│   ├── app.js                 # Logika aplikasi utama
│   ├── charts.js              # Konfigurasi dan rendering grafik
│   ├── firebase-init.js       # Konfigurasi Firebase dan pendengar data
│   ├── main.js                # Inisialisasi dan cadangan simulasi
│   └── ui-handlers.js         # Penangan event UI dan fungsi tampilan data
├── index.html                 # Struktur HTML utama
├── package.json               # Dependensi proyek
└── README.md                  # Dokumentasi proyek
```

## 🔧 Kustomisasi

### Struktur Data

Struktur data Firebase default yang diharapkan oleh dashboard ini adalah:

```javascript
{
  "sensor_data": {
    "Edel": 1.88,            // Energi yang disampaikan (kWh)
    "Iavg": 0.06249,         // Arus rata-rata (A)
    "Ptot": 0.01056,         // Daya total (kW)
    "V1": 99.98767,          // Tegangan fase 1 (V)
    "V2": 101.4014,          // Tegangan fase 2 (V)
    "V3": 99.57052,          // Tegangan fase 3 (V)
    "Vavg": 57.92268         // Tegangan rata-rata (V)
  },
  "server_info": {
    // Metadata server
  },
  "power_metrics": {
    // Data daya historis
  },
  "alerts": [
    // Peringatan sistem
  ]
}
```

### Kustomisasi Tema

Dashboard ini menyertakan pengalih tema gelap/terang bawaan. Warna dapat disesuaikan di `css/styles.css`:

```css
:root {
  --bg-main: #f3f4f6;       /* Latar belakang utama */
  --bg-card: #ffffff;       /* Latar belakang kartu */
  --text-main: #1f2937;     /* Warna teks utama */
  /* Variabel warna tambahan */
}

.dark-mode {
  --bg-main: #111827;       /* Latar belakang utama mode gelap */
  --bg-card: #1f2937;       /* Latar belakang kartu mode gelap */
  --text-main: #f3f4f6;     /* Warna teks utama mode gelap */
  /* Variabel warna mode gelap tambahan */
}
```

## 🌐 Integrasi Firebase

Dashboard ini terhubung ke Firebase Realtime Database untuk mengambil dan menampilkan data real-time. Koneksi ini ditangani di `js/firebase-init.js`.

### Mekanisme Fallback

Jika koneksi Firebase terputus, dashboard secara otomatis beralih ke mode simulasi, menghasilkan data acak untuk mendemonstrasikan fungsionalitas.

### Konsol Debug

Tekan `Ctrl+Shift+D` untuk mengalihkan konsol debug, yang menampilkan status koneksi dan peristiwa pembaruan data.

## 📱 Desain Responsif

Dashboard ini sepenuhnya responsif dan beradaptasi dengan berbagai ukuran layar:

- **Desktop:** Tata letak multi-kolom penuh dengan grafik detail
- **Tablet:** Tata letak grid yang disesuaikan dengan fungsionalitas yang dipertahankan
- **Seluler:** Tata letak kolom tunggal dengan bagian yang dapat di-scroll

## 🔄 Beralih Antara Data Dinamis dan Statis

Klik tombol "Toggle Status" untuk beralih antara:

- **DINAMIS:** Pembaruan data real-time dari Firebase atau simulasi
- **STATIS:** Tampilan data tetap tanpa pembaruan

## 📝 Lisensi

Lisensi MIT - Bebas untuk menggunakan, memodifikasi, dan mendistribusikan proyek ini.

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan kirimkan pull request.

1. Fork repositori
2. Buat branch fitur Anda (`git checkout -b fitur/fitur-keren`)
3. Commit perubahan Anda (`git commit -m 'Menambahkan fitur keren'`)
4. Push ke branch (`git push origin fitur/fitur-keren`)
5. Buka Pull Request

## 📞 Kontak

Diky Aditia
Dasaraul - [@dasaraul](https://github.com/dasaraul)

Link Proyek: [https://github.com/dasaraul/Monitoring-IoT](https://github.com/dasaraul/Monitoring-IoT)

---

By Diky Aditia