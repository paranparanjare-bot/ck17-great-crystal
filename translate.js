// Terjemahan website CK17 (gratis via Google Translate).
// Bahasa utama: Bahasa Indonesia. Pilihan: English, 繁體中文 (Taiwan).
// Tombol globe di kanan atas header membuka dropdown; pilihan diterapkan
// lewat widget Google (tanpa muat ulang) atau cookie + muat ulang bila
// widget belum siap. Pilihan tersimpan di cookie googtrans dan berlaku
// di semua halaman.
//
// Widget Google diinisialisasi oleh skrip inline di HTML (pola resmi
// Google: wadah #google_translate_element di HTML + callback inline +
// element.js async). translate.js HANYA mengurus dropdown, supaya tidak
// ada perebutan definisi callback atau wadah yang dibuat terlambat.
document.addEventListener('DOMContentLoaded', function () {
  var tombol = document.querySelector('.tombol-terjemah');
  var menu = document.getElementById('menu-bahasa');
  if (!tombol || !menu) return;
  var pilihan = menu.querySelectorAll('[data-bahasa]');

  function bahasaAktif() {
    var m = document.cookie.match(/(?:^|;)\s*googtrans=\/id\/([^;]+)/);
    return m ? m[1] : 'id';
  }

  function tandaiAktif(kode) {
    pilihan.forEach(function (b) {
      b.classList.toggle('aktif', b.getAttribute('data-bahasa') === kode);
    });
  }

  function bukaMenu() {
    menu.classList.add('terbuka');
    tombol.setAttribute('aria-expanded', 'true');
  }
  function tutupMenu() {
    menu.classList.remove('terbuka');
    tombol.setAttribute('aria-expanded', 'false');
  }

  tombol.addEventListener('click', function (e) {
    e.stopPropagation();
    if (menu.classList.contains('terbuka')) { tutupMenu(); } else { bukaMenu(); }
  });
  document.addEventListener('click', function (e) {
    if (!menu.contains(e.target)) tutupMenu();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') tutupMenu();
  });

  function terapkanBahasa(kode) {
    tandaiAktif(kode);
    var combo = document.querySelector('.goog-te-combo');
    if (combo) {
      combo.value = kode;
      combo.dispatchEvent(new Event('change', { bubbles: true }));
      return;
    }
    document.cookie = 'googtrans=/id/' + kode + '; path=/';
    location.reload();
  }

  pilihan.forEach(function (b) {
    b.addEventListener('click', function () {
      tutupMenu();
      terapkanBahasa(b.getAttribute('data-bahasa'));
    });
  });

  tandaiAktif(bahasaAktif());
});
