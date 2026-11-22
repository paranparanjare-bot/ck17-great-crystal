document.addEventListener('DOMContentLoaded', function () {
  var tombol = document.querySelector('.tombol-chat');
  var panel = document.querySelector('.panel-chat');
  var daftar = document.getElementById('pesan-chat');
  var form = document.getElementById('ketik-chat');
  var masukan = document.getElementById('masukan-chat');
  var tutup = document.querySelector('.tutup-chat');
  if (!tombol || !panel || !daftar) return;

  // Otak AI di Cloudflare Worker (dipakai bila tidak ada jawaban lokal).
  var URL_WORKER = 'https://ck17-chatbot.gnet-bwi.workers.dev/';

  // Latar gelap (backdrop) untuk pop-up modal — dibuat di sini supaya
  // keenam halaman HTML tidak perlu diubah satu per satu.
  var latar = document.createElement('div');
  latar.className = 'latar-chat';
  latar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(latar);
  latar.addEventListener('click', tutupPanel);

  // 12 tanya-jawab lokal — jawaban cepat di balik layar (tanpa tombol preset).
  // Kata kunci dibuat SPESIFIK (frasa) agar pertanyaan detail lolos ke AI:
  // kata umum seperti 'peresmian', 'siapa', 'harga', 'alamat', 'di mana'
  // TIDAK dipakai — mereka mencocokkan pertanyaan yang jawabannya tidak
  // ada di jawaban lokal (mis. isi acara peresmian, alamat sekretariat).
  var TANYA = [
    { kunci: ['apa itu ck17', 'ck17 itu apa', 'tentang ck17', 'qigong', 'senam'], jawab: "CK17 adalah senam bio-energi (Chinese Bio-Energy Medical Chi-Kung). Senam ini terdiri atas 17 jurus, dicetuskan oleh Guru Besar asal Taiwan, Prof. Dr. Lee Chen Chou. Anggota berlatih bersama secara rutin di sasana, dipandu instruktur." },
    { kunci: ['biaya', 'gratis', 'bayar'], jawab: "Latihan CK17 gratis dan terbuka bagi masyarakat, tanpa pungutan biaya." },
    { kunci: ['sasana', 'lokasi', 'tempat latihan'], jawab: "Ada 6 sasana di bawah DPC Banyuwangi: Kedai 45 (Banyuwangi Kota), Ketapang, MENDUT, Baru Indah (Hotel Jajag), Alam Cabe (Genteng), dan GENDOH (Rogojampi)." },
    { kunci: ['bergabung', 'gabung', 'daftar', 'mendaftar', 'cara join', 'join'], jawab: "Caranya mudah: datang langsung ke salah satu sasana saat jadwal latihan, atau hubungi kami lewat WhatsApp 0851-1150-7890. Pendaftaran gratis." },
    { kunci: ['jadwal', 'kapan latihan', 'jam latihan', 'hari latihan'], jawab: "Jadwal latihan tiap sasana menyusul — silakan hubungi kami lewat WhatsApp 0851-1150-7890 untuk info terbaru." },
    { kunci: ['ketua', 'pengurus', 'pemimpin', 'agus sudirman', 'david suwondo', 'harijanto', 'ike dianita', 'lao shi'], jawab: "Ketua DPC Banyuwangi: Bapak Agus Sudirman. Instruktur Senior: Lao shi IKE Dianita. Ketua Great Crystal Indonesia CK17 Pusat Surabaya: Bapak David Suwondo. Dewan Pembina Pusat Surabaya: Bapak Harijanto." },
    { kunci: ['kapan diresmikan', 'diresmikan kapan', 'kapan peresmian', 'peresmian kapan', 'di mana diresmikan', 'diresmikan di mana', 'kapan berdiri', 'berdiri kapan', 'sejarah'], jawab: "DPC Banyuwangi diresmikan pada Kamis, 19 November 2026, di Blambangan Ballroom, Aston Hotel Banyuwangi, oleh Bapak David Suwondo. Ini DPC pertama di kabupaten dan sudah berlegalitas resmi sebagai cabang olahraga (cabor) di bawah KORMI Banyuwangi." },
    { kunci: ['anggota', 'peserta', 'jumlah', 'berapa orang'], jawab: "Lebih kurang 500 anggota dari keenam sasana hadir pada peresmian, dan 30 instruktur junior dilantik pada acara tersebut." },
    { kunci: ['manfaat', 'khasiat', 'guna', 'untuk apa', 'kesehatan'], jawab: "Senam CK17 membantu menjaga kebugaran tubuh sekaligus menenangkan pikiran dan hati, serta membudayakan pola hidup sehat." },
    { kunci: ['hubungi', 'kontak', 'whatsapp', 'telepon', 'nomor'], jawab: "Silakan hubungi kami lewat WhatsApp <a href=\"https://wa.me/6285111507890\">0851-1150-7890</a>. Video kegiatan ada di kanal YouTube @greatcrystal." },
    { kunci: ['video peresmian', 'video', 'youtube', 'tonton'], jawab: "Video kegiatan CK17 ada di kanal YouTube <a href=\"https://www.youtube.com/@greatcrystal\">@greatcrystal</a> — termasuk video peresmian DPC Banyuwangi." },
    { kunci: ['kormi', 'legalitas', 'izin', 'ck17 resmi', 'sudah resmi'], jawab: "DPC Banyuwangi sudah berlegalitas resmi dan menjadi cabang olahraga (cabor) di bawah KORMI (Komite Olahraga Masyarakat Indonesia) Banyuwangi, diperkuat Surat Keputusan (SK) dari KORMI." }
  ];

  var JAWABAN_TIDAK_TAHU = "Maaf, saya belum tahu jawabannya. Silakan hubungi kami lewat WhatsApp <a href=\"https://wa.me/6285111507890\">0851-1150-7890</a>.";

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
    return b;
  }

  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Tanya otak AI (Worker). Gelembung "Sedang berpikir…" diganti jawabannya
  // begitu respons tiba; bila gagal/timeout, tampilkan fallback WhatsApp.
  function tanyaAI(teks, gelembung) {
    var selesai = false;
    var pewaktu = null;
    function selesaiDenganHtml(html) {
      if (selesai) return;
      selesai = true;
      if (pewaktu) clearTimeout(pewaktu);
      gelembung.innerHTML = html;
      daftar.scrollTop = daftar.scrollHeight;
    }
    function gagal() { selesaiDenganHtml(JAWABAN_TIDAK_TAHU); }
    if (typeof fetch !== 'function') { gagal(); return; }
    var opsi = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pertanyaan: teks })
    };
    var pengendali = null;
    if (typeof AbortController !== 'undefined') {
      pengendali = new AbortController();
      opsi.signal = pengendali.signal;
    }
    pewaktu = setTimeout(function () {
      if (pengendali) { pengendali.abort(); } else { gagal(); }
    }, 15000);
    fetch(URL_WORKER, opsi).then(function (r) { return r.json(); }).then(function (data) {
      var a = data && data.jawaban ? String(data.jawaban).trim() : '';
      if (a) { selesaiDenganHtml(escapeHtml(a).replace(/\n/g, '<br>')); }
      else { gagal(); }
    }).catch(function () { gagal(); });
  }

  function kirim(teks) {
    var t = (teks || '').trim();
    if (!t) return;
    tambahPesan(t, 'saya');
    var jawab = cariJawaban(t);
    if (jawab) {
      setTimeout(function () { tambahPesan(jawab, 'bot'); }, 400);
      return;
    }
    var gelembung = tambahPesan('Sedang berpikir…', 'bot');
    tanyaAI(t, gelembung);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    kirim(masukan.value);
    masukan.value = '';
    masukan.focus();
  });

  var sudahSapa = false;
  function buka() {
    panel.classList.add('terbuka');
    latar.classList.add('tampil');
    document.body.style.overflow = 'hidden';
    tombol.setAttribute('aria-expanded', 'true');
    if (!sudahSapa) {
      sudahSapa = true;
      tambahPesan('Halo! Saya Bot CK17. Silakan tanya tentang CK17 — misalnya apa itu CK17, di mana sasananya, atau cara bergabung.', 'bot');
    }
    masukan.focus();
  }
  function tutupPanel() {
    panel.classList.remove('terbuka');
    latar.classList.remove('tampil');
    document.body.style.overflow = '';
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
