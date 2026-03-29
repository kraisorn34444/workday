# Setup Local Development - Work Online

คู่มือการตั้งค่า Work Online สำหรับการพัฒนาบน Local Machine

## ข้อกำหนดเบื้องต้น

- **Node.js**: v18 หรือสูงกว่า
- **pnpm**: v10 หรือสูงกว่า (ใช้ `npm install -g pnpm`)
- **PostgreSQL**: v12 หรือสูงกว่า

## ขั้นตอนการตั้งค่า

### 1. ติดตั้ง PostgreSQL

#### Windows
- ดาวน์โหลดจาก https://www.postgresql.org/download/windows/
- ติดตั้งและจำ password สำหรับ `postgres` user
- เพิ่ม PostgreSQL bin folder ไปยัง PATH

#### macOS
```bash
brew install postgresql@15
brew services start postgresql@15
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. สร้าง Database

```bash
# เชื่อมต่อ PostgreSQL
psql -U postgres

# ในภายใน psql shell
CREATE DATABASE workday_online;
CREATE USER workday_user WITH PASSWORD 'your-secure-password';
ALTER ROLE workday_user SET client_encoding TO 'utf8';
ALTER ROLE workday_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE workday_user SET default_transaction_deferrable TO on;
ALTER ROLE workday_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE workday_online TO workday_user;
\q
```

### 3. Clone และตั้งค่าโปรเจค

```bash
cd /path/to/workday-online

# ติดตั้ง dependencies
pnpm install
```

### 4. ตั้งค่า Environment Variables

แก้ไขไฟล์ `.env.local`:

```env
DATABASE_URL="postgresql://workday_user:your-secure-password@localhost:5432/workday_online"
JWT_SECRET="your-super-secret-key-change-this-in-production"
```

### 5. รัน Database Migration

```bash
pnpm db:push
```

### 6. เริ่มต้น Development Server

```bash
pnpm dev
```

เว็บแอปจะเปิดที่ `http://localhost:3000`

## การใช้งาน Mock Login

1. ไปที่หน้า Login
2. คลิก "ทดสอบระบบ (Mock Login)"
3. สร้าง Account ใหม่ด้วย username/password
4. เลือก "Admin" เพื่อให้สิทธิ์ admin
5. Login และเริ่มใช้งาน

## Troubleshooting

### PostgreSQL Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**วิธีแก้**: ตรวจสอบว่า PostgreSQL service กำลังทำงาน
```bash
# Windows
net start postgresql-x64-15

# macOS
brew services start postgresql@15

# Linux
sudo systemctl start postgresql
```

### Database URL Format Error
ตรวจสอบ `.env.local` ให้ถูกต้อง:
```
postgresql://username:password@localhost:5432/database_name
```

### Port Already in Use
หากพอร์ต 3000 ถูกใช้งาน:
```bash
# ใช้พอร์ตอื่น
PORT=3001 pnpm dev
```

## Scripts ที่มีประโยชน์

```bash
# ตรวจสอบ TypeScript errors
pnpm check

# รัน tests
pnpm test

# Format code
pnpm format

# Build for production
pnpm build

# Start production server
pnpm start
```

## ข้อมูลเพิ่มเติม

- **Frontend**: React 19 + Tailwind CSS 4 + TypeScript
- **Backend**: Express 4 + tRPC 11
- **Database**: PostgreSQL + Drizzle ORM
- **Authentication**: Mock Login (username/password) + Manus OAuth (optional)

## การขึ้นระบบจริง (Cloud Deployment)

เมื่อพร้อมขึ้นระบบจริง:

1. สร้าง PostgreSQL database บน Cloud (AWS RDS, Railway, Render, etc.)
2. อัปเดต `DATABASE_URL` ด้วย connection string ของ Cloud database
3. รัน `pnpm db:push` เพื่อ migrate schema
4. Deploy ไปยัง Cloud platform (Vercel, Railway, Render, etc.)

## ติดต่อสำหรับความช่วยเหลือ

หากมีปัญหาในการตั้งค่า โปรดติดต่อทีมพัฒนา
