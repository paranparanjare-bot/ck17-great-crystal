document.addEventListener('DOMContentLoaded', function () {
  var tombol = document.querySelector('.tombol-menu');
  var situs = document.querySelector('.situs');
  if (!tombol || !situs) return;
  function tutup() {
    situs.classList.remove('menu-terbuka');
    tombol.setAttribute('aria-expanded', 'false');
    tombol.setAttribute('aria-label', 'Buka menu');
    tombol.textContent = '☰';
  }
  tombol.addEventListener('click', function (e) {
    e.stopPropagation();
    var terbuka = situs.classList.toggle('menu-terbuka');
    tombol.setAttribute('aria-expanded', terbuka ? 'true' : 'false');
    tombol.setAttribute('aria-label', terbuka ? 'Tutup menu' : 'Buka menu');
    tombol.textContent = terbuka ? '✕' : '☰';
  });
  situs.querySelectorAll('nav a').forEach(function (tautan) {
    tautan.addEventListener('click', tutup);
  });
  document.addEventListener('click', function (e) {
    if (!situs.contains(e.target)) tutup();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') tutup();
  });
});
