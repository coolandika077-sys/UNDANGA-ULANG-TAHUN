/* ==========================================================================
   SCRIPT.JS - VERSI SEDERHANA & MUDAH DIJELASKAN KE GURU
   Setiap fungsi diberi penjelasan baris per baris agar mudah dipahami.
   ========================================================================== */

// Menunggu seluruh halaman HTML selesai dimuat sebelum menjalankan kode
document.addEventListener("DOMContentLoaded", function () {

  // ========================================================================
  // BAGIAN 1: MENGAMBIL NAMA TAMU DARI URL (Contoh: link.com/?to=Budi+Santoso)
  // ========================================================================
  // 1. Ambil parameter dari link browser di atas
  const parameterURL = new URLSearchParams(window.location.search);
  
  // 2. Ambil nilai di belakang kata '?to='
  const namaTamu = parameterURL.get("to");

  // 3. Cari tempat di HTML untuk menampilkan nama tamu
  const labelNamaTamuCover = document.getElementById("guest-name-cover");
  const inputNamaRSVP = document.getElementById("rsvp-name");

  // 4. Jika ada nama tamu di URL, ganti tulisan di layar
  if (namaTamu) {
    labelNamaTamuCover.textContent = namaTamu; // Tampilkan nama di cover
    inputNamaRSVP.value = namaTamu;           // Otomatis isi juga di form RSVP
  }


  // ========================================================================
  // BAGIAN 2: KONTROL MUSIK & TOMBOL BUKA UNDANGAN
  // ========================================================================
  const layarCover = document.getElementById("cover-screen");
  const tombolBuka = document.getElementById("btn-open-invitation");
  const musik = document.getElementById("bg-music");
  const tombolMusik = document.getElementById("music-toggle-btn");
  const ikonMusik = document.getElementById("music-icon");

  let statusMusikSedangPutar = false;

  // Fungsi untuk memutar atau memberhentikan musik (Play / Pause)
  function aturMusik() {
    if (statusMusikSedangPutar) {
      // Jika musik sedang menyala -> kita pause
      musik.pause();
      ikonMusik.classList.remove("animate-spin-disc"); // Matikan animasi putaran
      statusMusikSedangPutar = false;
    } else {
      // Jika musik sedang mati -> kita nyalakan (play)
      musik.play().then(function() {
        ikonMusik.classList.add("animate-spin-disc"); // Nyalakan animasi putaran
        statusMusikSedangPutar = true;
      }).catch(function(error) {
        console.log("Musik dicegah otomatis oleh browser:", error);
      });
    }
  }

  // Aksi ketika tombol "Buka Undangan" diklik
  tombolBuka.addEventListener("click", function () {
    // 1. Tutup/geser layar cover ke atas
    layarCover.classList.add("opened");

    // 2. Buka kunci scroll agar halaman bisa digeser ke bawah
    document.body.classList.remove("overflow-hidden");

    // 3. Putar musik latar
    aturMusik();

    // 4. Munculkan efek kembang api kertas (Confetti)
    if (typeof confetti === "function") {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    }

    // 5. Jalankan animasi AOS saat di-scroll
    if (typeof AOS !== "undefined") {
      AOS.init({ duration: 800, once: true });
    }
  });

  // Aksi ketika tombol musik melayang di pojok layar diklik
  tombolMusik.addEventListener("click", function () {
    aturMusik();
  });


  // ========================================================================
  // BAGIAN 3: HITUNG MUNDUR (COUNTDOWN TIMER REAL-TIME)
  // ========================================================================
  // Ganti tanggal acara di bawah ini (Bulan Tanggal, Tahun Jam:Menit:Detik)
  const waktuAcara = new Date("December 31, 2026 16:00:00").getTime();

  function jalankanHitungMundur() {
    const waktuSekarang = new Date().getTime();
    const selisihWaktu = waktuAcara - waktuSekarang;

    // Jika waktu acara sudah lewat
    if (selisihWaktu <= 0) {
      document.getElementById("countdown-days").textContent = "00";
      document.getElementById("countdown-hours").textContent = "00";
      document.getElementById("countdown-minutes").textContent = "00";
      document.getElementById("countdown-seconds").textContent = "00";
      return;
    }

    // Rumus matematika sederhana membagi milidetik
    const hari = Math.floor(selisihWaktu / (1000 * 60 * 60 * 24));
    const jam = Math.floor((selisihWaktu % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const menit = Math.floor((selisihWaktu % (1000 * 60 * 60)) / (1000 * 60));
    const detik = Math.floor((selisihWaktu % (1000 * 60)) / 1000);

    // Tampilkan angka ke layar HTML (diberi angka 0 di depan jika di bawah 10)
    document.getElementById("countdown-days").textContent = String(hari).padStart(2, "0");
    document.getElementById("countdown-hours").textContent = String(jam).padStart(2, "0");
    document.getElementById("countdown-minutes").textContent = String(menit).padStart(2, "0");
    document.getElementById("countdown-seconds").textContent = String(detik).padStart(2, "0");
  }

  // Jalankan fungsi countdown otomatis setiap 1 detik (1000 milidetik)
  setInterval(jalankanHitungMundur, 1000);
  jalankanHitungMundur();


  // ========================================================================
  // BAGIAN 4: SIMPAN ACARA KE GOOGLE CALENDAR
  // ========================================================================
  const tombolKalender = document.getElementById("btn-save-calendar");
  if (tombolKalender) {
    tombolKalender.addEventListener("click", function () {
      const judul = encodeURIComponent("Ulang Tahun Alya Rahmania");
      const info = encodeURIComponent("Perayaan Ulang Tahun Sweet Seventeen di Grand Garden Resto.");
      const lokasi = encodeURIComponent("Grand Garden Cafe & Resto, Jakarta Selatan");
      
      // Format Tanggal: YYYYMMDDTHHmmssZ
      const linkGoogleCalendar = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${judul}&dates=20261231T090000Z/20261231T140000Z&details=${info}&location=${lokasi}`;
      
      // Buka halaman Google Calendar di tab baru
      window.open(linkGoogleCalendar, "_blank");
    });
  }


  // ========================================================================
  // BAGIAN 5: SALIN NOMOR REKENING / ALAMAT KADO (COPY TO CLIPBOARD)
  // ========================================================================
  window.copyText = function (teksYangMauDisalin, keterangan) {
    // Gunakan fungsi bawaan browser untuk menyalin teks
    navigator.clipboard.writeText(teksYangMauDisalin).then(function () {
      // Tampilkan pemberitahuan (toast) bahwa salin berhasil
      tampilkanPemberitahuan(keterangan + " berhasil disalin!");
    }).catch(function () {
      // Jika browser lama tidak mendukung clipboard
      tampilkanPemberitahuan("Gagal menyalin teks.");
    });
  };

  // Fungsi menampilkan kotak pesan hitam di bawah layar
  function tampilkanPemberitahuan(pesan) {
    const kotakPemberitahuan = document.getElementById("copy-toast");
    const tulisanPesan = document.getElementById("toast-message");

    tulisanPesan.textContent = pesan;
    kotakPemberitahuan.classList.add("show"); // Munculkan

    // Hilangkan kembali otomatis setelah 2,5 detik
    setTimeout(function () {
      kotakPemberitahuan.classList.remove("show");
    }, 2500);
  }


  // ========================================================================
  // BAGIAN 6: FORMULIR RSVP & BUKU TAMU PERSISTEN (LOCALSTORAGE)
  // ========================================================================
  const formRSVP = document.getElementById("rsvp-form");
  const daftarUcapanHTML = document.getElementById("wishes-container");
  const totalUcapanHTML = document.getElementById("guest-count");

  // Nama kunci penyimpanan di memori browser
  const KUNCI_STORAGE = "database_ucapan_ultah";

  // Data contoh awal jika buku tamu masih kosong
  const ucapanAwal = [
    {
      nama: "Rizky Pratama",
      status: "Hadir",
      pesan: "Selamat ulang tahun yang ke-17! Semoga makin sukses dan ceria selalu ya 🎉",
      waktu: "1 jam lalu"
    },
    {
      nama: "Nabila Aurelia",
      status: "Hadir",
      pesan: "Happy Sweet Seventeen bestie! Can't wait to celebrate with you! 💖🎂",
      waktu: "3 jam lalu"
    }
  ];

  // Fungsi membaca data dari memori browser (LocalStorage)
  function ambilDataUcapan() {
    const dataTersimpan = localStorage.getItem(KUNCI_STORAGE);
    
    // Jika belum pernah ada data, simpan dan gunakan data contoh awal
    if (!dataTersimpan) {
      localStorage.setItem(KUNCI_STORAGE, JSON.stringify(ucapanAwal));
      return ucapanAwal;
    }
    
    // Mengubah data teks string kembali menjadi array JavaScript
    return JSON.parse(dataTersimpan);
  }

  // Fungsi menampilkan daftar ucapan ke layar (DOM Manipulation)
  function gambarUlangDaftarUcapan() {
    const daftarSemuaUcapan = ambilDataUcapan();

    // Perbarui angka jumlah ucapan
    totalUcapanHTML.textContent = daftarSemuaUcapan.length;

    // Bersihkan isi wadah ucapan sebelum diisi ulang
    daftarUcapanHTML.innerHTML = "";

    // Ulangi untuk setiap data ucapan dan ubah menjadi kotak kartu HTML
    daftarSemuaUcapan.forEach(function (data) {
      // Ambil huruf pertama nama untuk avatar
      const hurufAwal = data.nama.charAt(0).toUpperCase();

      // Buat elemen <div> baru menggunakan JavaScript
      const kartu = document.createElement("div");
      kartu.className = "glass-card p-4 rounded-xl border border-[#c59b6b]/20 text-xs";
      
      // Isi bagian dalam kartu
      kartu.innerHTML = `
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-[#c59b6b] text-white font-bold flex items-center justify-center">
              ${hurufAwal}
            </div>
            <div>
              <p class="font-bold text-[#2c2725]">${data.nama}</p>
              <span class="text-[10px] text-gray-500">${data.waktu}</span>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold ${data.status === 'Hadir' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}">
            ${data.status}
          </span>
        </div>
        <p class="text-gray-700 leading-relaxed pl-10">${data.pesan}</p>
      `;

      // Masukkan kartu ke dalam halaman
      daftarUcapanHTML.appendChild(kartu);
    });
  }

  // Tangani saat formulir RSVP dikirim (Klik tombol Kirim)
  if (formRSVP) {
    formRSVP.addEventListener("submit", function (event) {
      // Cegah halaman me-refresh sendiri
      event.preventDefault();

      // Ambil nilai yang diketik oleh pengguna
      const inputNama = document.getElementById("rsvp-name").value.trim();
      const inputStatus = document.getElementById("rsvp-status").value;
      const inputPesan = document.getElementById("rsvp-message").value.trim();

      // Buat objek data ucapan baru
      const ucapanBaru = {
        nama: inputNama,
        status: inputStatus,
        pesan: inputPesan,
        waktu: "Baru saja"
      };

      // 1. Ambil data lama
      const listUcapanLama = ambilDataUcapan();

      // 2. Masukkan ucapan baru ke posisi paling atas
      listUcapanLama.unshift(ucapanBaru);

      // 3. Simpan kembali ke memori LocalStorage
      localStorage.setItem(KUNCI_STORAGE, JSON.stringify(listUcapanLama));

      // 4. Perbarui tampilan layar
      gambarUlangDaftarUcapan();

      // 5. Bersihkan kolom input pesan
      document.getElementById("rsvp-message").value = "";

      // 6. Tampilkan notifikasi berhasil
      tampilkanPemberitahuan("Ucapan dan konfirmasi Anda tersimpan!");
    });
  }

  // Tampilkan ucapan untuk pertama kali saat halaman dibuka
  gambarUlangDaftarUcapan();

});
