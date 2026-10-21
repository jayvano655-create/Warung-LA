/* DATA WARUNG: ini satu-satunya file yang biasanya perlu kamu edit.
   - WARUNG: nama, nomor WhatsApp, jam buka, alamat
   - PRODUK: tambah/ubah/hapus produk (id harus unik)
   - gambar: bisa emoji (sementara) ATAU nama file foto.
     Cara pakai foto: buat folder "img" di samping index.html, taruh foto di situ,
     lalu tulis misalnya  gambar:"img/nasi-goreng.jpg"
     Tips: foto berbentuk landscape (4:3), ukuran di bawah 300 KB supaya cepat dibuka. */
// ============ PENGATURAN WARUNG (ganti di sini) ============
var WARUNG = {
  nama: "Warung LA",
  nomorWA: "6281331708609",   // format internasional tanpa + dan tanpa 0 di depan
  jam: "06.00 - 15.00 WIB",
  alamat: "Jl. Ahmad Yani No. 24, Kepanjen, Malang",
  area: "Pesan lewat WhatsApp, lalu ambil langsung di warung"
};
// ============ DATA MENU: id, nama, harga, kategori, gambar ============
var PRODUK = [
  {id:1,nama:"Nasi Goreng Spesial",harga:18000,kategori:"Makanan Utama",gambar:"🍛",desc:"Nasi goreng dengan telur, ayam suwir, dan acar."},
  {id:2,nama:"Soto Ayam",harga:16000,kategori:"Makanan Utama",gambar:"🍲",desc:"Soto ayam kuah kuning hangat, sudah termasuk nasi."},
  {id:3,nama:"Mie Ayam Bakso",harga:15000,kategori:"Makanan Utama",gambar:"🍜",desc:"Mie ayam dengan dua bakso dan pangsit goreng."},
  {id:4,nama:"Gado-gado",harga:14000,kategori:"Makanan Utama",gambar:"🥗",desc:"Sayur rebus, tahu, tempe, lontong, bumbu kacang."},
  {id:5,nama:"Ayam Goreng",harga:15000,kategori:"Lauk",gambar:"🍗",desc:"Ayam goreng bumbu kuning, satu potong, plus sambal."},
  {id:6,nama:"Sate Ayam 10 Tusuk",harga:20000,kategori:"Lauk",gambar:"🍢",desc:"Sate ayam bumbu kacang, disajikan dengan lontong."},
  {id:7,nama:"Tahu Tempe Goreng",harga:6000,kategori:"Lauk",gambar:"🍘",desc:"Tahu dan tempe goreng, isi 4 potong."},
  {id:8,nama:"Nasi Putih",harga:4000,kategori:"Lauk",gambar:"🍚",desc:"Nasi putih hangat, satu porsi."},
  {id:9,nama:"Es Teh Manis",harga:4000,kategori:"Minuman",gambar:"🧋",desc:"Teh manis dingin, gelas besar."},
  {id:10,nama:"Es Jeruk",harga:6000,kategori:"Minuman",gambar:"🍊",desc:"Jeruk peras segar dengan es batu."},
  {id:11,nama:"Kopi Susu",harga:10000,kategori:"Minuman",gambar:"☕",desc:"Kopi susu gula aren, panas atau dingin."},
  {id:12,nama:"Air Mineral",harga:4000,kategori:"Minuman",gambar:"💧",desc:"Air mineral botol 600 ml."},
  {id:13,nama:"Pisang Goreng",harga:8000,kategori:"Camilan",gambar:"🍌",desc:"Pisang goreng krispi, isi 5 potong."},
  {id:14,nama:"Kerupuk",harga:3000,kategori:"Camilan",gambar:"🥠",desc:"Kerupuk putih, satu bungkus kecil."},
  {id:15,nama:"Es Campur",harga:12000,kategori:"Camilan",gambar:"🍧",desc:"Es campur dengan cincau, kolang-kaling, dan susu."}
];
var KATEGORI = ["Semua","Makanan Utama","Lauk","Minuman","Camilan"];
