(function () {
  "use strict";

  let lang = 'en';

  function setLang(l) {
    lang = l;
    document.querySelectorAll('[data-' + l + ']').forEach(function (el) {
      const v = el.getAttribute('data-' + l);
      if (v !== null) el.innerHTML = v;
    });
    document.querySelectorAll('.lang-switch .lb').forEach(function (b) {
      b.classList.toggle('on', b.getAttribute('data-lang') === l);
    });
    document.documentElement.setAttribute('lang', l);
  }

  document.querySelectorAll('.lang-switch .lb').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setLang(this.getAttribute('data-lang'));
    });
  });

  setLang('en');

  if (window.emailjs) {
    emailjs.init("9mgs9BoBSXqgZPhrF");
  }

  const cf = document.getElementById('cf');
  if (cf) {
    cf.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('name-field').value.trim();
      const email = document.getElementById('email-field').value.trim();
      
      const phoneInput = document.getElementById('phone-field');
      const phone = phoneInput ? phoneInput.value.trim() : '';

      const service = document.getElementById('service-field').value;
      const message = document.getElementById('message-field').value.trim();
      const status = document.getElementById('form-status');
      const btn = document.getElementById('submitBtn');

      if (!name || !email || !message) {
        status.className = 'form-status err';
        status.textContent = lang === 'uz'
          ? "Iltimos, barcha maydonlarni to'ldiring."
          : 'Please fill in all required fields.';
        return;
      }

      btn.disabled = true;
      const originalLabel = btn.textContent;
      btn.textContent = lang === 'uz' ? 'Yuborilmoqda...' : 'Sending...';

      emailjs.send('service_v1d13sv', 'template_dvxw8pb', {
        from_name: name,
        from_email: email,
        phone_number: phone || 'Kiritilmadi',
        service_type: service || 'Not specified',
        message: message
      }).then(function () {
        status.className = 'form-status ok';
        status.textContent = lang === 'uz'
          ? 'Xabar muvaffaqiyatli yuborildi! Tez orada javob beraman.'
          : "Message sent successfully! I'll get back to you soon.";
        btn.textContent = lang === 'uz' ? 'Yuborildi ✓' : 'Sent ✓';
        cf.reset();
      }).catch(function (err) {
        status.className = 'form-status err';
        status.textContent = lang === 'uz'
          ? "Xatolik yuz berdi. Iltimos, qayta urinib ko'ring."
          : 'Something went wrong. Please try again.';
        btn.disabled = false;
        btn.textContent = originalLabel;
        console.error('EmailJS error:', err);
      });
    });
  }

})();