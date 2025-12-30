/* ===================================
   OralDental Clinic - JavaScript (FIXED)
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
  // -----------------------------------
  // Mobile Menu Toggle (SAFE)
  // -----------------------------------
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  if (mobileMenuBtn && navLinks) {
    const menuIcon = mobileMenuBtn.querySelector('.menu-icon');
    const closeIcon = mobileMenuBtn.querySelector('.close-icon');

    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      if (menuIcon) menuIcon.classList.toggle('hidden');
      if (closeIcon) closeIcon.classList.toggle('hidden');
    });

    // Close on nav click (mobile)
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        if (menuIcon) menuIcon.classList.remove('hidden');
        if (closeIcon) closeIcon.classList.add('hidden');
      });
    });
  }

  // -----------------------------------
  // Navbar Scroll Effect (SAFE)
  // -----------------------------------
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    });
  }

  // -----------------------------------
  // Scroll Animations (Fix: always reveal if observer fails)
  // -----------------------------------
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  // If no elements, skip
  if (animatedElements.length > 0) {
    // If IntersectionObserver not supported, show everything
    if (!('IntersectionObserver' in window)) {
      animatedElements.forEach((el) => el.classList.add('visible'));
    } else {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      animatedElements.forEach((el) => observer.observe(el));

      // EXTRA safety: if observer doesn't trigger for any reason, reveal after 1s
      setTimeout(() => {
        animatedElements.forEach((el) => el.classList.add('visible'));
      }, 1000);
    }
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    if (!id || id === '#') return;

    const target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();

    const header = document.querySelector('.header');
    const offset = header ? header.offsetHeight + 10 : 0;

    const top =
      target.getBoundingClientRect().top +
      window.pageYOffset -
      offset;

    window.scrollTo({
      top,
      behavior: 'smooth',
    });
  });
});


  // -----------------------------------
  // Appointment Form Submit (ONLY ONE METHOD - fetch)
  // -----------------------------------
  const form = document.getElementById('appointmentForm');
  const successBox = document.getElementById('formSuccess');

  if (form) {
    const dateInput = document.getElementById('date');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // IMPORTANT: make sure your form has action="appointment-submit.php"
      const url = form.getAttribute('action') || 'appointment-submit.php';

      try {
        const res = await fetch(url, {
          method: 'POST',
          body: new FormData(form),
        });

        // If your PHP doesn't return JSON, this will fail.
        const data = await res.json();

        if (data.ok) {
          form.reset();
          form.classList.add('hidden');
          if (successBox) successBox.classList.remove('hidden');

          // show form again after 5 sec
          setTimeout(() => {
            form.classList.remove('hidden');
            if (successBox) successBox.classList.add('hidden');
          }, 5000);
        } else {
          alert(data.message || 'Failed to submit appointment.');
        }
      } catch (err) {
        alert('Server/Network error. Also check: does appointment-submit.php return JSON?');
        console.error(err);
      }
    });
  }
});
