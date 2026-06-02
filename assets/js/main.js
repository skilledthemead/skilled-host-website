/* =========================================================
   SKILLED HOST MAIN WEBSITE
   LANGUAGE + THEME + MOBILE MENU + HEADER DROPDOWNS
   DOMAIN SEARCH + DYNAMIC PRICING
   ========================================================= */

const root = document.documentElement;
const siteHeader = document.querySelector(".site-header");
const mobileMenuButton = document.querySelector(".mobile-menu-btn");
const themeToggle = document.querySelector("[data-theme-toggle]");
const langToggle = document.querySelector("[data-lang-toggle]");
const langCode = document.querySelector(".lang-code");
const navItems = document.querySelectorAll(".nav-item.has-mega");
const domainForms = document.querySelectorAll(".domain-search");
const pricingRoot = document.querySelector("[data-pricing-root]");

const savedTheme = localStorage.getItem("skilledHostTheme") || "light";
const savedLang = localStorage.getItem("skilledHostLang") || "en";

let pricingData = null;
let activePricingCategoryIndex = 0;

/* =========================================================
   BASIC HELPERS
   ========================================================= */

function getCurrentLang() {
  return root.getAttribute("lang") || "en";
}

function getCurrentTheme() {
  return root.getAttribute("data-theme") || "light";
}

function getLocalized(value, lang = getCurrentLang()) {
  if (!value) {
    return "";
  }

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  return value[lang] || value.en || "";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatPrice(value) {
  const number = Number(value);

  if (Number.isNaN(number)) {
    return "0.00";
  }

  return number.toFixed(2);
}

/* =========================================================
   CONTROL LABELS
   ========================================================= */

function updateControlLabels() {
  const currentTheme = getCurrentTheme();
  const currentLang = getCurrentLang();

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

/* =========================================================
   THEME + LANGUAGE
   ========================================================= */

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

  if (pricingData && pricingRoot) {
    renderPricingCategory(activePricingCategoryIndex);
  }
}

/* =========================================================
   HEADER + MEGA MENU
   ========================================================= */

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
    const currentTheme = getCurrentTheme();
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    applyTheme(nextTheme);
  });
}

if (langToggle) {
  langToggle.addEventListener("click", () => {
    const currentLang = getCurrentLang();
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

/* =========================================================
   DOMAIN SEARCH REDIRECT
   Sends domain searches to Skilled Host HostShop domain search
   ========================================================= */

domainForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const input = form.querySelector('input[name="domain"]');
    const rawDomain = input ? input.value.trim() : "";

    if (!rawDomain) {
      if (input) {
        input.focus();
      }

      return;
    }

    const cleanDomain = rawDomain
      .replace(/^https?:\/\//i, "")
      .replace(/^www\./i, "")
      .replace(/\s+/g, "")
      .toLowerCase();

    window.location.href = `https://cp.skilledhost.com/domain-search?domain=${encodeURIComponent(cleanDomain)}`;
  });
});

/* =========================================================
   DYNAMIC PRICING
   Loads assets/data/pricing.json and renders homepage pricing cards
   ========================================================= */

function buildPricingTabs(categories) {
  const lang = getCurrentLang();

  return `
    <div class="pricing-tabs" role="tablist" aria-label="Hosting plan categories">
      ${categories
        .map((category, index) => {
          const label = escapeHtml(getLocalized(category.label, lang));
          const isActive = index === activePricingCategoryIndex ? " is-active" : "";

          return `
            <button
              class="pricing-tab${isActive}"
              type="button"
              role="tab"
              data-pricing-tab="${index}"
              aria-selected="${index === activePricingCategoryIndex ? "true" : "false"}"
            >
              ${label}
            </button>
          `;
        })
        .join("")}
    </div>
  `;
}

