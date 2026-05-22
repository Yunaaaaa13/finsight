import { ShieldCheck, TrendingUp, Lightbulb, Target, Wallet, Activity, LucideIcon } from "lucide-react";

export interface Article {
  slug: string;
  title: string;
  desc: string;
  category: string;
  iconName: "ShieldCheck" | "TrendingUp" | "Lightbulb" | "Target" | "Wallet" | "Activity";
  content: string;
}

export const ARTICLES: Article[] = [
  {
    slug: "panduan-dana-darurat",
    title: "Panduan Dana Darurat",
    desc: "Mengapa Anda butuh minimal 6x pengeluaran bulanan dan bagaimana cara mengumpulkannya tanpa menyiksa diri.",
    category: "Dasar Finansial",
    iconName: "ShieldCheck",
    content: `
Dana darurat adalah fondasi dari segala perencanaan keuangan. Tanpa dana darurat, satu kejadian tak terduga—seperti kehilangan pekerjaan, sakit keras, atau kendaraan rusak—bisa langsung menghancurkan seluruh rencana keuangan Anda.

### Mengapa Harus 6x Pengeluaran Bulanan?
Banyak pakar keuangan menyarankan 3-6 bulan pengeluaran untuk mereka yang lajang, dan 6-12 bulan untuk yang sudah berkeluarga. Angka ini tidak muncul begitu saja. Rata-rata orang membutuhkan waktu 3 hingga 6 bulan untuk mencari pekerjaan baru jika mereka terkena PHK. 

### Cara Mengumpulkan Tanpa Menyiksa Diri
1. **Mulai dari yang kecil**: Jangan terintimidasi oleh target 6 bulan. Targetkan dulu 1 bulan pengeluaran.
2. **Automasi tabungan**: Sisihkan 10% dari gaji secara otomatis di hari gajian, jangan menunggu sisa uang di akhir bulan.
3. **Simpan di tempat yang tepat**: Rekening dana darurat harus likuid (mudah dicairkan kapan saja) namun sedikit sulit diakses agar tidak mudah terpakai untuk jajan (misalnya di reksa dana pasar uang atau tabungan tanpa kartu ATM).
    `
  },
  {
    slug: "investasi-vs-menabung",
    title: "Investasi vs Menabung",
    desc: "Menabung membuat uang Anda aman, tetapi investasi membuatnya tumbuh. Pelajari kapan harus melakukan keduanya.",
    category: "Pertumbuhan Aset",
    iconName: "TrendingUp",
    content: `
Banyak orang terjebak pada pemikiran bahwa mengumpulkan uang tunai di bank adalah cara untuk menjadi kaya. Padahal, dengan adanya inflasi, nilai uang Anda sebenarnya tergerus setiap tahunnya.

### Kapan Harus Menabung?
Menabung (menyimpan uang di rekening bank atau instrumen berisiko sangat rendah) digunakan untuk:
- Dana darurat.
- Tujuan keuangan jangka pendek (kurang dari 3 tahun) seperti menikah, liburan, atau DP rumah.
Tujuannya adalah keamanan, bukan imbal hasil.

### Kapan Harus Berinvestasi?
Investasi digunakan untuk tujuan jangka menengah hingga panjang (di atas 3-5 tahun), seperti persiapan pensiun atau dana pendidikan anak. Tujuannya adalah melawan inflasi dan menumbuhkan aset.

### Prinsip Utama
Jangan berinvestasi dengan uang yang Anda perlukan bulan depan. Dan jangan biarkan uang nganggur di tabungan jika uang tersebut dialokasikan untuk 10 tahun ke depan.
    `
  },
  {
    slug: "psikologi-uang",
    title: "Psikologi Uang",
    desc: "Bagaimana emosi dan bias kognitif mempengaruhi keputusan belanja Anda (dan cara meretasnya).",
    category: "Behavioral Finance",
    iconName: "Lightbulb",
    content: `
Keuangan pribadi bukanlah sekadar angka dan matematika; ini sebagian besar adalah tentang psikologi dan perilaku manusia.

### Jebakan Gaya Hidup (Lifestyle Creep)
Ini terjadi ketika standar hidup Anda meningkat seiring dengan peningkatan pendapatan Anda. Saat gaji naik, alih-alih menabung lebih banyak, Anda justru membeli mobil yang lebih mahal atau makan di tempat yang lebih mewah. Untuk mencegahnya, atur rasio tabungan secara persentase, bukan nominal.

### FOMO (Fear Of Missing Out)
FOMO adalah dorongan besar di balik pembelanjaan impulsif. Anda membeli ponsel terbaru karena teman-teman memilikinya, bukan karena Anda membutuhkannya. Cara meretasnya: gunakan *Aturan 48 Jam*. Jika Anda menginginkan sesuatu, tunggu 48 jam sebelum membelinya. Sebagian besar keinginan impulsif akan hilang dalam waktu tersebut.

Kekayaan sejati adalah apa yang tidak Anda lihat—uang yang tidak dibelanjakan untuk membeli barang mewah untuk pamer.
    `
  },
  {
    slug: "melunasi-utang-strategis",
    title: "Melunasi Utang Strategis",
    desc: "Metode Snowball vs Avalanche: Pendekatan matematis vs psikologis untuk bebas dari jeratan utang.",
    category: "Manajemen Utang",
    iconName: "Target",
    content: `
Terjerat utang konsumtif (seperti paylater atau kartu kredit) adalah penghalang terbesar menuju kebebasan finansial. Ada dua metode utama untuk melunasinya.

### Metode Debt Snowball
Anda mengurutkan utang dari **nominal terkecil ke terbesar**, tanpa mempedulikan bunga. Anda melunasi utang terkecil terlebih dahulu.
**Kelebihan:** Memberikan kemenangan psikologis yang cepat. Mengurangi jumlah tagihan satu per satu membuat Anda merasa sukses dan termotivasi untuk terus maju.

### Metode Debt Avalanche
Anda mengurutkan utang dari **suku bunga tertinggi ke terendah**. Anda melunasi utang dengan bunga paling besar terlebih dahulu.
**Kelebihan:** Secara matematis ini adalah cara yang paling benar. Anda akan menghemat lebih banyak uang karena meminimalkan bunga yang berbunga.

**Mana yang lebih baik?**
Jika Anda butuh motivasi, gunakan *Snowball*. Jika Anda sangat disiplin dengan hitungan angka, gunakan *Avalanche*.
    `
  },
  {
    slug: "membangun-portofolio",
    title: "Membangun Portofolio",
    desc: "Cara mengalokasikan aset Anda berdasarkan profil risiko dan target pensiun Anda di masa depan.",
    category: "Investasi Lanjut",
    iconName: "Wallet",
    content: `
Portofolio yang sehat tidak hanya tentang memilih saham yang akan naik besok, melainkan tentang keseimbangan (diversifikasi). Jangan menaruh semua telur Anda di dalam satu keranjang.

### 3 Jenis Aset Utama
1. **Aset Aman (Kas/Pasar Uang)**: Risiko sangat rendah, likuiditas tinggi. Cocok untuk stabilitas.
2. **Aset Berpendapatan Tetap (Obligasi)**: Risiko menengah, memberikan kupon/bunga rutin.
3. **Aset Pertumbuhan (Saham/Properti)**: Risiko tinggi, return paling tinggi dalam jangka panjang.

### Aturan Usia (Rule of Thumb)
Ada sebuah aturan kuno: "100 dikurangi usia Anda" adalah persentase yang harus Anda taruh di saham. Jika Anda berusia 25 tahun, maka 75% portofolio Anda bisa di saham (risiko tinggi), dan 25% di obligasi (aman). Seiring bertambahnya usia, porsi aman harus semakin besar.
    `
  },
  {
    slug: "audit-kebocoran-halus",
    title: "Audit Kebocoran Halus",
    desc: "Mengidentifikasi biaya langganan, jajan kecil, dan biaya admin yang menggerogoti kekayaan Anda secara perlahan.",
    category: "Optimasi Cashflow",
    iconName: "Activity",
    content: `
Kekayaan seringkali tidak hancur oleh pembelian besar yang dramatis, melainkan bocor secara perlahan melalui pengeluaran kecil yang sering diabaikan. Inilah yang disebut "Latte Factor".

### Apa itu Kebocoran Halus?
1. **Langganan yang tak terpakai**: Aplikasi premium, streaming film ketiga yang jarang ditonton, atau member gym yang sudah setahun tidak dikunjungi.
2. **Biaya Admin & Transaksi**: Biaya transfer antar bank, biaya top-up e-wallet, atau denda telat bayar kartu kredit.
3. **Jajan Impulsif**: Membeli kopi Rp40.000 setiap hari kerja sama dengan Rp800.000 sebulan, atau nyaris 10 juta setahun!

### Cara Mengatasinya
Audit pengeluaran Anda dengan Finsight. Cek kategori pengeluaran terbesar Anda. Temukan satu pengeluaran kecil harian yang bisa dikurangi (bukan dihilangkan), dan alokasikan uang tersebut ke investasi atau tabungan. Anda akan terkejut melihat kekuatan efek majemuk (*compound interest*) dari "uang kecil" tersebut dalam 10 tahun.
    `
  }
];
