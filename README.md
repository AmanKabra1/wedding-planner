# 🪷 Shaadi Vidhaan - Indian Wedding & Cultural Event Planner
> Full-Stack | NestJS + Angular + MySQL

---

## 📁 PROJECT STRUCTURE

```
wedding-planner/
├── backend/                        ← NestJS Backend
│   ├── src/
│   │   ├── main.ts                 ← App entry point + Swagger setup
│   │   ├── app.module.ts           ← Root module with TypeORM config
│   │   └── modules/
│   │       ├── auth/               ← JWT Authentication
│   │       │   ├── auth.module.ts
│   │       │   ├── auth.service.ts
│   │       │   ├── auth.controller.ts
│   │       │   ├── jwt.strategy.ts
│   │       │   └── jwt-auth.guard.ts
│   │       ├── users/              ← User management
│   │       │   ├── user.entity.ts
│   │       │   ├── users.module.ts
│   │       │   ├── users.service.ts
│   │       │   └── users.controller.ts
│   │       ├── states/             ← Indian states + culture data
│   │       │   ├── state.entity.ts
│   │       │   ├── states.module.ts
│   │       │   ├── states.service.ts  ← Auto-seeds 15 states on startup
│   │       │   └── states.controller.ts
│   │       ├── rituals/            ← All rituals/ceremonies
│   │       │   ├── ritual.entity.ts
│   │       │   ├── rituals.module.ts
│   │       │   ├── rituals.service.ts  ← Auto-seeds 30+ rituals
│   │       │   └── rituals.controller.ts
│   │       ├── events/             ← User event planning
│   │       │   ├── event.entity.ts
│   │       │   ├── events.module.ts
│   │       │   ├── events.service.ts
│   │       │   └── events.controller.ts
│   │       └── bookings/           ← Vendor bookings
│   │           ├── booking.entity.ts
│   │           ├── bookings.module.ts
│   │           ├── bookings.service.ts
│   │           └── bookings.controller.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   └── .env.example                ← Copy to .env and fill values
│
└── frontend/                       ← Angular Frontend
    ├── src/
    │   ├── main.ts                 ← Bootstrap
    │   ├── index.html              ← App shell with Google Fonts
    │   ├── styles.scss             ← Global styles with CSS variables
    │   ├── environments/
    │   │   ├── environment.ts      ← Dev: API URL = localhost:3000
    │   │   └── environment.prod.ts ← Prod: Update API URL here
    │   └── app/
    │       ├── app.component.ts    ← Root with navbar + router-outlet
    │       ├── app.routes.ts       ← All routes (lazy-loaded)
    │       ├── guards/
    │       │   └── auth.guard.ts   ← Protects dashboard/events
    │       ├── services/
    │       │   ├── auth.service.ts ← Login, register, JWT storage
    │       │   ├── api.service.ts  ← All API calls
    │       │   └── auth.interceptor.ts ← Adds JWT header automatically
    │       └── components/
    │           ├── navbar/         ← Responsive navbar with mobile menu
    │           ├── footer/         ← Footer with links
    │           ├── home/           ← Landing page
    │           ├── states/         ← States list + state detail
    │           ├── rituals/        ← Rituals browser + detail
    │           ├── events/         ← Event CRUD + vendor bookings
    │           ├── dashboard/      ← Stats + overview
    │           └── auth/           ← Login + Register
    ├── angular.json
    ├── tsconfig.json
    └── package.json
```

---

## 🚀 QUICK START (Local Development)

### Prerequisites
- Node.js v18+
- MySQL 8.0+
- npm or yarn

---

### Step 1: MySQL Database Setup

```sql
-- Run in MySQL client (mysql -u root -p)
CREATE DATABASE wedding_planner;
CREATE USER 'weddinguser'@'localhost' IDENTIFIED BY 'yourpassword';
GRANT ALL PRIVILEGES ON wedding_planner.* TO 'weddinguser'@'localhost';
FLUSH PRIVILEGES;
```

---

### Step 2: Backend Setup

```bash
cd wedding-planner/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your values:
# DB_HOST=localhost
# DB_PORT=3306
# DB_USERNAME=weddinguser
# DB_PASSWORD=yourpassword
# DB_DATABASE=wedding_planner
# JWT_SECRET=your_super_secret_key_min_32_chars
# JWT_EXPIRES_IN=7d
# PORT=3000
# NODE_ENV=development

# Start development server
npm run start:dev
```

✅ Backend will run at: http://localhost:3000
✅ Swagger API docs: http://localhost:3000/api/docs
✅ Database tables auto-created by TypeORM
✅ States + Rituals auto-seeded on first run

---

### Step 3: Frontend Setup

```bash
cd wedding-planner/frontend

# Install dependencies
npm install

# Start development server
npm start
```

✅ Frontend will run at: http://localhost:4200

---

## 🌐 FREE DEPLOYMENT OPTIONS

### Option A: Railway.app (Recommended - Easiest)

**Backend on Railway:**
1. Go to https://railway.app → New Project
2. Connect your GitHub repo
3. Select the `backend` folder
4. Add environment variables (from .env)
5. Railway auto-detects NestJS and deploys
6. Add a MySQL database via Railway's plugin
7. Get your backend URL

