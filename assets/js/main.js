// function initNavbarMenu() {
//   const mobileMenuButton = document.getElementById("mobileMenuButton");
//   const mobileMenu = document.getElementById("mobileMenu");

//   if (!mobileMenuButton || !mobileMenu) return;

//   mobileMenuButton.addEventListener("click", function (e) {
//     e.preventDefault();
//     e.stopPropagation();

//     mobileMenu.classList.toggle("hidden");
//   });

//   mobileMenu.addEventListener("click", function (e) {
//     e.stopPropagation();
//   });

//   document.addEventListener("click", function () {
//     mobileMenu.classList.add("hidden");
//   });

//   window.addEventListener("resize", function () {
//     if (window.innerWidth >= 1024) {
//       mobileMenu.classList.add("hidden");
//     }
//   });
// }


function initNavbarMenu() {
  const mobileMenuButton = document.getElementById("mobileMenuButton");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileProductsButton = document.getElementById("mobileProductsButton");
  const mobileProductsMenu = document.getElementById("mobileProductsMenu");

  if (!mobileMenuButton || !mobileMenu) return;

  mobileMenuButton.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    mobileMenu.classList.toggle("hidden");
  });

  if (mobileProductsButton && mobileProductsMenu) {
    mobileProductsButton.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      mobileProductsMenu.classList.toggle("hidden");
    });
  }

  document.querySelectorAll(".mobileSubmenuButton").forEach(function (button) {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const submenu = button.nextElementSibling;

      if (submenu && submenu.classList.contains("mobileSubmenu")) {
        submenu.classList.toggle("hidden");
      }
    });
  });

  mobileMenu.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  document.addEventListener("click", function () {
    mobileMenu.classList.add("hidden");
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth >= 1024) {
      mobileMenu.classList.add("hidden");

      if (mobileProductsMenu) {
        mobileProductsMenu.classList.add("hidden");
      }

      document.querySelectorAll(".mobileSubmenu").forEach(function (submenu) {
        submenu.classList.add("hidden");
      });
    }
  });
}

function initHeroSlider() {
  const slider = document.getElementById("slider");
  const prevBtn = document.getElementById("heroPrevBtn");
  const nextBtn = document.getElementById("heroNextBtn");

  if (!slider) return;

  const totalSlides = slider.children.length;
  let currentSlide = 0;
  let autoSlide = null;

  function showSlide(index) {
    if (index < 0) {
      currentSlide = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentSlide = 0;
    } else {
      currentSlide = index;
    }

    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlide = setInterval(nextSlide, 5000);
  }

  function stopAutoSlide() {
    if (autoSlide) {
      clearInterval(autoSlide);
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      nextSlide();
      startAutoSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      prevSlide();
      startAutoSlide();
    });
  }

  let startX = 0;
  let endX = 0;

  slider.addEventListener(
    "touchstart",
    function (e) {
      startX = e.touches[0].clientX;
      endX = startX;
      stopAutoSlide();
    },
    { passive: true }
  );

  slider.addEventListener(
    "touchmove",
    function (e) {
      endX = e.touches[0].clientX;
    },
    { passive: true }
  );

  slider.addEventListener("touchend", function () {
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }

    startAutoSlide();
  });

  const translations = {
    de: {
      slide1_title: "Moderne Sicherheitstechnologie",
      slide1_product: "Überwachungskameras",
      slide2_title: "Zutrittskontrollsysteme",
      slide2_subtitle: "Moderne Zugangssicherheit",
      shop: "JETZT KAUFEN",
      shop_arrow: "JETZT KAUFEN →",
    },
    en: {
      slide1_title: "Modern Security Technology",
      slide1_product: "Surveillance Cameras",
      slide2_title: "Access Control Systems",
      slide2_subtitle: "Modern Access Security",
      shop: "SHOP NOW",
      shop_arrow: "SHOP NOW →",
    },
  };

  function setLanguage(lang) {
    document.querySelectorAll("[data-key]").forEach(function (el) {
      const key = el.getAttribute("data-key");

      if (translations[lang] && translations[lang][key]) {
        el.innerHTML = translations[lang][key];
      }
    });
  }

  setLanguage("de");
  showSlide(0);
  startAutoSlide();

  window.nextSlide = nextSlide;
  window.prevSlide = prevSlide;
  window.setLanguage = setLanguage;
}

