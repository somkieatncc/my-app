InterCare Asia 2026 – Static site (HTML/CSS) แทน WordPress
================================================================

โครงสร้าง (URL เดิมของ WordPress ใช้ได้เหมือนเดิม)
  /index.html                      หน้าแรก EN
  /<slug>/index.html               หน้าย่อย EN  (เช่น /factsheet/)
  /th/index.html                   หน้าแรก TH
  /th/<slug>/index.html            หน้าย่อย TH  (เช่น /th/factsheet/)
  /assets/css/style.css            สไตล์รวมทุกหน้า
  /assets/js/main.js               เมนู, sticky header, carousel, cookie bar, ฟอร์ม
  /assets-to-migrate.txt           รายการรูป/วิดีโอที่ยังดึงจาก intercare-asia.com/wp-content

หน้าย่อย: products-and-services, factsheet, floor-plan, visitor-profile, exhibitor-lists,
          products-highlight, newsletter, contact-us, about-the-venue, consent, privacy-policy

เปิดดูบนเครื่อง: ดับเบิลคลิก index.html ได้เลย (ลิงก์ภายในเป็น relative)

ก่อนขึ้นระบบจริง
1) รูปและวิดีโอทั้งหมดอยู่ในโฟลเดอร์ media/ แล้ว (อ้างแบบ relative ไม่ดึงจาก WordPress)
2) ฟอร์ม Factsheet (TH/EN) ยังไม่มี backend: กำหนด data-endpoint="..." ใน <form class="static-form">
   (เช่น Power Automate HTTP trigger / n8n webhook) ระบบจะ POST ข้อมูลแบบ FormData ให้
3) หน้ารายละเอียดผู้แสดงสินค้า 10 ราย x 2 ภาษา ย้ายมาแล้ว (/prosource/, /th/r38/ ฯลฯ)
4) Cookie bar ตอนนี้แค่จำการกดปุ่ม ยังไม่ได้บล็อก/ปล่อย script ตาม consent
5) หน้า Consent ใช้ iframe ของ t-reg.co และหน้า Contact ใช้ Google Maps embed ตามเดิม

Redirect / URL เก่า (เมื่อปิด WordPress)
  .htaccess                        สำหรับ Apache (ต้องเปิด mod_rewrite + AllowOverride All) — ทดสอบกับ Apache แล้ว
  _migration/nginx-redirects.conf  สำหรับ nginx (include ใน server { }) — ทดสอบ nginx -t แล้ว
  _migration/legacy-urls.csv       รายการ URL เก่าทั้งหมด 381 รายการจาก sitemap ของ WordPress และปลายทางใหม่
  - /wp-content/uploads/... -> /media/... (รูปที่ยังมี เช่นรูปใน eDM เก่า)
  - หน้าผู้แสดงสินค้าปีก่อน ๆ -> Products Highlight, บทความเก่า/หน้า info เก่า -> หน้าแรกของภาษานั้น
  - URL อื่นที่ไม่มีอยู่ -> หน้าแรก (/ หรือ /th/)
  โฟลเดอร์ _migration/ ไม่จำเป็นต้องอัปโหลดขึ้นเว็บ

Tracking
  WordPress เดิมมีแค่ Google Analytics แบบ Universal Analytics (UA-83198415-8) ซึ่ง Google หยุดเก็บข้อมูลตั้งแต่ ก.ค. 2023
  จึงไม่มี tracking ที่ใช้งานได้ให้ย้าย หากต้องการสถิติให้สร้าง GA4 ใหม่และผูกกับ cookie consent
