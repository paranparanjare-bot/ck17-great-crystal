document.addEventListener('DOMContentLoaded', function () {
  var tombol = document.querySelector('.tombol-chat');
  var panel = document.querySelector('.panel-chat');
  var daftar = document.getElementById('pesan-chat');
  var pilihan = document.getElementById('pilihan-chat');
  var form = document.getElementById('ketik-chat');
  var masukan = document.getElementById('masukan-chat');
  var tutup = document.querySelector('.tutup-chat');
  if (!tombol || !panel || !daftar) return;

  var TANYA = [
    { kunci: ['apa itu ck17', 'ck17 itu apa', 'tentang ck17', 'qigong', 'senam'], jawab: "CK17 adalah senam bio-energi (Chinese Bio-Energy Medical Chi-Kung). Senam ini terdiri atas 17 jurus, dicetuskan oleh Guru Besar asal Taiwan, Prof. Dr. Lee Chen Chou. Anggota berlatih bersama secara rutin di sasana, dipandu instruktur." },
    { kunci: ['biaya', 'gratis', 'bayar', 'harga'], jawab: "Latihan CK17 gratis dan terbuka bagi masyarakat, tanpa pungutan biaya." },
    { kunci: ['sasana', 'lokasi', 'di mana', 'dimana', 'tempat latihan', 'alamat'], jawab: "Ada 6 sasana di bawah DPC Banyuwangi: Kedai 45 (Banyuwangi Kota), Ketapang, MENDUT, Baru Indah (Hotel Jajag), Alam Cabe (Genteng), dan GENDOH (Rogojampi)." },
    { kunci: ['bergabung', 'gabung', 'daftar', 'ikut', 'mendaftar', 'cara join', 'join'], jawab: "Caranya mudah: datang langsung ke salah satu sasana saat jadwal latihan, atau hubungi kami lewat WhatsApp 0851-1150-7890. Pendaftaran gratis." },
    { kunci: ['jadwal', 'kapan latihan', 'jam latihan', 'hari latihan'], jawab: "Jadwal latihan tiap sasana menyusul — silakan hubungi kami lewat WhatsApp 0851-1150-7890 untuk info terbaru." },
    { kunci: ['ketua', 'pengurus', 'pemimpin', 'agus', 'ike', 'david', 'harijanto', 'siapa'], jawab: "Ketua DPC Banyuwangi: Bapak Agus Sudirman. Instruktur Senior: Lao shi IKE Dianita. Ketua Great Crystal Indonesia CK17 Pusat Surabaya: Bapak David Suwondo. Dewan Pembina Pusat Surabaya: Bapak Harijanto." },
    { kunci: ['diresmikan', 'peresmian', 'kapan berdiri', 'berdiri', 'sejarah'], jawab: "DPC Banyuwangi diresmikan pada Kamis, 19 November 2026, di Blambangan Ballroom, Aston Hotel Banyuwangi, oleh Bapak David Suwondo. Ini DPC pertama di kabupaten dan sudah berlegalitas resmi sebagai cabang olahraga (cabor) di bawah KORMI Banyuwangi." },
    { kunci: ['anggota', 'peserta', 'jumlah', 'berapa orang'], jawab: "Lebih kurang 500 anggota dari keenam sasana hadir pada peresmian, dan 30 instruktur junior dilantik pada acara tersebut." },
    { kunci: ['manfaat', 'khasiat', 'guna', 'untuk apa', 'kesehatan'], jawab: "Senam CK17 membantu menjaga kebugaran tubuh sekaligus menenangkan pikiran dan hati, serta membudayakan pola hidup sehat." },
    { kunci: ['hubungi', 'kontak', 'whatsapp', 'telepon', 'nomor'], jawab: "Silakan hubungi kami lewat WhatsApp <a href=\"https://wa.me/6285111507890\">0851-1150-7890</a>. Video kegiatan ada di kanal YouTube @greatcrystal." },
    { kunci: ['video peresmian', 'video', 'youtube', 'tonton'], jawab: "Video kegiatan CK17 ada di kanal YouTube <a href=\"https://www.youtube.com/@greatcrystal\">@greatcrystal</a> — termasuk video peresmian DPC Banyuwangi." },
    { kunci: ['kormi', 'legalitas', 'izin', 'resmi'], jawab: "DPC Banyuwangi sudah berlegalitas resmi dan menjadi cabang olahraga (cabor) di bawah KORMI (Komite Olahraga Masyarakat Indonesia) Banyuwangi, diperkuat Surat Keputusan (SK) dari KORMI." }
  ];

  var PILIHAN = [
    'Apa itu CK17?',
    'Di mana sasananya?',
    'Bagaimana cara bergabung?',
    'Apakah gratis?',
    'Kapan diresmikan?',
    'Siapa pengurusnya?'
  ];

  var JAWABAN_TIDAK_TAHU = "Maaf, saya belum tahu jawabannya. Coba pilih salah satu pertanyaan di bawah, atau hubungi kami lewat WhatsApp <a href=\"https://wa.me/6285111507890\">0851-1150-7890</a>.";

  function normalisasi(teks) {
    return teks.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function cariJawaban(teks) {
    var t = normalisasi(teks);
    var terbaik = null;
    var skorTerbaik = 0;
    TANYA.forEach(function (item) {
      var skor = 0;
      item.kunci.forEach(function (k) {
        if (t.indexOf(k) !== -1) { skor += k.length; }
      });
      if (skor > skorTerbaik) { skorTerbaik = skor; terbaik = item; }
    });
    return terbaik ? terbaik.jawab : null;
  }

  function tambahPesan(html, dari) {
    var b = document.createElement('div');
    b.className = 'gelembung ' + dari;
    if (dari === 'bot') { b.innerHTML = html; } else { b.textContent = html; }
    daftar.appendChild(b);
    daftar.scrollTop = daftar.scrollHeight;
  }

  function kirim(teks) {
    var t = (teks || '').trim();
    if (!t) return;
    tambahPesan(t, 'saya');
    var jawab = cariJawaban(t) || JAWABAN_TIDAK_TAHU;
    setTimeout(function () { tambahPesan(jawab, 'bot'); }, 400);
  }

  PILIHAN.forEach(function (p) {
    var b = document.createElement('button');
    b.type = 'button';
    b.textContent = p;
    b.addEventListener('click', function () { kirim(p); });
    pilihan.appendChild(b);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    kirim(masukan.value);
    masukan.value = '';
    masukan.focus();
  });

  var sudahSapa = false;
  function buka() {
    panel.classList.add('terbuka');
    tombol.setAttribute('aria-expanded', 'true');
    if (!sudahSapa) {
      sudahSapa = true;
      tambahPesan('Halo! Saya Bot CK17. Silakan tanya tentang CK17 — misalnya apa itu CK17, di mana sasananya, atau cara bergabung.', 'bot');
    }
    masukan.focus();
  }
  function tutupPanel() {
    panel.classList.remove('terbuka');
    tombol.setAttribute('aria-expanded', 'false');
  }
  tombol.addEventListener('click', function () {
    if (panel.classList.contains('terbuka')) { tutupPanel(); } else { buka(); }
  });
  tutup.addEventListener('click', tutupPanel);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') tutupPanel();
  });
});
