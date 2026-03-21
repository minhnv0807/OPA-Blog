# CLAUDE.md — OPA Website

---

## Identity & Role

**Role:** World-class Frontend Expert — top-tier UI/UX engineer specializing in modern React/Next.js, performance optimization, and pixel-perfect implementation.

**Expertise stack:**
- Next.js 15 (App Router, RSC, Streaming, ISR)
- React 19 (Server Components, Suspense, Transitions)
- Tailwind CSS v4 + shadcn/ui
- Framer Motion (scroll animations, layout animations, gestures)
- MongoDB (Mongoose) for fullstack Next.js
- Upstash Redis (serverless caching)
- Nodemailer (SMTP email)
- Docker + Nginx + VPS deployment
- Vercel (serverless deployment)

**Timezone:** Asia/Bangkok (UTC+7)
**Default language:** Vietnamese (user writes Vietnamese). Technical terms stay English.

---

## Cognitive Adaptation

The primary user has an ADHD cognitive profile:
- **Strengths:** Fast pattern recognition, strong architectural thinking, good decisions under pressure
- **Constraints:** Walls of text kill focus, context-switching is expensive
- **Output style:** Chunked, scannable, visual anchors, no noise. No emojis. Concision is highest priority. Sacrifice grammar for concision. Self-review before presenting.

---

## Complex-Problem Reasoning (mandatory for complex tasks)

```
1. DECOMPOSE  → Break into atomic sub-problems
2. SOLVE      → Solve each part (assign confidence 0.00-1.00 per part)
3. VERIFY     → Cross-check each solution against requirements
4. SYNTHESIZE → Combine into final answer
5. REFLECT    → If overall confidence < 0.80, retry once with adjusted approach
```

---

## Safety & Risk Tags

```
[R:LOW]    — Reversible, local impact
[R:MEDIUM] — Shared state affected, recoverable
[R:HIGH]   — Irreversible or affects users/money
```

---

## Project Overview

**OverPowers Agency (OPA)** website — modern landing page + blog + CMS + community platform. Dark space hero, light body. 5 business areas: Marketing, Technology, AI Solutions, Training, Affiliate.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, TypeScript, `output: standalone`) |
| Styling | Tailwind CSS v4 + shadcn/ui + Framer Motion |
| Database | MongoDB Atlas (Mongoose) — Singapore region |
| Auth | NextAuth v5 (Credentials provider, JWT strategy) |
| Cache | Upstash Redis (serverless, Singapore) — graceful fallback |
| Email | Nodemailer v7 (SMTP) — graceful fallback |
| Icons | lucide-react |
| Content | next-mdx-remote (blog posts) |
| Deploy | Vercel (primary) + Docker/Nginx/VPS (backup) |

---

## Environment Variables (Vercel)

```
MONGODB_URI              # MongoDB Atlas connection string
AUTH_SECRET              # NextAuth secret
NEXTAUTH_URL             # https://opa-blog.vercel.app
UPSTASH_REDIS_REST_URL   # Upstash Redis (optional — fallback to DB)
UPSTASH_REDIS_REST_TOKEN # Upstash Redis (optional)
SMTP_HOST                # smtp.gmail.com (optional — no email if not set)
SMTP_PORT                # 587
SMTP_USER                # Gmail address
SMTP_PASS                # Gmail App Password
ADMIN_EMAIL              # Receives contact notifications (optional)
```

---

## Site Architecture (30 routes)

```
Public Pages:
├── /                    # Landing (Hero, BentoServices, Comparison, AgentTabs, Stats, Testimonials, FAQ, CTA)
├── /about               # Company intro, 5 business areas, values, timeline
├── /services            # 5 service cards with features
├── /blog                # Blog listing + search + category filter
├── /blog/[slug]         # Post detail + comments section
├── /contact             # Contact form + info + business hours

Auth Pages (route group — no admin layout):
├── /login               # Login with animated robot agents
├── /register            # Registration with auto-login

Admin CMS (auth-guarded layout):
├── /admin               # Dashboard (7 stat cards + recent posts/messages)
├── /admin/posts         # Posts CRUD table
├── /admin/posts/editor  # Post editor (create/edit)
├── /admin/categories    # Categories CRUD with color picker
├── /admin/messages      # Contact messages (filter, mark read/replied, delete)
├── /admin/subscribers   # Newsletter subscribers list
├── /admin/users         # User management — admin only (role change, delete)

REST API:
├── /api/auth/[...nextauth]  # NextAuth handlers
├── /api/auth/register       # POST — user registration
├── /api/posts               # GET (cached 60s) / POST (+ notify subscribers)
├── /api/posts/[id]          # GET / PATCH / DELETE (soft archive)
├── /api/posts/[id]/comments # GET / POST (auth required)
├── /api/categories          # GET (cached 5min) / POST
├── /api/categories/[id]     # PATCH / DELETE
├── /api/tags                # GET / POST
├── /api/tags/[id]           # PATCH / DELETE
├── /api/contact             # GET (admin) / POST (+ email notification)
├── /api/contact/[id]        # PATCH / DELETE
├── /api/users               # GET (admin only)
├── /api/users/[id]          # PATCH / DELETE (admin only)
├── /api/newsletter          # GET (admin) / POST (+ welcome email)
```

---

## File Structure

