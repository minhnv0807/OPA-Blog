# OPA Blog — API Documentation

**Base URL:** `https://opa.business`

---

## Authentication

### 2 cach xac thuc:

### 1. API Key (cho agent/external service)

Them header `Authorization` voi API key:

```
Authorization: Bearer <API_SECRET_KEY>
```

**Setup:**
1. Tao 1 key bat ky (VD: `openssl rand -hex 32` tren terminal)
2. Set env var `API_SECRET_KEY` tren Vercel (Project Settings > Environment Variables)
3. Redeploy WITHOUT build cache
4. Agent gui header `Authorization: Bearer <key>` la co quyen Admin

**Vi du curl:**
```bash
# Lay danh sach posts
curl https://opa.business/api/posts

# Tao bai viet moi (can auth)
curl -X POST https://opa.business/api/posts \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"title": "Bai viet moi", "content": "Noi dung...", "category": "CATEGORY_ID", "status": "published"}'

# Lay danh sach users (admin only)
curl https://opa.business/api/users \
  -H "Authorization: Bearer YOUR_API_KEY"

# Tao category
curl -X POST https://opa.business/api/categories \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name": "New Category", "color": "#ff6600"}'

# Xoa user
curl -X DELETE https://opa.business/api/users/USER_ID \
  -H "Authorization: Bearer YOUR_API_KEY"
```

**Vi du Python:**
```python
import requests

BASE = "https://opa.business"
HEADERS = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}

# Tao bai viet
res = requests.post(f"{BASE}/api/posts", headers=HEADERS, json={
    "title": "Bai viet tu Agent",
    "content": "# Hello\nNoi dung markdown...",
    "category": "CATEGORY_ID",
    "status": "published"
})
print(res.json())

# Lay tat ca categories
res = requests.get(f"{BASE}/api/categories")
print(res.json())
```

**Vi du JavaScript/Node:**
```javascript
const BASE = "https://opa.business";
const API_KEY = "YOUR_API_KEY";

// Tao bai viet
const res = await fetch(`${BASE}/api/posts`, {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${API_KEY}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    title: "Bai viet tu Agent",
    content: "# Hello\nNoi dung markdown...",
    category: "CATEGORY_ID",
    status: "published"
  })
});
const data = await res.json();
```

### 2. Session Cookie (cho browser user)

Login qua `/api/auth/callback/credentials` — NextAuth tu set cookie.

---

**Response Format:** Tat ca endpoints tra ve:
```json
{ "success": true, "data": ..., "pagination?": ... }
{ "success": false, "error": "message" }
```

---

## Workflow cho Agent

### Buoc 1: Lay categories truoc
```bash
curl https://opa.business/api/categories
```
→ Luu lai `_id` cua category de dung khi tao post.

### Buoc 2: Tao bai viet
```bash
curl -X POST https://opa.business/api/posts \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "10 Xu Huong AI 2026",
    "excerpt": "Tong hop xu huong AI noi bat nhat nam 2026",
    "content": "# 10 Xu Huong AI\n\n## 1. Agent AI\nNoi dung...",
    "category": "CATEGORY_ID_TU_BUOC_1",
    "coverImage": "https://images.unsplash.com/...",
    "status": "published"
  }'
```
→ `status: "published"` se tu dong gui email thong bao den tat ca subscribers.
→ `status: "draft"` chi luu nhap, khong gui email.

### Buoc 3: Quan ly noi dung
```bash
# Sua bai viet
curl -X PATCH https://opa.business/api/posts/POST_ID \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"title": "Tieu de moi", "status": "published"}'

# Xoa bai viet (soft delete → archived)
curl -X DELETE https://opa.business/api/posts/POST_ID \
  -H "Authorization: Bearer YOUR_API_KEY"
```

---

## Auth (Registration)

### POST /api/auth/register
Tao tai khoan moi.

| Field | Type | Required | Note |
|-------|------|----------|------|
| name | string | Yes | |
| email | string | Yes | Valid email |
| password | string | Yes | Min 6 chars |

**Response 201:**
```json
{
  "success": true,
  "data": { "id": "...", "name": "...", "email": "..." }
}
```

**Errors:** 400 (validation), 409 (email exists)

---

### POST /api/auth/callback/credentials
Login (NextAuth). Dung `fetch` voi NextAuth signIn flow.

| Field | Type | Required |
|-------|------|----------|
| email | string | Yes |
| password | string | Yes |

---

## Posts

### GET /api/posts
Lay danh sach bai viet (public, chi tra ve published).

