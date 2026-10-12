/* ==================== LANGUAGE ==================== */
(function () {
  const STORAGE_KEY = "dz-lang";
  const DEFAULT_LANG = "en";
  const toggle = document.getElementById("langToggle");
  const options = toggle ? toggle.querySelectorAll(".lang-option") : [];

  function setLanguage(lang) {
    if (!TRANSLATIONS[lang]) lang = DEFAULT_LANG;

    document.documentElement.lang = lang;

    // Text content
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = TRANSLATIONS[lang][key];
      if (val !== undefined) el.textContent = val;
    });

    // Placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      const val = TRANSLATIONS[lang][key];
      if (val !== undefined) el.setAttribute("placeholder", val);
    });

    // Toggle active state
    options.forEach((o) => {
      o.classList.toggle("lang-active", o.dataset.lang === lang);
    });

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  // Click handler
  if (toggle) {
    options.forEach((opt) => {
      opt.addEventListener("click", () => setLanguage(opt.dataset.lang));
    });
  }

  // Init
  let saved = DEFAULT_LANG;
  try { saved = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG; } catch (e) {}
  setLanguage(saved);

  // Expose for other scripts
  window.__setLang = setLanguage;
})();

/* ==================== COPY BUTTONS ==================== */
(function () {
  const MAP = {
    email: "diyorbekziyoxojayev@gmail.com",
    phone: "+998900041706"
  };

  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-copy");
      const value = MAP[key];
      if (!value) return;

      navigator.clipboard.writeText(value).then(() => {
        const lang = document.documentElement.lang || "uz";
        const msg = lang === "en" ? "Copied to clipboard!" : "Nusxalandi!";
        alert(msg);
      });
    });
  });
})();

/* ==================== PORTFOLIO FILTER ==================== */
(function () {
  const buttons = document.querySelectorAll(".filter-btn");
  const items = document.querySelectorAll(".portfolio-item");
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter");

      buttons.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      items.forEach((item) => {
        const cat = item.getAttribute("data-category");
        if (filter === "all" || cat === filter) {
          item.classList.remove("hidden-item");
        } else {
          item.classList.add("hidden-item");
        }
      });
    });
  });
})();

/* ==================== CONTACT FORM (EmailJS) ==================== */
(function () {
  if (window.emailjs) {
    emailjs.init("9mgs9BoBSXqgZPhrF");
  }

  const cf = document.getElementById("cf");
  if (!cf) return;

  cf.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name-field").value.trim();
    const email = document.getElementById("email-field").value.trim();
    const phone = document.getElementById("phone-field").value.trim();
    const service = document.getElementById("service-field").value;
    const message = document.getElementById("message-field").value.trim();
    const status = document.getElementById("form-status");
    const btn = document.getElementById("submitBtn");
    const lang = document.documentElement.lang || "uz";

    const MESSAGES = {
      en: {
        required: "Please fill in all required fields.",
        sending: "Sending...",
        success: "Message sent successfully! I'll reply soon.",
        sent: "Sent ✓",
        error: "Something went wrong. Please try again."
      },
      uz: {
        required: "Iltimos, barcha majburiy maydonlarni to'ldiring.",
        sending: "Yuborilmoqda...",
        success: "Xabar muvaffaqiyatli yuborildi! Tez orada javob beraman.",
        sent: "Yuborildi ✓",
        error: "Xatolik yuz berdi. Iltimos, qayta urinib ko'ring."
      }
    };
    const T = MESSAGES[lang] || MESSAGES.uz;

    if (!name || !email || !message) {
      status.className = "form-status error";
      status.textContent = T.required;
      return;
    }

    btn.disabled = true;
    const originalLabel = btn.textContent;
    btn.textContent = T.sending;

    emailjs
      .send("service_v1d13sv", "template_dvxw8pb", {
        from_name: name,
        from_email: email,
        phone_number: phone || "—",
        service_type: service || "—",
        message: message
      })
      .then(() => {
        status.className = "form-status success";
        status.textContent = T.success;
        btn.textContent = T.sent;
        cf.reset();
        setTimeout(() => {
          btn.disabled = false;
          btn.textContent = originalLabel;
          status.className = "form-status hidden";
        }, 4000);
      })
      .catch((err) => {
        status.className = "form-status error";
        status.textContent = T.error;
        btn.disabled = false;
        btn.textContent = originalLabel;
        console.error("EmailJS error:", err);
      });
  });
})();