document.addEventListener('DOMContentLoaded', function () {
  // Scroll-Reveal für Abschnitte
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Mobiles Menü (Hamburger)
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    // Menü schließen, sobald ein Link angeklickt wird
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Foto-Lightbox
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxCounter = document.getElementById('lightboxCounter');
  var lightboxClose = document.getElementById('lightboxClose');
  var lightboxPrev = document.getElementById('lightboxPrev');
  var lightboxNext = document.getElementById('lightboxNext');

  if (lightbox && typeof galleryImages !== 'undefined') {
    var currentImages = [];
    var currentIndex = 0;

    function showImage() {
      lightboxImg.src = currentImages[currentIndex];
      lightboxCounter.textContent = (currentIndex + 1) + ' / ' + currentImages.length;
    }
        var scrollPosition = 0;
    function openLightbox(galleryId, startIndex) {
      currentImages = galleryImages[galleryId];
      currentIndex = startIndex;
      showImage();
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      scrollPosition = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = '-' + scrollPosition + 'px';
      document.body.style.width = '100%';
    }
    function closeLightbox() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollPosition);
    }
    function nextImage() {
      currentIndex = (currentIndex + 1) % currentImages.length;
      showImage();
    }
    function prevImage() {
      currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
      showImage();
    }

    document.querySelectorAll('[data-gallery-id]').forEach(function (gallery) {
      var galleryId = gallery.getAttribute('data-gallery-id');
      gallery.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function (e) {
          e.preventDefault();
          openLightbox(galleryId, parseInt(link.getAttribute('data-lightbox-index'), 10));
        });
      });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', nextImage);
    lightboxPrev.addEventListener('click', prevImage);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    });

    // Swipe-Geste für Mobilgeräte
        var touchStartX = 0;
    lightbox.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    lightbox.addEventListener('touchmove', function (e) {
      e.preventDefault();
    }, { passive: false });
    lightbox.addEventListener('touchend', function (e) {
      var touchEndX = e.changedTouches[0].screenX;
      var diff = touchEndX - touchStartX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) { nextImage(); } else { prevImage(); }
      }
    }, { passive: true });
  }
    // Bilder vor einfachem Rechtsklick-Speichern und Wegziehen schützen
  document.addEventListener('contextmenu', function (e) {
    if (e.target.tagName === 'IMG') { e.preventDefault(); }
  });
  document.addEventListener('dragstart', function (e) {
    if (e.target.tagName === 'IMG') { e.preventDefault(); }
  });
   // Eule alle 60 Sekunden kurz auftauchen lassen, sobald man bei der Karte vorbeigescrollt ist
  var owl = document.querySelector('.owl-peek');
  if (owl && 'IntersectionObserver' in window) {
    function playOwl() {
      var src = owl.getAttribute('data-src');
      owl.style.opacity = '1';
      owl.src = '';
      setTimeout(function () { owl.src = src; }, 20);
      setTimeout(function () { owl.style.opacity = '0'; }, 3000);
    }
   var owlObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setTimeout(function () {
            playOwl();
            setInterval(playOwl, 30000);
          }, 3000);
          owlObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    owlObserver.observe(owl);
  }
});
