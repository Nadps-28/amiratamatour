/**
 * ============================================================================
 * AMIRATAMA TOUR AND ORGANIZER — JAVASCRIPT
 * Dynamic Sticky Navbar, Active Nav Highlighter, Hero Carousel, Lightbox & Mobile Menu
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", function () {
  
  // --------------------------------------------------------------------------
  // 1. DYNAMIC STICKY NAVBAR (Transparent on top, Solid white on scroll)
  // --------------------------------------------------------------------------
  const header = document.getElementById("main-header");
  const logoBadge = document.getElementById("logo-badge");
  const brandTitle = document.getElementById("nav-brand-title");
  const brandSubtitle = document.getElementById("nav-brand-subtitle");
  const mobileBtn = document.getElementById("mobile-menu-btn");
  const navContainer = document.getElementById("desktop-nav-container");

  function updateNavbar() {
    const scrollY = window.scrollY || window.pageYOffset;
    if (scrollY > 60) {
      // Scrolled state: Solid White
      header.classList.remove("is-transparent", "bg-transparent", "py-5");
      header.classList.add("is-scrolled", "bg-white/95", "backdrop-blur-md", "shadow-nav", "border-b", "border-slate-100", "py-3.5");

      logoBadge.classList.remove("bg-white/10", "border-white/20");
      logoBadge.classList.add("bg-navy-50", "border-slate-200");

      brandTitle.classList.remove("text-white");
      brandTitle.classList.add("text-navy");

      brandSubtitle.classList.remove("text-slate-300");
      brandSubtitle.classList.add("text-slate-500");

      mobileBtn.classList.remove("text-white");
      mobileBtn.classList.add("text-navy");

      if (navContainer) {
        navContainer.classList.add("bg-slate-50/80", "border", "border-slate-200/60");
      }
    } else {
      // Top state: Pure Transparent over Dark Cinematic Hero
      header.classList.remove("is-scrolled", "bg-white/95", "backdrop-blur-md", "shadow-nav", "border-b", "border-slate-100", "py-3.5");
      header.classList.add("is-transparent", "bg-transparent", "py-5");

      logoBadge.classList.remove("bg-navy-50", "border-slate-200");
      logoBadge.classList.add("bg-white/10", "border-white/20");

      brandTitle.classList.remove("text-navy");
      brandTitle.classList.add("text-white");

      brandSubtitle.classList.remove("text-slate-500");
      brandSubtitle.classList.add("text-slate-300");

      mobileBtn.classList.remove("text-navy");
      mobileBtn.classList.add("text-white");

      if (navContainer) {
        navContainer.classList.remove("bg-slate-50/80", "border", "border-slate-200/60");
      }
    }
  }

  window.addEventListener("scroll", updateNavbar, { passive: true });
  updateNavbar();


  // --------------------------------------------------------------------------
  // 2. ACTIVE NAVIGATION HIGHLIGHTER (ScrollSpy)
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

  function setActiveNavLink() {
    const scrollY = window.scrollY || window.pageYOffset;
    const windowHeight = window.innerHeight;
    let currentSectionId = "";

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute("id");
      }
    });

    // Fallback for page top
    if (scrollY < 120 && sections.length > 0) {
      currentSectionId = sections[0].getAttribute("id");
    }

    // Update Desktop Nav Links
    navLinks.forEach(link => {
      const targetId = link.getAttribute("href").replace("#", "");
      if (targetId === currentSectionId) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
      }
    });

    // Update Mobile Nav Links
    mobileNavLinks.forEach(link => {
      const targetId = link.getAttribute("href").replace("#", "");
      if (targetId === currentSectionId) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  window.addEventListener("scroll", setActiveNavLink, { passive: true });
  setActiveNavLink();


  // --------------------------------------------------------------------------
  // 3. MOBILE NAVIGATION DRAWER
  // --------------------------------------------------------------------------
  const drawer = document.getElementById("mobile-drawer");
  const drawerPanel = document.getElementById("mobile-panel");
  const drawerBackdrop = document.getElementById("mobile-backdrop");
  const mobileCloseBtn = document.getElementById("mobile-close-btn");

  function openMobileMenu() {
    drawer.classList.remove("pointer-events-none", "opacity-0");
    drawer.classList.add("pointer-events-auto", "opacity-100");
    drawer.setAttribute("aria-hidden", "false");
    mobileBtn.setAttribute("aria-expanded", "true");
    drawerPanel.classList.remove("translate-x-full");
    drawerPanel.classList.add("translate-x-0");
    document.body.classList.add("overflow-hidden");
  }

  function closeMobileMenu() {
    drawerPanel.classList.remove("translate-x-0");
    drawerPanel.classList.add("translate-x-full");
    drawer.classList.remove("opacity-100");
    drawer.classList.add("opacity-0");
    drawer.setAttribute("aria-hidden", "true");
    mobileBtn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("overflow-hidden");
    setTimeout(() => {
      drawer.classList.remove("pointer-events-auto");
      drawer.classList.add("pointer-events-none");
    }, 300);
  }

  mobileBtn.addEventListener("click", openMobileMenu);
  mobileCloseBtn.addEventListener("click", closeMobileMenu);
  drawerBackdrop.addEventListener("click", closeMobileMenu);
  mobileNavLinks.forEach(link => link.addEventListener("click", closeMobileMenu));

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (drawer.getAttribute("aria-hidden") === "false") {
        closeMobileMenu();
      }
      if (!lightbox.classList.contains("hidden")) {
        closeLightbox();
      }
    }
  });


  // --------------------------------------------------------------------------
  // 4. HERO BACKGROUND CAROUSEL (Crossfade + Ken Burns + Progress Dots)
  // --------------------------------------------------------------------------
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".carousel-dot");
  const captionElem = document.getElementById("carousel-caption");
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");

  const slideCaptions = [
    "Armada Pariwisata Eksekutif Jawa Tengah & Nusantara",
    "Study Tour Kampus & Sekolah di Candi Prambanan",
    "Pesona Matahari Terbit Bromo & Wisata Domestik",
    "Corporate Gathering & Outbound Team Building"
  ];

  let currentSlide = 0;
  let carouselInterval = null;
  const slideDuration = 6000;

  function goToSlide(index) {
    if (index === currentSlide) return;

    // Reset previous slide
    const prevImg = slides[currentSlide].querySelector(".hero-img");
    slides[currentSlide].classList.remove("opacity-100");
    slides[currentSlide].classList.add("opacity-0");
    if (prevImg) {
      prevImg.classList.remove("kenburns-active");
      prevImg.classList.add("kenburns-reset");
    }

    // Activate new slide
    currentSlide = (index + slides.length) % slides.length;
    const nextImg = slides[currentSlide].querySelector(".hero-img");
    slides[currentSlide].classList.remove("opacity-0");
    slides[currentSlide].classList.add("opacity-100");
    if (nextImg) {
      nextImg.classList.remove("kenburns-reset");
      nextImg.classList.add("kenburns-active");
    }

    // Update Dots
    dots.forEach((dot, idx) => {
      if (idx === currentSlide) {
        dot.classList.remove("w-2", "bg-white/40");
        dot.classList.add("w-8", "bg-orange");
        dot.setAttribute("aria-selected", "true");
      } else {
        dot.classList.remove("w-8", "bg-orange");
        dot.classList.add("w-2", "bg-white/40");
        dot.setAttribute("aria-selected", "false");
      }
    });

    // Update Caption
    if (captionElem && slideCaptions[currentSlide]) {
      captionElem.textContent = slideCaptions[currentSlide];
    }
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  function startCarousel() {
    stopCarousel();
    carouselInterval = setInterval(nextSlide, slideDuration);
  }

  function stopCarousel() {
    if (carouselInterval) clearInterval(carouselInterval);
  }

  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      const target = parseInt(dot.getAttribute("data-slide"), 10);
      goToSlide(target);
      startCarousel();
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      startCarousel();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      startCarousel();
    });
  }

  startCarousel();


  // --------------------------------------------------------------------------
  // 5. PARALLAX EFFECT FOR SECOND CINEMATIC SECTION
  // --------------------------------------------------------------------------
  const parallaxBg = document.getElementById("parallax-bg");
  let isMobile = window.innerWidth < 768;

  window.addEventListener("resize", () => {
    isMobile = window.innerWidth < 768;
  });

  window.addEventListener("scroll", function () {
    if (isMobile) return;

    if (parallaxBg) {
      const rect = parallaxBg.parentElement.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = (window.innerHeight - rect.top) * 0.14;
        parallaxBg.style.transform = `translateY(${offset}px)`;
      }
    }
  }, { passive: true });


  // --------------------------------------------------------------------------
  // 6. SCROLL REVEAL (IntersectionObserver)
  // --------------------------------------------------------------------------
  const revealItems = document.querySelectorAll(".reveal-item");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    });

    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("is-revealed"));
  }


  // --------------------------------------------------------------------------
  // 7. ACCESSIBLE GALLERY LIGHTBOX
  // --------------------------------------------------------------------------
  const galleryData = [
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAj-3GDx2gedFl1YlgAS7K_l1LpHUEFYInxiExKq2aNpW4vQx3k5jJi0yV-KHjiPbxpWXlEDCdbt5parl5GqtTwO0e0ujagx3DlY1m7yiHqP6vASC7k-mGQ4aMk5FC0fS23MAlTGYostMN-cyKOM490ENPGWBT6Fkud8TDP-6ag4E3w3RUhJP536_DhizZdvpqPGsOGtdIl3h1u-q39TIXG6BmJegHKwP-wGpg9DKY",
      caption: "Study Tour Kampus: KKL & Edukasi Budaya Candi Prambanan"
    },
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJlpC3Zps02cmTlRBtBtZAm51mh6UtXCDdVUjAnaR5ExRdRqx3xtWjRuHnKn5kQUxUnrYyv2kk42QpUE_-jxLFKqzvFXqOrksnsV0aFr0WWtFMUD3LddXPm8WhguAKuTrbFXBIaqtDOxwGtW8DUVS2sdgG1N2l-Fb4ConxYiVN8xGQlFn2gpuZaamqTORKyV3qBIFw0JXMy1yoYmTE2xPHMWrr6e-KaKXdocdER1w",
      caption: "Outbound & Leadership: Team Building di Alam Terbuka"
    },
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIL1pbUjjQuj9GsxGA13twgqK2Hl62INVlrX_KPxWkiHnQN1vc74l9KdQj5Okq_Sukfg7uvXt4c3ES-FMcTUHKTmVZNpTXuUwZCVEEw1sIPneGksXbZ6Fo3VGnY9bb-H5CRGWfAkFxnO6NAKsdtUrx8kiZD_CbPsE6FEX2Keub77I-n5nWFWM4tkCOA-tBTRSVQDM_6jbB0fTdf-cQBhcslC07VdhaqePRYK9cBAc",
      caption: "Wisata Ziarah: Kunjungan Religi Masjid Bersejarah"
    },
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC49P9wmnJux3wbIkhowz-vaVj159tKaIOkdRAKWZ7Ss9hVhsOpyXWi7hWD3tICoXMHw14tP0la-4unOgQGnkWpEtEK_c7tEFUZwQXLhW48e07MLrnaWxAL4_Ae7n7-rSjatb-NkqKkkBSz9GeYFK6QP87SCDKRqBITXbn29VjKwdJZsLDm0e2GV1gWpEZ3COSL6LTNsDV2jUjRJW9ooUFa2SQHf2Tog6vkoMUw-h8",
      caption: "Executive Gathering: Kebersamaan Rombongan Perusahaan di Panorama Pegunungan"
    }
  ];

  const lightbox = document.getElementById("gallery-lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxCounter = document.getElementById("lightbox-counter");
  const lightboxCloseBtn = document.getElementById("lightbox-close");
  const lightboxPrevBtn = document.getElementById("lightbox-prev");
  const lightboxNextBtn = document.getElementById("lightbox-next");

  let currentLightboxIndex = 0;

  window.openLightbox = function (index) {
    currentLightboxIndex = index;
    updateLightboxContent();
    lightbox.classList.remove("hidden");
    setTimeout(() => {
      lightbox.classList.remove("opacity-0");
      lightbox.classList.add("opacity-100");
    }, 10);
    document.body.classList.add("overflow-hidden");
  };

  function updateLightboxContent() {
    const item = galleryData[currentLightboxIndex];
    lightboxImg.src = item.src;
    lightboxImg.alt = item.caption;
    lightboxCaption.textContent = item.caption;
    lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${galleryData.length}`;
  }

  function closeLightbox() {
    lightbox.classList.remove("opacity-100");
    lightbox.classList.add("opacity-0");
    setTimeout(() => {
      lightbox.classList.add("hidden");
      lightboxImg.src = "";
      document.body.classList.remove("overflow-hidden");
    }, 300);
  }

  function nextLightbox() {
    currentLightboxIndex = (currentLightboxIndex + 1) % galleryData.length;
    updateLightboxContent();
  }

  function prevLightbox() {
    currentLightboxIndex = (currentLightboxIndex - 1 + galleryData.length) % galleryData.length;
    updateLightboxContent();
  }

  lightboxCloseBtn.addEventListener("click", closeLightbox);
  lightboxNextBtn.addEventListener("click", nextLightbox);
  lightboxPrevBtn.addEventListener("click", prevLightbox);

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox || e.target.classList.contains("max-w-5xl")) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("hidden")) {
      if (e.key === "ArrowRight") nextLightbox();
      if (e.key === "ArrowLeft") prevLightbox();
    }
  });


  // --------------------------------------------------------------------------
  // 8. SECTION PAKET WISATA — DATA & INTERACTION MANAGEMENT
  // --------------------------------------------------------------------------
  const WA_NUMBER = "6282220503695";

  // Category Facilities (Strictly separated per category)
  const FASILITAS_DATA = {
    jogjakarta: [
      "Welcoming snack + air mineral 600 ml",
      "Makan 2x",
      "P3K ringan",
      "Bus standar pariwisata",
      "Dokumentasi dan MMT kegiatan",
      "Doorprize",
      "Tol, parkir, tips crew",
      "Tiket masuk"
    ],
    bandung: [
      "Welcoming snack + air mineral 600 ml",
      "Makan 3x",
      "P3K ringan",
      "Bus standar pariwisata",
      "Dokumentasi dan MMT kegiatan",
      "Doorprize",
      "Tol, parkir, tips crew",
      "Tiket masuk"
    ],
    bali: [
      "Welcoming snack + air mineral 600 ml",
      "Makan 12x",
      "P3K ringan",
      "Bus standar pariwisata",
      "Dokumentasi",
      "Doorprize",
      "Tol, parkir, tips crew",
      "MMT kegiatan",
      "Penyeberangan PP"
    ],
    bromo: [
      "Welcoming snack + air mineral 600 ml",
      "Makan 3x",
      "P3K ringan",
      "Bus standar pariwisata",
      "Dokumentasi dan MMT kegiatan",
      "Doorprize",
      "Tol, parkir, tips crew",
      "Tiket masuk"
    ],
    malang: [
      "Welcoming snack + air mineral 600 ml",
      "Makan 3x",
      "P3K ringan",
      "Bus standar pariwisata",
      "Dokumentasi dan MMT kegiatan",
      "Doorprize",
      "Tol, parkir, tips crew",
      "Tiket masuk"
    ]
  };

  // 15 Travel Packages Data
  const PAKET_DATA = [
    // --- A. JOGJAKARTA ---
    {
      id: "jogja-1",
      category: "jogjakarta",
      categoryName: "Jogjakarta",
      packageName: "Paket 1",
      priceDisplay: "Rp323.500",
      priceUnit: "/orang",
      priceWa: "Rp323.500",
      destinations: ["Snorkling Sadranan", "Tebing Breksi", "Malioboro"],
      image: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "jogja-2",
      category: "jogjakarta",
      categoryName: "Jogjakarta",
      packageName: "Paket 2",
      priceDisplay: "Rp305.900",
      priceUnit: "/orang",
      priceWa: "Rp305.900",
      destinations: ["Pantai Gunkid", "Heha Sky View", "Malioboro"],
      image: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "jogja-3",
      category: "jogjakarta",
      categoryName: "Jogjakarta",
      packageName: "Paket 3",
      priceDisplay: "Rp341.500",
      priceUnit: "/orang",
      priceWa: "Rp341.500",
      destinations: ["Lava Tour Jeep Merapi", "Heha Sky View", "Malioboro"],
      image: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80"
    },

    // --- B. BANDUNG ---
    {
      id: "bandung-1",
      category: "bandung",
      categoryName: "Bandung",
      packageName: "Paket 1",
      priceDisplay: "Rp549.500",
      priceUnit: "/orang",
      priceWa: "Rp549.500",
      destinations: ["Tangkuban Parahu", "Floating Market", "Farm House"],
      image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "bandung-2",
      category: "bandung",
      categoryName: "Bandung",
      packageName: "Paket 2",
      priceDisplay: "Rp609.000",
      priceUnit: "/orang",
      priceWa: "Rp609.000",
      destinations: ["Kawah Putih", "Saung Angklung Udjo", "Cibaduyut"],
      image: "https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "bandung-3",
      category: "bandung",
      categoryName: "Bandung",
      packageName: "Paket 3",
      priceDisplay: "Rp599.000",
      priceUnit: "/orang",
      priceWa: "Rp599.000",
      destinations: ["Tangkuban Parahu", "Great Asia Afrika", "Oleh-oleh"],
      image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80"
    },

    // --- C. PULAU BALI ---
    {
      id: "bali-1",
      category: "bali",
      categoryName: "Pulau Bali",
      packageName: "Paket 1 — Nusa Penida",
      priceDisplay: "Rp1.980.000",
      priceUnit: "/orang",
      priceWa: "Rp1.980.000",
      destinations: ["Angel Billabong", "Broken Beach", "Kelingking Beach"],
      image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "bali-2",
      category: "bali",
      categoryName: "Pulau Bali",
      packageName: "Paket 2 — 3D2N Bintang 4",
      priceDisplay: "Rp1.633.000",
      priceUnit: "/orang",
      priceWa: "Rp1.633.000",
      destinations: ["Tanah Lot", "Pura Ulun Danu Bedugul", "Joger", "Pantai Pandawa"],
      image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "bali-3",
      category: "bali",
      categoryName: "Pulau Bali",
      packageName: "Paket 3 — 3D2N Bintang 3",
      priceDisplay: "Rp1.490.000",
      priceUnit: "/orang",
      priceWa: "Rp1.490.000",
      destinations: ["Pantai Melasti", "Tari Barong", "Oleh-oleh Krisna"],
      image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=800&q=80"
    },

    // --- D. BROMO++ ---
    {
      id: "bromo-1",
      category: "bromo",
      categoryName: "Bromo++",
      packageName: "Paket 1",
      priceDisplay: "Rp654.500",
      priceUnit: "/orang",
      priceWa: "Rp654.500",
      destinations: ["Wisata Jeep Bromo"],
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "bromo-2",
      category: "bromo",
      categoryName: "Bromo++",
      packageName: "Paket 2",
      priceDisplay: "Rp786.500",
      priceUnit: "/orang",
      priceWa: "Rp786.500",
      destinations: ["Wisata Jeep Bromo", "BNS"],
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1BU163i8SMyd76ZjdhFd_mhrGg0Jme5nNKjdjOfIp_Ctq1f-ROsqe5o4Omkbg52f3vOPBw7_8LUNdlN_cQzoNhRZhANXIJAPVU9GWYOi5cNSx_qluYjPnJCaAg-eUGMQ638IsE7ga20vUSTCvu-lrxamk2BnO1jgbZwuwss9_zvxp0UWDNpCrTZ6PoL5rVp8alQURjLlTf2iQ1L2J1U5WccT9ut0qoWCn2_1a8Xs"
    },
    {
      id: "bromo-3",
      category: "bromo",
      categoryName: "Bromo++",
      packageName: "Paket 3",
      priceDisplay: "Hubungi Kami",
      priceUnit: "(Perlu Konfirmasi)",
      priceWa: "Perlu Konfirmasi",
      note: "Harga pada poster Rp768.9000 (menunggu konfirmasi)",
      destinations: ["Wisata Jeep Bromo", "Rafting Probolinggo"],
      image: "https://images.unsplash.com/photo-1530866495561-507c9faab2ed?auto=format&fit=crop&w=800&q=80"
    },

    // --- E. AREMA MALANG ---
    {
      id: "malang-1",
      category: "malang",
      categoryName: "Arema Malang",
      packageName: "Paket 1",
      priceDisplay: "Rp609.000",
      priceUnit: "/orang",
      priceWa: "Rp609.000",
      destinations: ["Jatim Park 1", "Petik Apel", "Museum Angkut"],
      image: "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "malang-2",
      category: "malang",
      categoryName: "Arema Malang",
      packageName: "Paket 2",
      priceDisplay: "Rp730.000",
      priceUnit: "/orang",
      priceWa: "Rp730.000",
      destinations: ["Jatim Park 2", "Petik Apel", "Museum Angkut"],
      image: "https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "malang-3",
      category: "malang",
      categoryName: "Arema Malang",
      packageName: "Paket 3",
      priceDisplay: "Rp741.000",
      priceUnit: "/orang",
      priceWa: "Rp741.000",
      destinations: ["Jatim Park 1/2", "Petik Apel", "BNS"],
      image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80"
    }
  ];

  function getWhatsAppUrl(pkg) {
    const text = `Halo Amiratama Tour, saya tertarik dengan paket wisata ${pkg.categoryName} – ${pkg.packageName}.\n\nHarga: ${pkg.priceWa}/orang.\n\nMohon informasi lebih lanjut mengenai fasilitas, jadwal keberangkatan, dan proses pemesanan.\n\nTerima kasih.`;
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
  }

  // Render Package Cards
  const paketGrid = document.getElementById("paket-grid");
  
  function renderPaketCards() {
    if (!paketGrid) return;
    paketGrid.innerHTML = "";

    PAKET_DATA.forEach(pkg => {
      const card = document.createElement("div");
      card.className = "paket-card bg-white rounded-2xl overflow-hidden shadow-card border border-slate-200/80 flex flex-col justify-between";
      card.setAttribute("data-category", pkg.category);
      card.setAttribute("data-id", pkg.id);

      const destinationsListHtml = pkg.destinations
        .map(dest => `<li class="flex items-start gap-2 text-xs sm:text-sm text-slate-body"><span class="material-symbols-outlined text-orange text-[16px] shrink-0 mt-0.5">check_circle</span><span>${dest}</span></li>`)
        .join("");

      card.innerHTML = `
        <div>
          <!-- Card Image Header -->
          <div class="relative h-48 sm:h-52 overflow-hidden bg-navy-900">
            <img src="${pkg.image}" 
                 alt="${pkg.categoryName} - ${pkg.packageName}" 
                 class="w-full h-full object-cover transition-transform duration-500 ease-out hover:scale-105" 
                 loading="lazy" 
                 onerror="this.src='https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'"/>
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div class="absolute top-3 left-3">
              <span class="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-navy text-[11px] font-bold shadow-sm uppercase tracking-wider">
                ${pkg.categoryName}
              </span>
            </div>
            ${pkg.note ? `
            <div class="absolute bottom-2 left-3 right-3">
              <span class="px-2 py-0.5 rounded bg-amber-500/90 text-white text-[10px] font-medium backdrop-blur-sm inline-block">
                ${pkg.note}
              </span>
            </div>` : ""}
          </div>

          <!-- Card Content -->
          <div class="p-5 sm:p-6">
            <div class="flex items-start justify-between gap-2 mb-2">
              <h3 class="text-lg sm:text-xl font-bold text-navy tracking-tight">${pkg.packageName}</h3>
            </div>

            <!-- Price -->
            <div class="mb-4 pb-4 border-b border-slate-100 flex items-baseline gap-1">
              <span class="text-xl sm:text-2xl font-extrabold text-orange tracking-tight">${pkg.priceDisplay}</span>
              <span class="text-xs text-slate-500 font-medium">${pkg.priceUnit}</span>
            </div>

            <!-- Destinations List -->
            <div>
              <p class="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-2.5">Destinasi:</p>
              <ul class="space-y-1.5">
                ${destinationsListHtml}
              </ul>
            </div>
          </div>
        </div>

        <!-- Card Action Buttons -->
        <div class="p-5 sm:p-6 pt-0 flex items-center gap-2.5">
          <button type="button" class="btn-detail flex-1 py-2.5 px-3 rounded-xl border border-slate-200 hover:border-navy text-navy text-xs sm:text-sm font-semibold transition-colors text-center focus:outline-none" data-id="${pkg.id}">
            Lihat Detail
          </button>
          <a href="${getWhatsAppUrl(pkg)}" target="_blank" rel="noopener noreferrer" class="flex-1 py-2.5 px-3 rounded-xl bg-orange hover:bg-orange-dark text-white text-xs sm:text-sm font-semibold shadow-sm transition-colors inline-flex items-center justify-center gap-1.5">
            <svg class="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M8.53 7.33C8.37 7.33 8.1 7.39 7.87 7.64C7.65 7.89 7.02 8.48 7.02 9.68C7.02 10.88 7.89 12.04 8.01 12.2C8.13 12.37 9.71 14.81 12.13 15.86C14.15 16.73 14.56 16.56 15 16.52C15.44 16.48 16.42 15.93 16.62 15.35C16.82 14.77 16.82 14.28 16.76 14.18C16.7 14.07 16.54 14.01 16.3 13.89C16.06 13.77 14.88 13.19 14.66 13.11C14.44 13.03 14.28 12.99 14.12 13.23C13.96 13.48 13.5 14.01 13.36 14.17C13.22 14.33 13.08 14.35 12.84 14.23C12.6 14.11 11.83 13.86 10.91 13.04C10.2 12.4 9.71 11.62 9.57 11.38C9.43 11.14 9.56 11 9.68 10.88C9.79 10.77 9.92 10.6 10.04 10.46C10.16 10.32 10.2 10.22 10.28 10.06C10.36 9.9 10.32 9.76 10.26 9.64C10.2 9.52 9.74 8.38 9.54 7.91C9.35 7.45 9.16 7.51 9.02 7.51C8.89 7.5 8.71 7.33 8.53 7.33Z"/>
            </svg>
            <span>Book Now</span>
          </a>
        </div>
      `;

      paketGrid.appendChild(card);
    });

    // Attach Detail Button Handlers
    document.querySelectorAll(".btn-detail").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        openPaketModal(id);
      });
    });
  }

  // Filter Logic
  const filterBtns = document.querySelectorAll(".paket-filter-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const selectedCategory = btn.getAttribute("data-category");

      filterBtns.forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      const cards = document.querySelectorAll(".paket-card");
      cards.forEach(card => {
        const cardCategory = card.getAttribute("data-category");
        if (selectedCategory === "semua" || cardCategory === selectedCategory) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // Modal Detail Handling
  const modal = document.getElementById("paket-modal");
  const modalCloseBtn = document.getElementById("paket-modal-close");
  const modalImg = document.getElementById("paket-modal-img");
  const modalCategoryBadge = document.getElementById("paket-modal-category-badge");
  const modalTitle = document.getElementById("paket-modal-title");
  const modalPrice = document.getElementById("paket-modal-price");
  const modalDestinations = document.getElementById("paket-modal-destinations");
  const modalFacilities = document.getElementById("paket-modal-facilities");
  const modalWaBtn = document.getElementById("paket-modal-wa-btn");

  function openPaketModal(packageId) {
    const pkg = PAKET_DATA.find(p => p.id === packageId);
    if (!pkg) return;

    modalImg.src = pkg.image;
    modalImg.alt = `${pkg.categoryName} - ${pkg.packageName}`;
    modalCategoryBadge.textContent = pkg.categoryName;
    modalTitle.textContent = `${pkg.categoryName} — ${pkg.packageName}`;
    modalPrice.textContent = `${pkg.priceDisplay} ${pkg.priceUnit}`;

    // Destinations List
    modalDestinations.innerHTML = pkg.destinations
      .map((dest, i) => `
        <li class="flex items-start gap-2.5 text-sm text-navy font-medium">
          <span class="w-5 h-5 rounded-full bg-orange-peach text-orange-dark font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">${i + 1}</span>
          <span>${dest}</span>
        </li>
      `)
      .join("");

    // Facilities List (Strictly per category)
    const facilities = FASILITAS_DATA[pkg.category] || [];
    modalFacilities.innerHTML = facilities
      .map(fac => `
        <li class="flex items-start gap-2 text-xs sm:text-sm text-slate-body">
          <span class="material-symbols-outlined text-emerald-600 text-[18px] shrink-0">check</span>
          <span>${fac}</span>
        </li>
      `)
      .join("");

    // WhatsApp Book Now
    modalWaBtn.href = getWhatsAppUrl(pkg);

    // Show Modal
    modal.classList.remove("hidden");
    setTimeout(() => {
      modal.classList.remove("opacity-0");
      modal.classList.add("opacity-100");
    }, 10);
    document.body.classList.add("overflow-hidden");
  }

  function closePaketModal() {
    modal.classList.remove("opacity-100");
    modal.classList.add("opacity-0");
    setTimeout(() => {
      modal.classList.add("hidden");
      document.body.classList.remove("overflow-hidden");
    }, 300);
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", closePaketModal);
  }

  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        closePaketModal();
      }
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal && !modal.classList.contains("hidden")) {
      closePaketModal();
    }
  });

  // Initial Render
  renderPaketCards();

});
