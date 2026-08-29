DIYORBEK ZIYOKHUJAEV — PORTFOLIO SAYT (iPortfolio andozasi asosida)
=====================================================================

Bu sayt "alex-smith" (iPortfolio, BootstrapMade) andozasining tuzilishi,
kutubxonalari va uslubi asosida qurildi, lekin barcha matn, loyihalar,
tajriba va aloqa ma'lumotlari — sizning haqiqiy resume/saytingizdan olindi.

QANDAY ISHLATISH
-----------------
1. Ushbu papkani serveringizga (yoki hostingga) yuklang.
2. "photos" papkasiga quyidagi fayllarni joylashtiring (nomlari aynan
   sizning kompyuteringizdagi fayllar bilan bir xil bo'lishi kerak):
     - diyorbek_image.png   (profil surati)
     - back_image.png       (hero fon surati)
     - favicon.png          (sayt ikonkasi)
     - law_image.png        (agar kerak bo'lsa, xizmatlar bo'limida)
     - tech_image.png       (agar kerak bo'lsa, xizmatlar bo'limida)
3. "files" papkasiga quyidagi hujjatlarni joylashtiring:
     - Diyorbek_Ziyokhujaev_resume.pdf
     - diploma.pdf
     - certificate_HF_excellence.pdf
     - cert_computer_vision.jpg
     - cert_advanced_sql.png
     - cert_intro_sql.png
4. index.html faylini brauzerda oching — tayyor!

TUZILISH
--------
index.html          — asosiy sahifa (barcha matn shu yerda, EN/UZ)
assets/css/main.css — andoza uslubi + siz uchun moslashtirilgan ranglar
assets/js/main.js   — andozaning asosiy JS fayli (AOS, typed.js va h.k.)
assets/vendor/      — Bootstrap, Bootstrap Icons, AOS, Typed.js, PureCounter
photos/, files/     — o'zingizning rasm va hujjatlaringiz shu yerga tushadi

O'ZGARTIRISH KERAK BO'LGAN JOYLAR
----------------------------------
- Aloqa formasi EmailJS orqali ishlaydi (sizning eski saytingizdagi bilan
  bir xil service/template ID va public key ishlatildi). Agar EmailJS
  hisobingizni o'zgartirsangiz, index.html oxiridagi <script> qismida:
    emailjs.init("...")
    emailjs.send("service_...", "template_...", {...})
  qatorlarini yangilang.
- Rang sxemasi assets/css/main.css faylining yuqorisidagi ":root" bo'limida
  (--accent-color va boshqalar) osongina o'zgartiriladi.
- EN/UZ tugmalari sidebar pastida joylashgan; matnni tarjima qilish uchun
  index.html'dagi data-en="..." va data-uz="..." atributlarini tahrirlang.

Andoza litsenziyasi: https://bootstrapmade.com/license/ (BootstrapMade —
iPortfolio andozasi bepul foydalanish uchun, pastdagi "Designed by
BootstrapMade" havolasi index.html'da saqlanishi tavsiya etiladi).