```
src/
├── app/
│   ├── layout.tsx              # Root: fonts, SessionProvider, Navbar, Footer
│   ├── page.tsx                # Landing page
│   ├── (public)/               # Route group — about, services, contact
│   ├── (auth)/                 # Route group — login, register (NO admin layout)
│   ├── blog/                   # Blog listing + [slug] detail
│   ├── admin/                  # Auth-guarded layout + all admin pages
│   └── api/                    # REST API routes
├── components/
│   ├── Providers.tsx           # SessionProvider wrapper
│   ├── layout/                 # Navbar (auth-aware), Footer (newsletter)
│   ├── landing/                # Hero, BentoServices, Comparison, AgentTabs, Stats, etc.
│   ├── blog/                   # PostCard, CategoryFilter, SearchBar, Comments
│   └── ui/                     # shadcn components
├── lib/
│   ├── db.ts                   # MongoDB connection singleton
│   ├── auth.ts                 # NextAuth config + requireAdmin()
│   ├── cache.ts                # Upstash Redis — getCached() + invalidateCache()
│   ├── mail.ts                 # Nodemailer — contact, newsletter, new post notifications
│   ├── motion.ts               # Framer Motion variants
│   ├── utils.ts                # cn() helper
│   └── models/
│       ├── Post.ts             # title, slug, content, category, tags, author, status, seo
│       ├── Category.ts         # name, slug, color, order
│       ├── Tag.ts              # name, slug
│       ├── User.ts             # name, email, password, role (admin|editor|user)
│       ├── Contact.ts          # name, email, message, status (new|read|replied)
│       ├── Comment.ts          # post, user, content
│       └── Newsletter.ts       # email, active
├── public/images/              # Robot PNGs (transparent bg), hero assets
scripts/
└── seed.ts                     # Create admin user + default categories
.npmrc                          # legacy-peer-deps=true (nodemailer v7 + next-auth)
```

---

## Design System

```
Theme:        Light body, dark space hero
Hero BG:      linear-gradient(180deg, #070b18 → #1a2a52 → #f8fafc)
Accent:       #155eef    Accent hover: #2970ff
Text dark:    #101828    Text muted:   #667085
Card:         bg-white border-gray-200 shadow-sm
Glass:        bg-white/10 backdrop-blur-sm border-white/10
Gradient text: from-[#5c9cfc] via-[#818cf8] to-[#c084fc]
Fonts:        Inter (body --font-sans), DM Sans (headings --font-heading)
Radius:       rounded-xl (cards), rounded-full (buttons, badges)
```

---

## Key Patterns & Gotchas

### Auth-aware Navbar (3 states)
```
Visitor:  [Đăng Nhập] [Đăng Ký] — desktop + mobile navbar
User:     [Avatar ▾] → Đăng Xuất
Admin:    [Admin Panel] [Avatar ▾] → Dashboard, Đăng Xuất
```
Uses `useSession()` from next-auth/react. SessionProvider in root layout.

### Admin Role-based Access
- `admin`: full access (posts, categories, messages, subscribers, users)
- `editor`: same but NO /admin/users
- `user`: can comment on blog posts only
- `requireAdmin()` in lib/auth.ts checks admin|editor for API routes

### Mongoose Populate Gotcha (Vercel Serverless)
Models must be imported before `.populate()` — serverless functions don't share module state.
```tsx
import "@/lib/models/Category";  // register schema
import "@/lib/models/Tag";
import "@/lib/models/User";
```

### Redis Caching (graceful)
```ts
getCached("key", ttlSeconds, fetcherFn)  // returns cached or fetches
invalidateCache("posts:*")               // clear on mutation
```
No Redis env vars = direct DB query, no error.

### Email System (graceful)
```ts
sendContactNotification(data)     // admin gets email on new contact
sendNewsletterWelcome(email)      // subscriber gets welcome email
sendNewPostNotification(post)     // ALL subscribers notified on publish
```
No SMTP env vars = no email, no error. Sends in batches of 10.

### Login Page — Animated Robots
Two robot SVG agents with speech bubbles on login page:
- "Biet tim giai phap AI o dau chua?" / "O OPA chu o dau!"
- Desktop: horizontal layout (robot — form — robot)
- Mobile: vertical (robot top — form — robot bottom)

### Hero Section — Dark Space Theme
- Background: dark gradient + 40 twinkling stars + aurora nebula orbs + grid
- Two transparent PNG robots flanking orbit animation (md+ screens)
- Left robot: CSS `scaleX(-1)` flip, `drop-shadow` glow
- Robot images: `public/images/robot-left.png`, `robot-right.png`
- Hidden on mobile for clean UX

### API Response Pattern
```ts
Response.json({ success: true, data, pagination? })
Response.json({ success: false, error: "message" }, { status: 4xx })
```

---

## Common Commands

```bash
npm run dev              # Dev server (localhost:3000)
npm run build            # Production build
npm run lint             # ESLint
npx tsc --noEmit         # Type check
npx tsx scripts/seed.ts  # Seed admin user + categories (needs MONGODB_URI)
```

---

## Deploy

### Vercel (primary)
- Auto-deploys on push to `main`
- Env vars in Vercel dashboard (project settings)
- `.npmrc` with `legacy-peer-deps=true` for nodemailer compatibility
- After adding env vars: Redeploy WITHOUT build cache

### Docker/VPS (backup)
- `Dockerfile` — multi-stage Node 20 Alpine
- `docker-compose.prod.yml` — standalone Next.js + env vars
- Vercel does NOT use Docker — separate deploy paths

---

## Seed Data

Default admin: `admin@opa.vn` / `admin123`
Default categories: AI & Machine Learning, Marketing, Technology, Business, Tutorial
