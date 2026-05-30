/* =========================================================
   SKILLED HOST MAIN WEBSITE
   LANGUAGE + THEME + MOBILE MENU + HEADER DROPDOWNS
   ========================================================= */

const root = document.documentElement;
const siteHeader = document.querySelector(".site-header");
const mobileMenuButton = document.querySelector(".mobile-menu-btn");
const themeToggle = document.querySelector("[data-theme-toggle]");
const langToggle = document.querySelector("[data-lang-toggle]");
const langCode = document.querySelector(".lang-code");
const navItems = document.querySelectorAll(".nav-item.has-mega");
const domainForms = document.querySelectorAll(".domain-search");

const savedTheme = localStorage.getItem("skilledHostTheme") || "light";
const savedLang = localStorage.getItem("skilledHostLang") || "en";

function updateControlLabels() {
  const currentTheme = root.getAttribute("data-theme") || "light";
  const currentLang = root.getAttribute("lang") || "en";

  if (themeToggle) {
    const themeLabel =
      currentLang === "ar"
        ? currentTheme === "dark"
          ? "التبديل إلى الوضع الفاتح"
          : "التبديل إلى الوضع الداكن"
        : currentTheme === "dark"
          ? "Switch to light mode"
          : "Switch to dark mode";

    themeToggle.setAttribute("aria-label", themeLabel);
    themeToggle.setAttribute("title", themeLabel);
  }

  if (langToggle) {
    const langLabel = currentLang === "ar" ? "Switch to English" : "التبديل إلى العربية";

    langToggle.setAttribute("aria-label", langLabel);
    langToggle.setAttribute("title", langLabel);
  }

  if (langCode) {
    langCode.textContent = currentLang === "ar" ? "EN" : "AR";
  }
}

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("skilledHostTheme", theme);
  updateControlLabels();
}

function applyLanguage(lang) {
  root.setAttribute("lang", lang);
  root.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  localStorage.setItem("skilledHostLang", lang);

  document.querySelectorAll("[data-en][data-ar]").forEach((element) => {
    const text = element.getAttribute(`data-${lang}`);

    if (text) {
      element.textContent = text;
    }
  });

  document.querySelectorAll("[data-placeholder-en][data-placeholder-ar]").forEach((element) => {
    const placeholder = element.getAttribute(`data-placeholder-${lang}`);

    if (placeholder) {
      element.setAttribute("placeholder", placeholder);
    }
  });

  updateControlLabels();
  closeAllMegaMenus();
}

function closeAllMegaMenus() {
  navItems.forEach((item) => {
    item.classList.remove("is-active");
  });
}

function openMegaMenu(item) {
  closeAllMegaMenus();
  item.classList.add("is-active");
}

applyTheme(savedTheme);
applyLanguage(savedLang);

if (siteHeader && mobileMenuButton) {
  mobileMenuButton.addEventListener("click", () => {
    const isOpen = siteHeader.classList.toggle("is-open");
    mobileMenuButton.setAttribute("aria-expanded", String(isOpen));

    if (!isOpen) {
      closeAllMegaMenus();
    }
  });
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = root.getAttribute("data-theme") || "light";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    applyTheme(nextTheme);
  });
}

if (langToggle) {
  langToggle.addEventListener("click", () => {
    const currentLang = root.getAttribute("lang") || "en";
    const nextLang = currentLang === "ar" ? "en" : "ar";

    applyLanguage(nextLang);
  });
}

navItems.forEach((item) => {
  const trigger = item.querySelector(".nav-trigger");

  item.addEventListener("mouseenter", () => {
    if (window.innerWidth > 980) {
      openMegaMenu(item);
    }
  });

  item.addEventListener("mouseleave", () => {
    if (window.innerWidth > 980) {
      item.classList.remove("is-active");
    }
  });

  if (trigger) {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();

      const isAlreadyOpen = item.classList.contains("is-active");

      closeAllMegaMenus();

      if (!isAlreadyOpen) {
        item.classList.add("is-active");
      }
    });
  }
});

document.addEventListener("click", (event) => {
  const clickedInsideHeader = event.target.closest(".site-header");

  if (!clickedInsideHeader) {
    closeAllMegaMenus();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeAllMegaMenus();

    if (siteHeader && mobileMenuButton) {
      siteHeader.classList.remove("is-open");
      mobileMenuButton.setAttribute("aria-expanded", "false");
    }
  }
});

window.addEventListener("resize", () => {
  closeAllMegaMenus();

  if (window.innerWidth > 980 && siteHeader && mobileMenuButton) {
    siteHeader.classList.remove("is-open");
    mobileMenuButton.setAttribute("aria-expanded", "false");
  }
});

domainForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });
});