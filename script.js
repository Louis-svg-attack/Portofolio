/**
 * M. LOUIS STEVANO GUNAWAN — PORTFOLIO
 * High-End Interactive Architecture (Vanilla JS)
 * Features: Constellation Canvas • Magnetic Lerp Cursor • Staggered Reveals • Ripple Interactions
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ─── 1. CUSTOM MAGNETIC LERP CURSOR ───────────────────────────────────── */
  const cursorDot = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  if (cursorDot && cursorRing && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isMoving = false;
    let rafId = null;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isMoving) {
        isMoving = true;
        cursorDot.style.opacity = '1';
        cursorRing.style.opacity = '1';
        cursorDot.classList.remove('is-hidden');
        cursorRing.classList.remove('is-hidden');
      }

      // Dot follows cursor immediately
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      cursorDot.classList.add('is-hidden');
      cursorRing.classList.add('is-hidden');
      isMoving = false;
    });

    document.addEventListener('mouseenter', () => {
      cursorDot.classList.remove('is-hidden');
      cursorRing.classList.remove('is-hidden');
    });

    // Linear interpolation (lerp) loop for butter-smooth ring lag
    const lerp = (start, end, factor) => start + (end - start) * factor;

    const renderCursorRing = () => {
      if (isMoving) {
        ringX = lerp(ringX, mouseX, 0.16);
        ringY = lerp(ringY, mouseY, 0.16);
        cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(renderCursorRing);
    };
    rafId = requestAnimationFrame(renderCursorRing);

    // Magnetize & Expand Hover Interactions
    const hoverTargets = document.querySelectorAll('a, button, [role="button"], .hover-target, .bento-card, .certificate-card');

    hoverTargets.forEach(target => {
      target.addEventListener('mouseenter', () => {
        cursorRing.classList.add('is-hovering');
        cursorDot.classList.add('is-hovering');
      });

      target.addEventListener('mouseleave', () => {
        cursorRing.classList.remove('is-hovering');
        cursorDot.classList.remove('is-hovering');
      });
    });
  }

  /* ─── 2. INTERACTIVE CONSTELLATION CANVAS NETWORK ───────────────────────── */
  const canvas = document.getElementById('network-canvas');

  if (canvas && window.innerWidth > 768) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = 42;
    const maxDistance = 140;
    const mouseRadius = 180;
    const mouse = { x: -9999, y: -9999 };

    const resizeCanvas = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.radius = Math.random() * 1.5 + 1.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap boundaries
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Mouse proximity reaction
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouseRadius) {
          const force = (mouseRadius - dist) / mouseRadius;
          this.x += (dx / (dist || 1)) * force * 0.8;
          this.y += (dy / (dist || 1)) * force * 0.8;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 45, 85, 0.75)';
        ctx.fill();
      }
    }

    particles = Array.from({ length: particleCount }, () => new Particle());

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.35;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255, 45, 85, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }

        // Draw connections to mouse cursor when close
        const mdx = particles[i].x - mouse.x;
        const mdy = particles[i].y - mouse.y;
        const mDist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mDist < mouseRadius) {
          const mAlpha = (1 - mDist / mouseRadius) * 0.55;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(255, 45, 85, ${mAlpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    };

    const animateNetwork = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      drawConnections();
      requestAnimationFrame(animateNetwork);
    };

    animateNetwork();
  }

  /* ─── 3. SCROLL-TRIGGERED STAGGERED REVEALS ─────────────────────────────── */
  const revealItems = document.querySelectorAll('.reveal-item');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.1
  });

  revealItems.forEach(el => revealObserver.observe(el));

  /* ─── 4. BUTTON RIPPLE EFFECT ───────────────────────────────────────────── */
  const rippleButtons = document.querySelectorAll('.ripple-btn');

  rippleButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.classList.add('ripple-wave');

      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  /* ─── 5. MOBILE NAVIGATION DRAWER ───────────────────────────────────────── */
  const navToggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-btn');

  if (navToggle && mobileMenu) {
    const toggleMobileMenu = (forceState) => {
      const isOpen = forceState !== undefined ? forceState : !mobileMenu.classList.contains('open');
      navToggle.classList.toggle('active', isOpen);
      mobileMenu.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    navToggle.addEventListener('click', () => toggleMobileMenu());

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => toggleMobileMenu(false));
    });
  }

  /* ─── 6. ACTIVE NAV LINK HIGHLIGHT (SCROLL SPY) ─────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const updateActiveNav = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* ─── 7. CERTIFICATE LIGHTBOX MODAL ─────────────────────────────────────── */
  const certModal = document.getElementById('cert-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalClose = document.getElementById('modal-close');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalText = document.getElementById('modal-text');
  const modalIssuer = document.getElementById('modal-issuer');

  const certCards = document.querySelectorAll('.certificate-card');

  const openCertModal = (card) => {
    if (!certModal) return;

    const img = card.dataset.img || '';
    const title = card.dataset.title || '';
    const text = card.dataset.text || '';
    const issuer = card.dataset.issuer || '';

    modalImg.src = img;
    modalImg.alt = title;
    modalTitle.textContent = title;
    modalText.textContent = text;
    modalIssuer.textContent = issuer;

    certModal.classList.add('open');
    certModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeCertModal = () => {
    if (!certModal) return;
    certModal.classList.remove('open');
    certModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  certCards.forEach(card => {
    card.addEventListener('click', () => openCertModal(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openCertModal(card);
      }
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeCertModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeCertModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal && certModal.classList.contains('open')) {
      closeCertModal();
    }
  });

  /* ─── 8. SMOOTH SCROLL WITH STICKY HEADER COMPENSATION ─────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = 72;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

});