function buildPricingCard(plan, category, globalData) {
  const lang = getCurrentLang();

  const planName = escapeHtml(getLocalized(plan.name, lang));
  const badge = escapeHtml(getLocalized(plan.badge, lang));
  const currency = escapeHtml(globalData.currency || "AED");
  const numericPrice = Number(plan.priceMonthly);
  const isFree = !Number.isNaN(numericPrice) && numericPrice === 0;
  const price = formatPrice(plan.priceMonthly);

  const features = Array.isArray(plan.features?.[lang])
    ? plan.features[lang]
    : Array.isArray(plan.features?.en)
      ? plan.features.en
      : [];

  const termLabel = escapeHtml(getLocalized(globalData.defaultTerm?.label, lang));
  const discount = globalData.defaultTerm?.discountPercent || 15;
  const orderUrl = escapeHtml(plan.orderUrl || category.categoryUrl || "https://cp.skilledhost.com");

  const badgeEn = String(getLocalized(plan.badge, "en")).toLowerCase();

  const isPopular =
    badgeEn.includes("popular") ||
    badgeEn.includes("recommended");

  const ctaText = getLocalized(plan.cta, lang) || (
    isFree
      ? lang === "ar"
        ? "ابدأ مجاناً"
        : "Start Free"
      : lang === "ar"
        ? "اطلب الآن"
        : "Order Now"
  );

  const periodText = lang === "ar" ? "/ شهر" : "/mo";

  const termText =
    lang === "ar"
      ? `${termLabel} مع خصم ${discount}%`
      : `${termLabel} with ${discount}% discount`;

  const priceHtml = isFree
    ? `
      <div class="pricing-price pricing-price-free">
        <span class="pricing-amount pricing-free-text">
          ${lang === "ar" ? "مجاني" : "Free"}
        </span>
      </div>
    `
    : `
      <div class="pricing-price">
        <span class="pricing-currency">${currency}</span>
        <span class="pricing-amount">${price}</span>
        <span class="pricing-period">${periodText}</span>
      </div>

      <p class="pricing-term">${escapeHtml(termText)}</p>
    `;

  const buttonClass = isPopular || isFree ? "btn-primary" : "btn-secondary";

  return `
    <article class="pricing-card${isPopular ? " is-popular" : ""}${isFree ? " is-free" : ""}">
      <span class="pricing-card-badge">${badge}</span>

      <h4>${planName}</h4>

      ${priceHtml}

      <ul class="pricing-features">
        ${features
          .map((feature) => `<li>${escapeHtml(feature)}</li>`)
          .join("")}
      </ul>

      <a href="${orderUrl}" class="btn ${buttonClass}">
        ${escapeHtml(ctaText)}
      </a>
    </article>
  `;
}

function renderPricingCategory(index = 0) {
  if (!pricingRoot || !pricingData || !Array.isArray(pricingData.categories)) {
    return;
  }

  const lang = getCurrentLang();
  const categories = pricingData.categories;
  const safeIndex = categories[index] ? index : 0;
  const category = categories[safeIndex];

  activePricingCategoryIndex = safeIndex;

  const categoryTitle = escapeHtml(getLocalized(category.title, lang));
  const categoryDescription = escapeHtml(getLocalized(category.description, lang));
  const categoryUrl = escapeHtml(category.categoryUrl || "https://cp.skilledhost.com");
  const billingNote = escapeHtml(getLocalized(pricingData.billingNote, lang));
  const viewAllText = lang === "ar" ? "عرض كل الخطط" : "View all plans";
  const noteLabel = lang === "ar" ? "ملاحظة السعر:" : "Pricing note:";

  pricingRoot.innerHTML = `
    ${buildPricingTabs(categories)}

    <div class="pricing-category-intro">
      <div>
        <h3>${categoryTitle}</h3>
        <p>${categoryDescription}</p>
      </div>

      <a href="${categoryUrl}" class="pricing-category-link">
        ${escapeHtml(viewAllText)}
      </a>
    </div>

    <div class="pricing-grid">
      ${category.plans
        .map((plan) => buildPricingCard(plan, category, pricingData))
        .join("")}
    </div>

    <div class="pricing-note">
      <span aria-hidden="true">ⓘ</span>
      <span><strong>${escapeHtml(noteLabel)}</strong> ${billingNote}</span>
    </div>
  `;

  pricingRoot.querySelectorAll("[data-pricing-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      const nextIndex = Number(tab.getAttribute("data-pricing-tab"));

      renderPricingCategory(nextIndex);
    });
  });
}

async function loadPricingData() {
  if (!pricingRoot) {
    return;
  }

  try {
    const response = await fetch("assets/data/pricing.json", {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Pricing data could not be loaded.");
    }

    pricingData = await response.json();
    renderPricingCategory(0);
  } catch (error) {
    const lang = getCurrentLang();
    const message =
      lang === "ar"
        ? "تعذر تحميل الخطط حالياً. يرجى زيارة منطقة العميل لعرض الأسعار."
        : "Pricing plans could not be loaded right now. Please visit the client area to view plans.";

    pricingRoot.innerHTML = `
      <div class="pricing-loading">
        ${escapeHtml(message)}
      </div>
    `;
  }
}

loadPricingData();