| Query Param | Type | Default | Note |
|-------------|------|---------|------|
| page | int | 1 | Min 1 |
| limit | int | 9 | Max 50 |
| category | string | - | Filter by category slug |
| q | string | - | Search title/excerpt |

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "post_id",
      "title": "...",
      "slug": "...",
      "excerpt": "...",
      "content": "...",
      "coverImage": "https://...",
      "category": { "_id": "cat_id", "name": "...", "slug": "...", "color": "#hex" },
      "tags": [],
      "author": "user_id",
      "status": "published",
      "readingTime": 5,
      "views": 0,
      "featured": false,
      "publishedAt": "2026-03-23T...",
      "createdAt": "2026-03-23T...",
      "updatedAt": "2026-03-23T..."
    }
  ],
  "pagination": { "page": 1, "limit": 9, "total": 100, "totalPages": 12 }
}
```

Cached 60s. No cache when search/filter active.

---

### POST /api/posts
Tao bai viet moi. **Auth: Admin/Editor**

| Field | Type | Required | Note |
|-------|------|----------|------|
| title | string | Yes | Auto-generates slug |
| excerpt | string | No | |
| content | string | No | Markdown, auto-calculates readingTime |
| coverImage | string | No | URL |
| category | ObjectId | Yes | Category _id |
| tags | ObjectId[] | No | Array of Tag _ids |
| status | string | No | "draft" (default) or "published" |

**Response 201:**
```json
{ "success": true, "data": { /* full post object */ } }
```

**Side effects:**
- Invalidates cache `posts:*`
- If `status === "published"`: sends email to ALL newsletter subscribers

---

### GET /api/posts/:id
Lay chi tiet 1 bai viet. **Auth: None**

**Response 200:**
```json
{ "success": true, "data": { /* post with populated category, tags, author */ } }
```

**Error:** 404

---

### PATCH /api/posts/:id
Cap nhat bai viet. **Auth: Admin/Editor**

| Field | Type | Note |
|-------|------|------|
| title | string | |
| excerpt | string | |
| content | string | |
| coverImage | string | |
| category | ObjectId | |
| tags | ObjectId[] | |
| status | string | "draft", "published", "archived" |

**Response 200:**
```json
{ "success": true, "data": { /* updated post */ } }
```

If status changes to "published" and no publishedAt: auto-sets publishedAt.
Invalidates cache `posts:*`.

**Error:** 404

---

### DELETE /api/posts/:id
Xoa bai viet (soft delete → archived). **Auth: Admin/Editor**

**Response 200:**
```json
{ "success": true }
```

Invalidates cache `posts:*`.

**Error:** 404

---

## Comments

### GET /api/posts/:id/comments
Lay comments cua bai viet. **Auth: None**

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "comment_id",
      "post": "post_id",
      "user": { "_id": "...", "name": "...", "avatar": "...", "role": "user" },
      "content": "...",
      "createdAt": "2026-03-23T..."
    }
  ]
}
```

---

### POST /api/posts/:id/comments
Tao comment. **Auth: User (logged in)**

| Field | Type | Required | Note |
|-------|------|----------|------|
| content | string | Yes | Max 2000 chars |

**Response 201:**
```json
{ "success": true, "data": { /* comment with populated user */ } }
```

**Errors:** 401 (not logged in), 400 (empty or > 2000 chars)

---

## Categories

### GET /api/categories
Lay tat ca categories. **Auth: None**

**Response 200:**
```json
{
  "success": true,
  "data": [
    { "_id": "cat_id", "name": "AI & Machine Learning", "slug": "ai-machine-learning", "color": "#8b5cf6", "order": 0 }
  ]
}
```

Cached 300s. Sorted by `order` asc.

---

### POST /api/categories
Tao category moi. **Auth: Admin/Editor**

| Field | Type | Required | Note |
|-------|------|----------|------|
| name | string | Yes | Auto-generates slug |
| color | string | No | Hex color |
| order | number | No | Sort order |
| description | string | No | |

**Response 201:**
```json
{ "success": true, "data": { /* category */ } }
```

Invalidates cache `categories:*`.

---

### PATCH /api/categories/:id
Cap nhat category. **Auth: Admin/Editor**

| Field | Type | Note |
|-------|------|------|
| name | string | Auto-regenerates slug if provided |
| color | string | |
| order | number | |
| description | string | |

**Response 200:**
```json
{ "success": true, "data": { /* updated category */ } }
```

**Error:** 404

---

### DELETE /api/categories/:id
Xoa category. **Auth: Admin/Editor**

**Response 200:**
```json
{ "success": true }
```

**Error:** 404

---

## Tags

### GET /api/tags
Lay tat ca tags. **Auth: None**

