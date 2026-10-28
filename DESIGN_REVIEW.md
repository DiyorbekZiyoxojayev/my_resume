# Yakuniy dizayn tahlili

2026-10-28. Doira: home’dan keyingi beshta bo‘lim, navigatsiya, footer va hujjat oynasi. Home komponentlari, uning CSS/JavaScript fayllari va `files/` hujjatlari o‘zgartirilmadi.

## Tanqidiy xulosalar va bajarilgan yechimlar

| Oldingi muammo | Yakuniy qaror |
| --- | --- |
| Ketma-ket qo‘shilgan CSS qatlamlari bir-birini qayta yozardi; rang, o‘lcham va bo‘shliqlarni boshqarish qiyinlashgan edi. | Umumiy materiallar va tipografiya `shell.css`ga, har bo‘limning joylashuvi o‘z CSS fayliga yig‘ildi. `continuity.css` va `surfaces.css` olib tashlandi. |
| Sarlavhalar, uzun izohlar va katta 3D sahnalar bir xil vizual og‘irlikka ega edi. | Home’dagi oq/bronza sarlavha mantig‘i, bir xil matn iyerarxiyasi va aniq ikki ustunli kompozitsiya qo‘llandi. Dekorativ “konsol” yozuvlari qisqartirildi. |
| Kichik yozuvlar va past kontrast hujjat, loyiha va aloqa ma’lumotlarini ikkinchi darajaga tushirardi. | Asosiy matnlar 14–15 px, loyiha sarlavhalari 21–31 px, sertifikat tashkilotlari 13 px qilindi. Umumiy matn ranglari uchun kontrast tekshiruvi qo‘shildi. |
| Loyihalar teng o‘lchamli takroriy kartochkalar ko‘rinishida edi; eng muhim ish ajralmas edi. | Birinchi legal AI loyiha asosiy ish sifatida keng kompozitsiyada ko‘rsatildi. Qolgan ishlar ikki ustunda, ilmiy maqola alohida keng blokda joylashdi. Filtrlar va havolalar saqlandi. |
| Telefonlarda 3D obyektlar matn orqasida 23% shaffoflik bilan qolib ketardi. | 3D sahna sarlavhadan keyin alohida 210 px maydonda to‘liq ko‘rinadi. Matn bilan ustma-ust tushmaydi. |
| Til darajalari faqat kichik chiziqlar bilan ifodalangan edi. | C2, C1 va B1 darajalari ko‘rinadigan matn sifatida ham chiqarildi. |
| Hujjat oynasining yopish tugmasi kichik edi; modal ostida 3D ishlashda davom etardi. | Tugma 44 px qilindi. Hujjat ochilganda section render sikli pauza bo‘ladi, yopilganda davom etadi. |
| Yangi kartochkalar sabab eski timeline yoritish hisob-kitobi ko‘rinmaydigan element uchun ishlardi. | Keraksiz scroll hisob-kitobi va dekorativ timeline tugunlari olib tashlandi. |

## Vizual tamoyillar

- Tashqi fotografik metall korpus va tasdiqlangan bronza detallar saqlandi.
- Ichki kartochkalar bitta material oilasiga keltirildi: chuqur sirt, nozik ichki chiziq, chet yoritishi va kichik vintlar.
- Bronza rang urg‘u sifatida ishlatiladi: sarlavhaning ikkinchi qatori, asosiy tugma, davr va hujjat amallari.
- Matn tekis va o‘qiladigan qoladi. Kartochka parallax’i yarim gradus atrofida; 3D obyektlarda detallar, materiallar va soyalar asosiy harakatni beradi.
- Har bir bo‘limning materiali umumiy, ichki joylashuvi esa mazmuniga mos.

## Kod tuzilishi

- `assets/css/site/shell.css`: tokenlar, umumiy karkas, matn, panel, tugma va focus holatlari.
- `about.css`, `experience.css`, `projects.css`, `credentials.css`, `contact.css`: tegishli bo‘lim joylashuvi va moslashuvlari.
- `navigation.css`, `footer.css`, `documents.css`: umumiy interfeys qismlari.
- `machinery.css`: faqat dekorativ simlar, fallback va WebGL sahna maydoni.
- `dimensional.css`: cheklangan hover/parallax harakatlari va reduced-motion qoidalari.
- `assets/js/site/section-scenes.js`: bitta section WebGL canvas’i; ko‘rinmaydigan, yashirin yoki modal bilan qoplangan paytda render to‘xtaydi.

## Tekshiruv dalillari

- 320, 375, 390, 600, 650, 768, 900, 1024, 1280, 1440 va 1920 px o‘lchamlarda gorizontal chiqib ketish, kartochkaning ekran tashqarisiga chiqishi yoki asosiy sarlavha kesilishi topilmadi.
- Mobil menyu ochilishi, Escape bilan yopilishi va bo‘limga o‘tishi tekshirildi.
- Beshta section 3D sahnasi ochildi; sectionlar uchun bir vaqtning o‘zida bitta canvas ishlashi tekshirildi.
- Filtrlar: legal AI — 2, machine learning — 3, web — 1, publication — 1, all — 7.
- PDF va PNG hujjat oynalari, 44 px yopish tugmasi va fokusning ochgan kartochkaga qaytishi tekshirildi.
- Bo‘sh aloqa formasi yuborilmaydi: izoh ko‘rsatiladi va ism maydoniga fokus qaytadi. Haqiqiy email yuborilmadi.
- Panelning eng yorug‘ asosiy rangi bilan token kontrastlari: asosiy matn 6.86:1, yordamchi yozuvlar 5.98:1, sarlavha 10.64:1, bronza urg‘u 6.96:1. Bu asosiy tokenlar tekshiruvi; barcha gradient va holatlar bo‘yicha alohida WCAG sertifikati emas.
- Home manbalari va asl hujjatlardan iborat 32 faylning oldingi va keyingi SHA-256 xeshlari tengligi tekshirildi.
- `npm.cmd run check`: generatsiya, HTML identifikatorlari, lokal fayllar, anchorlar, JavaScript sintaksisi, GLB modeli va kontrast tokenlari uchun tekshiruv.

## Mazmun bo‘yicha saqlangan chegaralar

Loyihalar uchun aniq repository manzillari berilmagan joylarda mavjud GitHub profil havolasi ochiq nom bilan saqlandi; uydirma repository, benchmark, mijoz yoki natija qo‘shilmadi. AGROBANK vazifalari ham foydalanuvchi bergan lavozim doirasida qoldi. EmailJS’ning haqiqiy yetkazib berishi ushbu dizayn tekshiruvida tashqi xabar yuborish orqali sinalmadi.