function initFAQ() {
  const faqToggles = document.querySelectorAll(".faq-toggle");

  faqToggles.forEach(function (toggle) {
    toggle.addEventListener("click", function () {
      const faqItem = this.closest(".faq-item");
      const faqContent = faqItem.querySelector(".faq-content");
      const faqIcon = faqItem.querySelector(".faq-icon");

      faqContent.classList.toggle("hidden");

      if (faqContent.classList.contains("hidden")) {
        faqIcon.textContent = "+";
      } else {
        faqIcon.textContent = "−";
      }
    });
  });
}

function toggleHomeReadMoreText() {
  const textBox = document.getElementById("homeReadMoreText");
  const button = document.getElementById("homeReadMoreBtn");

  if (!textBox || !button) return;

  textBox.classList.toggle("hidden");

  if (textBox.classList.contains("hidden")) {
    button.innerText = "Read More";
  } else {
    button.innerText = "Read Less";
  }
}

function initProductSlider() {
  const section = document.getElementById("homeProductSlider");
  if (!section) return;

  const track = section.querySelector("#productSliderTrack");
  const prevBtn = section.querySelector("#productPrevBtn");
  const nextBtn = section.querySelector("#productNextBtn");

  if (!track || !prevBtn || !nextBtn) return;

  let currentIndex = 0;

  function getVisibleCards() {
    if (window.innerWidth >= 1024) return 4;
    if (window.innerWidth >= 640) return 2;
    return 1;
  }

  function getStep() {
    const firstCard = track.children[0];
    if (!firstCard) return 0;

    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return firstCard.offsetWidth + gap;
  }

  function updateSlider() {
    const totalCards = track.children.length;
    const visibleCards = getVisibleCards();
    const maxIndex = Math.max(totalCards - visibleCards, 0);

    currentIndex = Math.min(Math.max(currentIndex, 0), maxIndex);

    track.style.transform = `translateX(-${currentIndex * getStep()}px)`;

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === maxIndex;
  }

  nextBtn.addEventListener("click", function () {
    const visibleCards = getVisibleCards();
    const totalCards = track.children.length;
    const maxIndex = Math.max(totalCards - visibleCards, 0);

    currentIndex = Math.min(currentIndex + visibleCards, maxIndex);
    updateSlider();
  });

  prevBtn.addEventListener("click", function () {
    const visibleCards = getVisibleCards();

    currentIndex = Math.max(currentIndex - visibleCards, 0);
    updateSlider();
  });

  window.addEventListener("resize", updateSlider);

  updateSlider();
}

async function loadComponent(targetId, componentPath) {
  const target = document.getElementById(targetId);

  if (!target) return;

  try {
    const response = await fetch(componentPath);

    if (!response.ok) {
      throw new Error(`Failed to load ${componentPath}`);
    }

    target.innerHTML = await response.text();
  } catch (error) {
    console.error(error);
  }
}

async function loadComponents() {
  await loadComponent("navbar", "components/navbar.html");
  await loadComponent("hero", "components/hero.html");
  await loadComponent("banner2", "components/banner.html");
  await loadComponent("trainingCalendar", "components/training-calendar.html");
  await loadComponent("best-sellers", "components/best-sellers.html");
  await loadComponent("productSlider", "components/slider.html");
  await loadComponent("takeMoment", "components/take-moment.html");
  await loadComponent("videoSection", "components/video-section.html");
  await loadComponent("homeReadMore", "components/home-readmore.html");
  await loadComponent("blogNews", "components/blog-news.html");
  await loadComponent("faq", "components/faq.html");
  await loadComponent("footer", "components/footer.html");

  initHeroSlider();
  initProductSlider();
  initNavbarMenu();
  initFAQ();

  if (window.lucide) {
    lucide.createIcons();
  }

  const cartScript = document.createElement("script");
  cartScript.src = "assets/js/cart.js";
  document.body.appendChild(cartScript);
}

document.addEventListener("DOMContentLoaded", loadComponents);