/*!
 * Sphere Interior Studio — Animations Lite v2.0
 * ───────────────────────────────────────────────────────────────────────────
 * Зависимости: ТОЛЬКО GSAP core (~27 KB gzip). Всё остальное — нативный API.
 *
 * Подключить в <head> с атрибутом defer:
 *   <script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
 *   <script defer src="animations-lite.js"></script>
 *
 * Что использует GSAP (нельзя заменить нативно):
 *   — Hero cinematic entrance (сложный многошаговый timeline)
 *   — Custom cursor (ticker + per-frame lerp)
 *   — Magnetic buttons (mousemove delta + spring-возврат)
 *   — Timeline line scaleY (из .is-visible callback)
 *
 * Что заменено на нативные API:
 *   — Lenis          → CSS scroll-behavior + overscroll-behavior
 *   — ScrollTrigger  → IntersectionObserver (нулевой вес)
 *   — Section reveals → CSS transitions + класс .is-visible
 *   — Word stagger    → CSS --i + transition-delay
 *   — Card 3D tilt    → GSAP (оставлен — сложная mousemove математика)
 *   — Parallax        → scroll event + requestAnimationFrame
 * ───────────────────────────────────────────────────────────────────────────
 */

(function () {
  "use strict";

  /* ═══════════════════════════════════════════════════════════════════════════
     КОНФИГ
  ═══════════════════════════════════════════════════════════════════════════ */

  const CFG = {
    ease: {
      out:     "expo.out",
      inOut:   "expo.inOut",
      back:    "back.out(1.7)",
      elastic: "elastic.out(1, 0.4)",
    },
    particles: { desktop: 9, mobile: 4 },
    /* Порог IntersectionObserver: элемент считается видимым при X% в viewport */
    ioThreshold: 0.25,
  };

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch  = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const isMobile = () => window.innerWidth <= 768;

  function initLazyIframes() {
    document.querySelectorAll('.js-lazy-iframe[data-src]').forEach(iframe => {
      const io = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        iframe.src = iframe.dataset.src;
        io.disconnect();
      }, { rootMargin: '200px' });
      io.observe(iframe);
    });
  }
  /* ═══════════════════════════════════════════════════════════════════════════
     UTILS
  ═══════════════════════════════════════════════════════════════════════════ */

  /**
   * Разбивает текстовое содержимое элемента на span.word внутри span.word-wrap.
   * Устанавливает CSS-переменную --i для stagger-задержки.
   * @returns {HTMLElement[]} массив .word-элементов
   */
  function splitWords(el) {
    if (!el) return [];
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words
      .map(
        (w, i) =>
          `<span class="word-wrap"><span class="word" style="--i:${i}">${w}</span></span>`
      )
      .join(" ");
    return Array.from(el.querySelectorAll(".word"));
  }

  /**
   * Создаёт один IntersectionObserver с заданным порогом.
   * При пересечении добавляет .is-visible и отписывается (анимация — один раз).
   */
  function onVisible(elements, callback, threshold = CFG.ioThreshold) {
    const targets = Array.isArray(elements) ? elements : [elements];
    if (!targets.length) return;

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          const target = entry.target;

// Включаем GPU-оптимизацию только перед анимацией
          target.style.willChange = "transform, opacity";

          callback(target);

// После завершения transition убираем will-change
          target.addEventListener(
            "transitionend",
            () => {
              target.style.willChange = "";
            },
            { once: true }
          );

          io.unobserve(target);
        });
      },
      { threshold, rootMargin: "0px 0px -120px 0px" }
    );

    targets.forEach(el => io.observe(el));
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     1. HERO — CINEMATIC ENTRANCE (GSAP)
     Используем GSAP: нужен точный многошаговый timeline с кастомными easing
  ═══════════════════════════════════════════════════════════════════════════ */

  function initHeroEntrance() {
    const overlay    = document.querySelector(".hero__overlay");
    const navLinks   = document.querySelectorAll(".hero__nav-link");
    const logo       = document.querySelector(".hero__logo");
    const titleEl    = document.querySelector(".hero__title");
    const subtitle   = document.querySelector(".hero__subtitle");
    const button     = document.querySelector(".hero__button");
    const arrow      = document.querySelector(".hero__arrow");

    if (!titleEl) return;

    if (reduced) {
      // При reduced-motion просто сбрасываем opacity
      document.querySelectorAll(
        ".hero__nav-link, .hero__logo, .hero__subtitle, .hero__button, .hero__arrow"
      ).forEach(el => (el.style.opacity = "1"));
      return;
    }

    const titleWords = splitWords(titleEl);
    gsap.set(titleWords, { y: "110%", opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: CFG.ease.out }, delay: 0.1 });

    // Оверлей: кинематографичный «вдох»
    tl.fromTo(overlay,
      { opacity: 0.9 },
      { opacity: 0.45, duration: 2.2, ease: "power3.out" },
      0
    );

    // Логотип: буквы «разъезжаются» из узкого состояния
    tl.fromTo(logo,
      { opacity: 0, letterSpacing: "20px" },
      { opacity: 1, letterSpacing: "5px", duration: 1.3 },
      0.25
    );

    // Nav: stagger сверху
    tl.fromTo(navLinks,
      { y: -22, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, stagger: 0.07 },
      0.4
    );

    // Заголовок: пословный reveal снизу (overflow:hidden у .word-wrap)
    tl.fromTo(titleWords,
      { y: "110%", opacity: 0 },
      { y: "0%", opacity: 1, stagger: 0.065, duration: 1.1 },
      0.75
    );

    // Подзаголовок
    tl.fromTo(subtitle,
      { y: 34, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      1.15
    );

    // CTA: лёгкий «прыжок»
    tl.fromTo(button,
      { y: 22, opacity: 0, scale: 0.88 },
      { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: "back.out(1.6)" },
      1.4
    );

    // Стрелка + бесконечный bounce
    tl.fromTo(arrow,
      { y: -10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, onComplete() {
          gsap.to(arrow, {
            y: 12, duration: 1.1,
            ease: "sine.inOut", repeat: -1, yoyo: true,
          });
        },
      },
      1.65
    );
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     2. HERO — PARALLAX (нативный scroll + rAF)
     Заменяем ScrollTrigger scrub на обычный scroll-listener с throttle
  ═══════════════════════════════════════════════════════════════════════════ */

  function initHeroParallax() {
    if (reduced || isMobile()) return;

    const hero    = document.querySelector(".hero");
    const content = document.querySelector(".hero__content");
    const overlay = document.querySelector(".hero__overlay");
    if (!hero) return;

    let ticking = false;

    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const vh      = window.innerHeight;

        // Parallax stays present, but restrained enough to protect readability
        if (scrollY < vh * 1.5) {
          hero.style.backgroundPositionY = `calc(50% + ${scrollY * 0.16}px)`;
        }

        // Hero content keeps readability longer and only fades subtly
        if (content && scrollY < vh) {
          const progress = scrollY / vh;
          const fadeProgress = Math.max(0, progress - 0.12) / 0.88;
          const opacity  = Math.max(0.8, 1 - fadeProgress * 0.2);
          const y        = fadeProgress * -34;
          content.style.opacity   = opacity;
          content.style.transform = `translateY(${y}px)`;

          if (overlay) {
            overlay.style.opacity = `${Math.min(1, 1 + fadeProgress * 0.06)}`;
          }
        }

        ticking = false;
      });
    }, { passive: true });
  }


  /* ═══════════════════════════════════════════════════════════════════════════
     4. CUSTOM CURSOR (GSAP ticker — нельзя заменить нативно)
  ═══════════════════════════════════════════════════════════════════════════ */

  function initCustomCursor() {
    if (isMobile() || reduced || isTouch) return;

    const cursor = document.createElement("div");
    cursor.className = "c-cursor";
    cursor.innerHTML = `
      <div class="c-cursor__dot"></div>
      <div class="c-cursor__ring"></div>
    `;
    document.body.appendChild(cursor);

    const dot  = cursor.querySelector(".c-cursor__dot");
    const ring = cursor.querySelector(".c-cursor__ring");

    let mX = innerWidth / 2, mY = innerHeight / 2;
    let rX = mX, rY = mY;
    let needsUpdate = true;

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

    // Dot: мгновенно
    window.addEventListener("mousemove", e => {
      mX = e.clientX;
      mY = e.clientY;

      needsUpdate = true;

      gsap.to(dot, {
        x: mX,
        y: mY,
        duration: 0.04,
        ease: "none",
        overwrite: true
      });
    });

    // Ring: с инерцией через ticker
    gsap.ticker.add(() => {
      if (!needsUpdate) return;

      const newX = rX + (mX - rX) * .45;
      const newY = rY + (mY - rY) * .45;

      // Когда курсор почти догнал мышь — останавливаем ticker updates
      if (
        Math.abs(newX - rX) < 0.01 &&
        Math.abs(newY - rY) < 0.01
      ) {
        needsUpdate = false;
      }

      rX = newX;
      rY = newY;

      gsap.set(ring, {
        x: rX,
        y: rY
      });
    });

    // Hover-состояния на интерактивных элементах
    document.querySelectorAll([
      // Навигация
      '.hero__nav-link',
      '.hero__logo',
      '.hero__button',
      '.hero__arrow',

      // Карточки услуг
      '.service-card',
      '.service-card__btn',

      // Карточки преимуществ
      '.pricing-card',
      '.pricing-card__button',
      '.results__card',

      // Ссылка IMC Computers
      '.about__link',

      // Конфигуратор
      '.cfg-option__card',
      '.cfg-btn--next',
      '.cfg-btn--back',
      '.cfg-result__btn',
      '.cfg-reset',

      // Модалка
      '.cfg-modal__close',
      '.contacts__submit',

      // Контакты
      '.contacts__link',
      '.contacts__social',
      '.contacts__map-route',
      '.contacts__submit',
      '#modalSubmit',
    ].join(', ')).forEach(el => {
      el.addEventListener('mouseenter', () => {
        gsap.to(ring, { scale: 1.9, borderColor: 'var(--color-accent)', duration: 0.35, ease: CFG.ease.out });
        gsap.to(dot,  { scale: 0.4, duration: 0.25 });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(ring, { scale: 1, borderColor: 'rgba(0,0,0,0.3)', duration: 0.4, ease: CFG.ease.out });
        gsap.to(dot,  { scale: 1, duration: 0.3 });
      });
    });

    document.addEventListener("mouseleave", () => gsap.to(cursor, { opacity: 0, duration: 0.3 }));
    document.addEventListener("mouseenter", () => gsap.to(cursor, { opacity: 1, duration: 0.3 }));
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     5. SERVICES — IntersectionObserver + CSS .is-visible
  ═══════════════════════════════════════════════════════════════════════════ */

  function initServicesReveal() {
    const section  = document.querySelector(".services");
    const header   = section?.querySelector(".services__header");
    const grid     = section?.querySelector(".services__grid");
    const cards    = section?.querySelectorAll(".service-card");

    if (!section) return;

    // Нумеруем карточки для CSS stagger через --i
    cards?.forEach((card, i) => card.style.setProperty("--i", i));

    // Заголовок + подзаголовок
    if (header) {
      splitWords(header.querySelector(".services__title"));
      onVisible(header, el => el.classList.add("is-visible"));
    }

    // Сетка карточек
    if (grid) {
      onVisible(grid, el => el.classList.add("is-visible"), 0.1);
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     6. ABOUT — IntersectionObserver + CSS clip-path
  ═══════════════════════════════════════════════════════════════════════════ */

  function initAboutReveal() {
    const section = document.querySelector(".about");
    if (!section) return;

    const titleEl  = section.querySelector(".about__title");
    const visual   = section.querySelector(".about__visual");
    const content  = section.querySelector(".about__content");

    section.querySelectorAll(".about__metric").forEach((item, i) =>
      item.style.setProperty("--i", i)
    );

    if (titleEl) {
      splitWords(titleEl);
      onVisible(titleEl.closest(".about__header") || titleEl, el =>
        el.classList.add("is-visible")
      );
    }

    if (visual)   onVisible(visual,   el => el.classList.add("is-visible"), 0.1);
    if (content)  onVisible(content,  el => el.classList.add("is-visible"), 0.1);
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     7. Advantages — IntersectionObserver + CSS stagger
  ═══════════════════════════════════════════════════════════════════════════ */

  function initAdvantagesReveal() {


    const section = document.querySelector(".advantages");

    if (!section) return;


    const spine = section.querySelector(".advantages__spine");

    const layers = section.querySelectorAll(".advantages__layer");


    layers.forEach((layer,i)=>{

      layer.style.setProperty("--i", i);
      section.querySelectorAll(".advantages__layer")
        .forEach((item, i) =>
          item.style.setProperty("--i", i)
        );

      onVisible(
        layer,
        el => el.classList.add("is-visible"),
        0.15
      );

    });


    if(spine){

      onVisible(
        spine,
        el=>el.classList.add("is-visible"),
        0.05
      );

    }

  }

  /* ═══════════════════════════════════════════════════════════════════════════
     8. WORK TIMELINE — линия через GSAP (из IO callback), items через CSS
  ═══════════════════════════════════════════════════════════════════════════ */

  function initWorkReveal() {
    const section  = document.querySelector(".work");
    if (!section) return;

    const titleEl  = section.querySelector(".work__title");
    const timeline = section.querySelector(".work__timeline");
    const items = section.querySelectorAll(".work__step");

    // Заголовок
    if (titleEl) {
      splitWords(titleEl);
      onVisible(
        titleEl.closest(".work__header") || titleEl,
        el => el.classList.add("is-visible"),
        0.2
      );
    }

    // Линия: DOM-элемент + GSAP анимация при появлении в viewport
    if (timeline) {
      const lineEl = document.createElement("div");
      lineEl.className = "c-timeline-line";
      timeline.insertBefore(lineEl, timeline.firstChild);

      onVisible(timeline, () => {
        gsap.to(lineEl, {
          scaleY: 1, duration: 1.6,
          ease: "expo.out", overwrite: true,
        });
      }, 0.05);
    }

    // Элементы: CSS transition + --i для stagger
    items.forEach((item, i) => {
      item.style.setProperty("--i", i);
      onVisible(item, el => el.classList.add("is-visible"), 0.15);
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     9. CONTACTS — IntersectionObserver + CSS
  ═══════════════════════════════════════════════════════════════════════════ */

  function initContactsReveal() {
    const section = document.querySelector(".contacts");
    if (!section) return;

    const titleEl = section.querySelector(".contacts__title");
    const info    = section.querySelector(".contacts__info");
    const map     = section.querySelector(".contacts__map");

    if (titleEl) {
      splitWords(titleEl);
      // Заголовок наблюдается отдельно — срабатывает чуть раньше
      onVisible(titleEl, el => el.closest(".contacts__info")?.classList.add("is-visible-title") || el.classList.add("is-visible"), 0.5);
    }

    // Вся левая колонка (links, address, socials)
    if (info) {
      section.querySelectorAll(".contacts__social").forEach((el, i) =>
        el.style.setProperty("--i", i)
      );
      onVisible(info, el => el.classList.add("is-visible"), 0.1);
    }

    // Правая колонка (карта)
    if (map) {
      onVisible(section, el => el.classList.add("is-visible"), 0.05);
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     10. SECTION FADE — IntersectionObserver + CSS opacity
  ═══════════════════════════════════════════════════════════════════════════ */

  function initSectionFades() {
    const sections = document.querySelectorAll("section:not(.hero)");
    // Используем низкий порог — достаточно чтобы секция чуть показалась
    onVisible(Array.from(sections), el => el.classList.add("is-visible"), 0.04);
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     11. MAGNETIC BUTTONS (GSAP — нельзя заменить нативно)
  ═══════════════════════════════════════════════════════════════════════════ */

  function initMagneticButtons() {
    if (isMobile() || reduced || isTouch) return;

    document.querySelectorAll(".hero__button, .pricing-card__button").forEach(btn => {
      btn.addEventListener("mousemove", e => {
        const r  = btn.getBoundingClientRect();
        const dX = (e.clientX - (r.left + r.width  / 2)) * 0.38;
        const dY = (e.clientY - (r.top  + r.height / 2)) * 0.38;
        gsap.to(btn, { x: dX, y: dY, duration: 0.45, ease: "power2.out", overwrite: true });
      });

      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.75, ease: CFG.ease.elastic, overwrite: true });
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     13. ЯКОРНЫЕ ССЫЛКИ — smooth scroll без Lenis
  ═══════════════════════════════════════════════════════════════════════════ */

  function initAnchorLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener("click", e => {
        const target = document.querySelector(a.getAttribute("href"));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }


  /* ═══════════════════════════════════════════════════════════════════════════
     configurator
  ═══════════════════════════════════════════════════════════════════════════ */

  function initConfiguratorReveal() {

    const section = document.querySelector(".configurator");
    if (!section) return;


    const header = section.querySelector(".configurator__header");
    const stage = section.querySelector(".configurator__stage");
    const options = section.querySelectorAll(".configurator__option");


    if (header) {
      onVisible(
        section,
        () => section.classList.add("is-visible"),
        0.6
      );
    }


    options.forEach((option, i) => {
      option.style.setProperty("--i", i);
    });

  }
  /* ═══════════════════════════════════════════════════════════════════════════
     INIT
  ═══════════════════════════════════════════════════════════════════════════ */
  function init() {
    // Помечаем body: CSS initial states активируются
    document.body.classList.add("js-ready");

    initHeroEntrance();
    initHeroParallax();
    initCustomCursor();
    initServicesReveal();
    initAboutReveal();
    initWorkReveal();
    initContactsReveal();
    initSectionFades();
    initMagneticButtons();
    initAnchorLinks();
    initLazyIframes();
    initAdvantagesReveal();
    initConfiguratorReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
