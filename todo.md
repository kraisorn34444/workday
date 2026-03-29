# WorkDay Online - TODO List

## Phase 1: Setup & Foundation
- [x] สร้างโครงสร้างเว็บแอปพลิเคชัน
- [x] นำเข้าข้อมูลจากไฟล์ Excel (52 รายการ)
- [x] สร้างหน้าภาพรวม ปฏิทิน รายการงาน สถิติ

## Phase 2: Export Features
- [x] เพิ่มฟีเจอร์ Export เป็น Excel
- [x] เพิ่มฟีเจอร์ Export เป็น CSV

## Phase 3: Image Features
- [x] เพิ่มฟิลด์ images ในโครงสร้าง WorkRecord
- [x] สร้าง ImageUploader component
- [x] สร้าง ImageGallery modal

## Phase 4: Authentication & Authorization
- [x] เพิ่มระบบ Login (Manus OAuth)
- [x] จำกัดสิทธิ์การเข้าถึง (admin/user roles)
- [x] ป้องกันการแก้ไข/ลบข้อมูลเฉพาะ admin

## Phase 5: UI/UX Improvements
- [x] เปลี่ยนชื่อเว็บเป็น "Work Online"
- [x] ปรับปรุง UI ตารางแสดงผล
- [x] ปรับปรุง UI แกลเลอร์รีรูปภาพ
- [ ] เพิ่มการแสดงผล loading states
- [ ] เพิ่ม empty states ที่สวยงาม

## Phase 6: Database Integration
- [x] สร้าง Database schema สำหรับ WorkRecord
- [x] สร้าง API procedures สำหรับ CRUD
- [x] สร้าง migration script สำหรับ import ข้อมูลจาก localStorage
- [x] เชื่อมต่อ UI เพื่อเชื่อมต่อข้อมูลจาก API

## Phase 7: Month Selection Feature
- [x] เพิ่มเมนูเลือกเดือนใน Dashboard
- [x] เพิ่มเมนูเลือกเดือนใน Calendar
- [x] เพิ่มเมนูเลือกเดือนใน Stats
- [x] อัปเดตกราฟิกสถิติเมื่อเลือกเดือน

## Phase 8: Bug Fixes
- [x] ข้อมูลใหม่ที่เพิ่มจากหน้ารายการงานไม่แสดงใน Dashboard/Calendar/Stats
- [x] เพิ่มตัวเลือกปี พ.ศ. เพื่อดูข้อมูลข้ามปี

## Phase 9: Testing & Deployment
- [ ] ทดสอบการกำหนดข้อมูลจาก Database
- [ ] ทดสอบการเลือกเดือนและปี
- [ ] ทดสอบ responsive design บนมือถือ
- [ ] deploy เว็บสาธารณะ

## Phase 10: API Database Integration
- [x] อัปเดต RecordsTable ให้ใช้ tRPC mutations (create, update, delete)
- [x] อัปเดต Dashboard ให้โหลดข้อมูลจาก API Database
- [x] เพิ่ม loading states และ error handling
- [x] ทดสอบการบันทึกข้อมูลลง## Phase 11: Authorization & Access Control
- [x] เพิ่ม adminProcedure ใน backend เพื่อตรวจสอบสิทธิ์ admin
- [x] อัปเดต create/update/delete procedures ให้ใช้ adminProcedure
- [x] อัปเดต UI ให้แสดงปุ่ม edit/delete เฉพาะ admin
- [x] เพิ่มข้อความแจ้งเตือนเมื่อผู้ใช้ทั่วไม่เป็น adminพยายามแก้ไข/ลบ

## Phase 12: Mock Login System
- [x] สร้าง API procedures สำหรับ register/login/logout (ไม่ใช้ Manus OAuth)
- [x] สร้าง Register page สำหรับสร้าง Account ทดสอบ
- [x] สร้าง Login page สำหรับ login ด้วย username/password
- [x] เพิ่ม mock session management ใน frontend
- [x] อัปเดต auth flow เพื่อรองรับ mock login

## Phase 13: PostgreSQL Migration & Local Development
- [x] อัปเดต package.json เปลี่ยน mysql2 เป็น pg (PostgreSQL driver)
- [x] อัปเดต drizzle.config.ts เป็น PostgreSQL
- [x] อัปเดต schema.ts ให้ใช้ pgTable แทน mysqlTable
- [x] สร้าง .env.local สำหรับ local development
- [x] สร้าง setup guide สำหรับการตั้งค่า local environment
- [ ] ทดสอบการรัน local development

## Phase 14: New Login System with Password Hashing
- [ ] ติดตั้ง bcrypt library สำหรับเข้ารหัสรหัสผ่าน
- [ ] สร้าง password hashing utility functions
- [ ] สร้าง API procedures สำหรับ register/login/logout ที่ตรวจสอบ DB
- [ ] สร้าง Login page ใหม่
- [ ] สร้าง Register page ใหม่
- [ ] อัปเดต auth flow เพื่อรองรับ session management
- [ ] ทดสอบระบบ Login/Register
