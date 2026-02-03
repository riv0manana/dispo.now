# 🎯 Goal of the UI

> A developer should be able to:
> **understand the mental model in 5 minutes**
> **create a project + resource + booking in 10 minutes**
> **copy/paste working code without reading the docs**

---

# 🧭 UI STRUCTURE (HIGH LEVEL)

```
dispo.now Developer Console
├── Landing (DX-first marketing)
├── Auth (email + password)
├── Dashboard
│   ├── Projects
│   │   └── Project Detail
│   │       ├── API Keys
│   │       ├── Resources
│   │       ├── Bookings (Explorer)
│   │       ├── Playground
│   │       ├── Logs
│   │       └── Settings
│   └── Docs (Contextual)
```

---

# 1️⃣ LANDING PAGE (FOR DEVELOPERS)

**Purpose**: explain *what it is* in one screen.

### Hero

```
dispo.now
The Headless Booking engine for your product.
No overbooking. Ever.
```

**Sub**

> Book anything. Rooms, people, assets, time slots.
> Deterministic. Capacity-safe. Headless.

### Code snippet (THIS IS IMPORTANT)

```ts
await createBooking({
  resourceId: "room-a",
  start: "2026-02-01T10:00:00Z",
  end: "2026-02-01T11:00:00Z",
  quantity: 1
})
```

Buttons:

* **Get API Key**
* **Read the Docs**

This matches your **DX philosophy** 

---

# 2️⃣ DASHBOARD (AFTER LOGIN)

### Empty state (first login)

```
👋 Welcome to dispo.now

Step 1 — Create your first Project
A Project represents your app / tenant / SaaS customer.
```

Button:
👉 **Create Project**

---

# 3️⃣ PROJECT LIST

Simple, boring, predictable (this is good):

```
Projects
────────────────────────────
• My SaaS App        → Open
• Internal Tools    → Open
```

---

# 4️⃣ PROJECT DETAIL (THE HEART)

This screen mirrors your **DX flow exactly**.

### Top Header

```
Project: My SaaS App
API Key: sk_live_********
[ Copy ] [ Rotate ]
```

⚠️ Show the API key **once**, warn clearly (same as API.md )

---

## 4.1 📦 RESOURCES TAB

This is step 2 in DX.

### Empty state

```
No resources yet.

Resources are the things you can book.
Rooms, cars, doctors, machines, time slots.
```

Button:
👉 **Create Resource**

### Create Resource Modal

```json
{
  "name": "Conference Room A",
  "defaultCapacity": 10,
  "metadata": {
    "floor": 2,
    "type": "room"
  }
}
```

💡 Show:

* live Zod validation errors
* schema preview (read-only)

This reinforces:

> **Zod = single source of truth** 

---

## 4.2 📅 BOOKINGS TAB (EXPLORER)

This is **not for end-users**, it’s for **developers testing behavior**.

### Controls

* Resource selector
* Time range picker
* Quantity input

### Result

* Timeline view
* List view
* Status badges: `active` / `cancelled`

### When capacity is exceeded:

```
❌ CapacityExceeded
This resource is fully booked for this time range.
```

Exactly matches your domain error model.

---

## 4.3 🧪 API PLAYGROUND (CRITICAL)

This is where onboarding becomes *effortless*.

### Left: Request Builder

```
POST /bookings
Headers:
x-api-key: sk_live_...

Body:
{
  "resourceId": "res_123",
  "start": "...",
  "end": "...",
  "quantity": 1
}
```

### Right: Response

```json
{
  "id": "book_789",
  "status": "active"
}
```

### Bonus (huge DX win)

Tabs for:

* **curl**
* **fetch**
* **axios**
* **Deno**
* **Node**

Generated automatically.

---

## 4.4 📜 LOGS TAB

Developers *love* this.

```
[10:02:11] CreateBooking → OK
[10:02:14] CreateBooking → CapacityExceeded
[10:03:01] CancelBooking → OK
```

Each log expandable:

* request
* response
* error code

---

## 4.5 📘 CONTEXTUAL DOCS

Docs should **change depending on where the dev is**.

Example:

* On Resources page → show **CreateResource** docs
* On Bookings page → show **Capacity rules**

This UI literally *teaches* the backend.

---

# 5️⃣ ONBOARDING CHECKLIST (TOP RIGHT)

Sticky progress indicator:

```
✓ Create Project
✓ Create Resource
⬜ Create Booking
⬜ Handle CapacityExceeded
```

When all done:
🎉 **You’re production-ready**

---

# 6️⃣ DESIGN PRINCIPLES (VERY IMPORTANT)

* Dark mode first (developers)
* Monospace for payloads
* No marketing fluff inside app
* Predictable layout
* Zero animations unless meaningful

Think:
**Stripe Dashboard**
**Supabase Studio**
**PlanetScale**

---

# 7️⃣ TECH STACK SUGGESTION (OPTIONAL)

Since you’re already Vite + React:

* React + TanStack Router
* React Query
* Monaco Editor (payloads)
* Zod schemas imported directly from `core`
* Same types everywhere (true full-stack TS)
* framer-motion: landing page design, auto animated presentation block guide

---

## 🚀 Result

With this UI:

* Your backend feels **simple**, not strict
* Developers understand **Project → Resource → Booking** instantly
* Capacity rules become obvious, not scary
* dispo.now feels **enterprise-grade**, not “just an API”