**Frontend on Vercel:**
1. Go to https://vercel.com → New Project
2. Connect your GitHub repo
3. Set Root Directory to `frontend`
4. Set Build Command: `npm run build:prod`
5. Set Output Directory: `dist/wedding-planner/browser`
6. Add env var: `API_URL=https://your-railway-backend.railway.app/api`
7. Update `environment.prod.ts` with actual backend URL

---

### Option B: Render.com (Backend) + Netlify (Frontend)

**Backend on Render:**
1. Go to https://render.com → New Web Service
2. Connect GitHub, select backend folder
3. Build command: `npm install && npm run build`
4. Start command: `npm run start:prod`
5. Add environment variables
6. Add a free MySQL database (use Railway for MySQL, Render's is PostgreSQL)

**Alternative: Use PlanetScale (Free MySQL cloud)**
1. Sign up at https://planetscale.com
2. Create database "wedding_planner"
3. Get connection string
4. Use those credentials in your .env

**Frontend on Netlify:**
1. Go to https://netlify.com → Add New Site
2. Connect GitHub, select frontend folder
3. Build command: `npm run build:prod`
4. Publish directory: `dist/wedding-planner/browser`
5. Add redirect rule: create `frontend/public/_redirects` file with: `/* /index.html 200`

---

### Option C: Heroku (Backend) + GitHub Pages (Frontend)

**Backend on Heroku:**
```bash
cd backend
heroku create shaadi-vidhaan-api
heroku addons:create jawsdb:kitefin  # Free MySQL add-on
heroku config:set JWT_SECRET=your_secret NODE_ENV=production
git push heroku main
```

**Frontend as Static Site:**
```bash
cd frontend
# Update environment.prod.ts with Heroku backend URL
npm run build:prod
# Deploy dist/wedding-planner/browser to GitHub Pages or Netlify
```

---

## 📡 API ENDPOINTS REFERENCE

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login + get JWT |

### States
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/states | List all 15+ Indian states |
| GET | /api/states/:id | State details + rituals |
| GET | /api/states/code/:code | By state code (e.g., RJ) |

### Rituals
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/rituals | All rituals (filter by eventType, stateId) |
| GET | /api/rituals/:id | Ritual detail |
| GET | /api/rituals/event/:type | By event type |
| GET | /api/rituals/event-types | List all event types |

### Events (Protected 🔒)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/events | User's events |
| POST | /api/events | Create event |
| PUT | /api/events/:id | Update event |
| DELETE | /api/events/:id | Delete event |

### Bookings (Protected 🔒)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/bookings | User's bookings |
| POST | /api/bookings | Create booking |
| PUT | /api/bookings/:id | Update booking |
| DELETE | /api/bookings/:id | Delete booking |

---

## 🔧 SHARING YOUR WEBSITE

### Easy Sharing Links
After deployment:
- Your site URL: `https://shaadi-vidhaan.vercel.app` (customize)
- Share via WhatsApp, email, or social media
- Works perfectly on mobile, tablet, desktop

### Progressive Web App (Optional Enhancement)
Add to `frontend/src/manifest.json`:
```json
{
  "name": "Shaadi Vidhaan",
  "short_name": "ShaadiPlan",
  "icons": [{"src": "favicon.ico", "sizes": "64x64"}],
  "theme_color": "#B5002B",
  "background_color": "#FDF8F0",
  "display": "standalone"
}
```

---

## 🗓️ DATABASE SCHEMA

```
users         → id, name, email, password, phone, state, role
states        → id, name, code, language, region, culture, description
rituals       → id, name, localName, eventType, description, significance, 
                procedure, requiredItems, dayNumber, timing, isStateSpecific, stateId
events        → id, userId, name, type, eventDate, stateName, city, venue,
                guestCount, budget, status, selectedRituals, notes
bookings      → id, userId, serviceType, vendorName, serviceDate, amount, status, notes
```

---

## 🎊 FEATURES SUMMARY

✅ **15 Indian States** with unique cultural descriptions  
✅ **30+ Rituals** for Wedding, Engagement, Childbirth, Mundan  
✅ **State-specific rituals** (Rajasthan Baan Baithna, Punjab Chooda, etc.)  
✅ **Responsive design** (mobile, tablet, desktop)  
✅ **User authentication** with JWT  
✅ **Event planning & management**  
✅ **Vendor booking tracker**  
✅ **Budget tracking**  
✅ **Swagger API documentation**  
✅ **Auto-seeded database** on first run  

---

## 📞 NEXT STEPS TO ENHANCE

1. **Add more states** — edit `INDIAN_STATES` array in `states.service.ts`
2. **Add more rituals** — edit `RITUALS_SEED` array in `rituals.service.ts`  
3. **Add photo uploads** — integrate Cloudinary or AWS S3
4. **Add checklist** — create a `checklist` entity for tracking tasks
5. **Add SMS notifications** — integrate Twilio or MSG91
6. **Multilingual** — add i18n for Hindi, Tamil, Bengali
7. **Shaadi Calendar** — integrate with Google Calendar API
8. **Guest management** — RSVP tracking system

---

*Made with ❤️ for Indian culture — Jai Hind! 🇮🇳*
