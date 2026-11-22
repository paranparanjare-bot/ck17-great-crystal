document.addEventListener('DOMContentLoaded', function () {
  var tombol = document.querySelector('.tombol-menu');
  var situs = document.querySelector('.situs');
  if (!tombol || !situs) return;
  tombol.addEventListener('click', function () {
    var terbuka = situs.classList.toggle('menu-terbuka');
    tombol.setAttribute('aria-expanded', terbuka ? 'true' : 'false');
    tombol.setAttribute('aria-label', terbuka ? 'Tutup menu' : 'Buka menu');
  });
});
