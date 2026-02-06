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
│   │       ├── Availability (Tester)
│   │       ├── Playground
│   │       ├── Logs
│   │       └── Settings
│   └── Docs (Contextual)
```

---

# 1️⃣ LANDING PAGE (FOR DEVELOPERS)

**Purpose**: Position dispo.now as "Infrastructure", not "SaaS".

### Hero

```
The Self-Hosted Booking Infrastructure.
Stop paying the "SaaS Tax" for booking APIs.
```

**Sub**
> Own your data. Unlimited scale. ACID transactions.
> The open-source engine for high-performance scheduling.

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
👉 **New Project**

**Implementation Reference**:
*   `frontend/src/routes/dashboard/index.tsx`
*   `frontend/src/components/templates/DashboardTemplate.tsx`
*   `frontend/src/components/ui/organisms/ProjectEmptyState.tsx`

---

# 3️⃣ PROJECT LIST

Simple, boring, predictable:

```
Projects
────────────────────────────
• My SaaS App        → Open
• Internal Tools    → Open
```

**Implementation Reference**:
*   `frontend/src/routes/dashboard/index.tsx`
*   `frontend/src/components/ui/organisms/ProjectList.tsx`

---

# 4️⃣ PROJECT DETAIL (THE HEART)

This screen mirrors your **DX flow exactly**.

### Top Header

```
Project: My SaaS App
API Key: sk_live_********
[ Copy ] [ Rotate ]
```

⚠️ Show the API key, warn clearly (same as API.md )

**Implementation Reference**:
*   `frontend/src/routes/dashboard/project.tsx`
*   `frontend/src/components/templates/ProjectDetailTemplate.tsx`
*   `frontend/src/components/ui/organisms/ProjectHeader.tsx`

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
👉 **New Resource**

### Create Resource Modal

```json
{
  "name": "Conference Room A",
  "defaultCapacity": 10,
  "metadata": {
    "floor": 2,
    "type": "room"
  },
  "bookingConfig": {
     "daily": { "start": "09:00", "end": "18:00" }
  }
}
```

💡 Show:

* live Zod validation errors
* schema preview (read-only)

**Implementation Reference**:
*   `frontend/src/components/ui/organisms/ResourceList.tsx`
*   `frontend/src/components/ui/organisms/ResourceForm.tsx` (Zod validation here)

---

## 4.2 📅 BOOKINGS TAB (EXPLORER)

This is **not for end-users**, it’s for **developers testing behavior**.

### Controls

* Resource selector
* Time range picker
* Quantity input

### Result

* List view
* Status badges: `active` / `cancelled`

### Actions
* **Create Booking** (Single)
* **Create Group Booking** (Atomic)

### When capacity is exceeded:

```
❌ CapacityExceeded
This resource is fully booked for this time range.
```

Exactly matches your domain error model.

**Implementation Reference**:
*   `frontend/src/components/ui/organisms/BookingList.tsx`
*   `frontend/src/components/ui/organisms/BookingCreationPanel.tsx`
*   `frontend/src/components/ui/organisms/GroupBookingCreationPanel.tsx`

---

## 4.3 🧪 AVAILABILITY TAB (TESTER)

Visualizes availability slots based on capacity and configuration.

### Controls
* Resource selector
* Date picker
* Slot duration (e.g., 60 mins)

### Result
* Grid of time slots
* **Green**: Available
* **Red**: Booked / Closed

**Implementation Reference**:
*   `frontend/src/components/ui/organisms/AvailabilityViewer.tsx`

---

## 4.4 🧪 API PLAYGROUND (CRITICAL)

This is where onboarding becomes *effortless*.

### Left: Request Builder

```
POST /api/bookings
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

## 4.5 📜 LOGS TAB

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

## 4.6 📘 CONTEXTUAL DOCS

Docs should **change depending on where the dev is**.

Example:

* On Resources page → show **CreateResource** docs
* On Bookings page → show **Capacity rules**

This UI literally *teaches* the backend.

---

# 5️⃣ COMPONENT HIERARCHY

Strict Atomic Design structure enforced in `frontend/src/components/ui`:

### 🧬 Atoms (`/atoms`)
*   `Button.tsx`: Primary, secondary, danger actions.
*   `Input.tsx`: Standard text/number inputs.
*   `Select.tsx`: Dropdowns.
*   `Badge.tsx`: Status indicators (active/cancelled).
*   `Card.tsx`: Container for lists and forms.

### 🧬 Molecules (`/molecules`)
*   `ApiKeyDisplay.tsx`: Securely display/copy API keys.
*   `ProjectInfo.tsx`: Summary of project details.
*   `FormField.tsx`: Label + Input + Error wrapper.
*   `PageHeader.tsx`: Title + Action button.

### 🧬 Organisms (`/organisms`)
*   `ProjectList.tsx`: Grid of project cards.
*   `ProjectForm.tsx`: Create/Edit project logic.
*   `ResourceList.tsx`: List of resources with edit/delete actions.
*   `ResourceForm.tsx`: Complex form for Resource + Config + Metadata.
*   `BookingList.tsx`: Table of bookings for a resource.
*   `BookingCreationPanel.tsx`: Form to test single bookings.
*   `GroupBookingCreationPanel.tsx`: Form to test atomic group bookings.
*   `AvailabilityViewer.tsx`: Visual grid of available slots.

### 📄 Templates (`/templates`)
*   `DashboardTemplate.tsx`: Sidebar + Content area layout.
*   `ProjectDetailTemplate.tsx`: Project Header + Tabs layout.

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

# 7️⃣ TECH STACK SUGGESTION

* React + TanStack Router (File-based routing)
* React Query (Data fetching & caching)
* Tailwind CSS (Styling)
* Framer Motion (Subtle transitions)
* Lucide React (Icons)
* Date-fns (Date manipulation)