**Response 200:**
```json
{
  "success": true,
  "data": [
    { "_id": "tag_id", "name": "React", "slug": "react" }
  ]
}
```

Sorted by name asc.

---

### POST /api/tags
Tao tag moi. **Auth: Admin/Editor**

| Field | Type | Required |
|-------|------|----------|
| name | string | Yes |

**Response 201:**
```json
{ "success": true, "data": { /* tag */ } }
```

**Error:** 400 (empty name)

---

### PATCH /api/tags/:id
Cap nhat tag. **Auth: Admin/Editor**

| Field | Type |
|-------|------|
| name | string |

Auto-regenerates slug. **Error:** 404

---

### DELETE /api/tags/:id
Xoa tag. **Auth: Admin/Editor**

**Response 200:**
```json
{ "success": true }
```

**Error:** 404

---

## Contact

### POST /api/contact
Gui form lien he. **Auth: None**

| Field | Type | Required | Note |
|-------|------|----------|------|
| name | string | Yes | |
| email | string | Yes | |
| message | string | Yes | Max 5000 chars |

**Response 201:**
```json
{ "success": true, "data": { "id": "contact_id" } }
```

**Side effect:** Sends email notification to admin.

**Errors:** 400 (missing fields, message > 5000)

---

### GET /api/contact
Lay danh sach tin nhan. **Auth: Admin/Editor**

| Query Param | Type | Default | Note |
|-------------|------|---------|------|
| page | int | 1 | |
| limit | int | 20 | Max 50 |
| status | string | - | "new", "read", "replied" |

**Response 200:**
```json
{
  "success": true,
  "data": [
    { "_id": "...", "name": "...", "email": "...", "message": "...", "status": "new", "createdAt": "..." }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 45, "totalPages": 3 }
}
```

---

### PATCH /api/contact/:id
Cap nhat trang thai tin nhan. **Auth: Admin/Editor**

| Field | Type | Required | Note |
|-------|------|----------|------|
| status | string | Yes | "new", "read", or "replied" only |

**Response 200:**
```json
{ "success": true, "data": { /* updated contact */ } }
```

**Error:** 404

---

### DELETE /api/contact/:id
Xoa tin nhan. **Auth: Admin/Editor**

**Response 200:**
```json
{ "success": true }
```

**Error:** 404

---

## Users

### GET /api/users
Lay danh sach users. **Auth: Admin only**

**Response 200:**
```json
{
  "success": true,
  "data": [
    { "_id": "...", "name": "...", "email": "...", "role": "admin|editor|user", "bio": "...", "avatar": "...", "createdAt": "..." }
  ]
}
```

Password excluded. Sorted by createdAt desc.

---

### PATCH /api/users/:id
Cap nhat user. **Auth: Admin only**

| Field | Type | Note |
|-------|------|------|
| name | string | |
| role | string | "admin" or "editor" only |
| bio | string | |
| avatar | string | |

**Response 200:**
```json
{ "success": true, "data": { /* updated user, no password */ } }
```

**Error:** 404

---

### DELETE /api/users/:id
Xoa user. **Auth: Admin only**

**Response 200:**
```json
{ "success": true }
```

**Error:** 404

---

## Newsletter

### POST /api/newsletter
Dang ky nhan tin. **Auth: None**

| Field | Type | Required |
|-------|------|----------|
| email | string | Yes (valid email) |

**Response 201 (new) / 200 (existing):**
```json
{ "success": true, "data": { "subscribed": true } }
```

**Side effects:**
- New subscriber: sends welcome email
- Existing inactive: reactivates (no email)
- Existing active: idempotent

**Errors:** 400 (missing/invalid email)

---

### GET /api/newsletter
Lay danh sach subscribers. **Auth: Admin/Editor**

**Response 200:**
```json
{
  "success": true,
  "data": [
    { "_id": "...", "email": "...", "active": true, "createdAt": "..." }
  ]
}
```

Only active subscribers. Sorted by createdAt desc.

---

## Auth Levels Summary

| Level | Endpoints |
|-------|-----------|
| **Public** | GET posts, GET post/:id, GET comments, GET categories, GET tags, POST register, POST contact, POST newsletter |
| **User+** | POST comments |
| **Admin/Editor** | POST/PATCH/DELETE posts, POST/PATCH/DELETE categories, POST/PATCH/DELETE tags, GET/PATCH/DELETE contact, GET newsletter |
| **Admin only** | GET/PATCH/DELETE users |

## Default Seed Data

- **Admin:** admin@opa.vn / admin123
- **Categories:** AI & Machine Learning (#8b5cf6), Marketing (#f59e0b), Technology (#155eef), Business (#22c55e), Tutorial (#ec4899)
