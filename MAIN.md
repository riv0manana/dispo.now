# dispo.now — CORE DOCUMENT

## 1. CORE VALUES

1.  **Universality**
    One engine for any bookable resource. The system is agnostic to what is being booked (rooms, equipment, time slots).

2.  **Resource Agnosticism**
    The system only understands `resourceId` and `projectId`. Domain modeling is generic.

3.  **Deterministic Allocation**
    Allocation rules (Capacity, Time Ranges) are strictly enforced via Domain Policies.

4.  **Capacity Safety**
    Overbooking is impossible.
    *   **Atomicity**: Group bookings either fully succeed or fully fail (All-or-Nothing).
    *   **Concurrency**: Database transactions ensure integrity under load.

5.  **DDD Purity**
    *   **Core/Domain**: Pure logic, Zod schemas, no dependencies.
    *   **Core/Application**: Use cases & Ports.
    *   **Infrastructure**: Adapters (Drizzle, Hono).
    *   **App**: Composition root & API.

6.  **Single Validation Source**
    Zod schemas in `core/domain` define the absolute truth for Domain logic, API validation, and Frontend forms.

---

## 2. CORE CONCEPTS

### 2.1 Project
A tenant or grouping entity that owns resources.
*   **Identity**: `id` (UUID).
*   **Auth**: Has a `metadata` field. Generates an `apiKey` upon creation for runtime access.
*   **Schema**: `core/domain/project/Project.schema.ts`

### 2.2 Resource
Any bookable entity belonging to a Project.
*   **Identity**: `id` (UUID), `projectId`.
*   **Configuration**:
    *   `defaultCapacity`: Base capacity (default 1).
    *   `bookingConfig`: Defines `daily` (hours) and `weekly` (days) availability rules.
*   **Schema**: `core/domain/resource/Resource.schema.ts`

### 2.3 Booking
A reservation of a resource over a specific time range.
*   **Identity**: `id` (UUID), `resourceId`, `projectId`.
*   **Time**: `timeRange` ({ start, end }).
*   **Status**: `active` | `cancelled`.
*   **Schema**: `core/domain/booking/Booking.schema.ts`

---

## 3. DOMAIN LAYER (`core/domain`)

The Domain layer is pure TypeScript/Zod. It contains no side effects.

### 3.1 Schemas & Value Objects
*   **TimeRange**: Validates `start < end`.
*   **Capacity**: Validates positive integers.
*   **BookingConfig**: Validates opening hours (`HH:MM`) and days of week (0-6).

### 3.2 Policies
*   **CapacityPolicy**: Asserts that `existing_bookings + requested <= capacity`.
*   **BookingConfigPolicy**: Asserts that a booking fits within the Resource's operating hours and days.

---

## 4. APPLICATION LAYER (`core/application`)

Contains Use Cases that orchestrate domain logic and persist state via Ports.

### 4.1 Use Cases
*   **Authentication**: `CreateUser`, `LoginUser`, `VerifyApiKey`.
*   **Projects**: `CreateProject`, `GetProjects`, `UpdateProject`, `DeleteProject`.
*   **Resources**: `CreateResource`, `GetResources` (List), `UpdateResource`, `DeleteResource`.
*   **Bookings**:
    *   `CreateBooking`: Single resource reservation.
    *   `CreateGroupBooking`: **Atomic** multi-resource reservation. Validates all or fails all.
    *   `CreateRecurringBooking`: **Atomic** recurring series reservation. Expands recurrence rule into multiple bookings.
    *   `GetBookings`: List bookings for a resource (with time range filter).
    *   `CancelBooking`: Soft-cancel a booking.

### 4.2 Ports (Interfaces)
*   **Repositories**: `UserRepository`, `ProjectRepository`, `ResourceRepository`, `BookingRepository`.
*   **Services**: `IdGenerator`, `PasswordService`, `TokenService`, `ApiKeyGenerator`.

---

## 5. INFRASTRUCTURE LAYER (`core/infrastructure`)

*   **Database**: PostgreSQL.
*   **ORM**: Drizzle ORM (`drizzle-orm`).
*   **Repositories**: Concrete implementations (e.g., `DrizzleBookingRepository`).
*   **Transactions**: Used explicitly in `CreateGroupBookingUseCase` to ensure atomicity.

---

## 6. API LAYER (`app`)

The API is built with **Hono** running on **Deno**.

### 6.1 Authentication Strategy (Hybrid)
Implemented via `hybridAuthMiddleware`.

1.  **Bearer Auth** (Management):
    *   Header: `Authorization: Bearer <token>`
    *   Scope: User & Project Management.
    *   Context: `projectId` is derived from the User's ownership.

2.  **API Key Auth** (Runtime):
    *   Header: `x-api-key: <project_api_key>`
    *   Scope: Resource & Booking operations.
    *   Context: `projectId` is derived directly from the API Key.

### 6.2 Endpoints (REST)

**Users**
*   `POST /api/users` (Sign up)
*   `POST /api/users/login` (Login)

**Projects** (Bearer Auth)
*   `POST /api/projects`
*   `GET /api/projects`
*   `PATCH /api/projects/:id`
*   `DELETE /api/projects/:id`

**Resources** (Hybrid/API Key)
*   `POST /api/resources`
*   `GET /api/resources` (List all for project)
*   `PATCH /api/resources/:id`
*   `DELETE /api/resources/:id`
*   `GET /api/resources/:resourceId/api/bookings` (List bookings)

**Bookings** (Hybrid/API Key)
*   `POST /api/bookings` (Create Single)
*   `POST /api/bookings/group` (Create Atomic Group)
*   `POST /api/bookings/recurring` (Create Atomic Recurring Series)
*   `POST /api/bookings/:id/cancel` (Cancel)

### 6.3 OpenAPI
*   Routes defined using `@hono/zod-openapi`.
*   Validation is strictly tied to Zod schemas shared with the Core.

### 6.4 Model Context Protocol (MCP)
*   **Purpose**: Native integration with AI Agents (LLMs).
*   **Protocol**: MCP (Model Context Protocol) via SSE (Server-Sent Events).
*   **Activation**: Enabled via `MCP_SERVER` environment variable.
*   **Capabilities**: Exposes Core Use Cases (`CreateBooking`, `GetResources`, etc.) as AI-callable Tools.

---

## 7. DEPLOYMENT

*   **Runtime**: Deno.
*   **Container**: Docker (Multi-stage).
*   **Orchestration**: Docker Compose (App + Postgres).
*   **Dependency Injection**: `ioctopus` container for wiring Core, Infra, and App.

---

## 8. GUARANTEES

*   **Atomicity**: Group bookings use DB transactions.
*   **Consistency**: Capacity checks include pending items in the same transaction/request.
*   **Isolation**: All data is strictly scoped to `projectId`.
*   **Validation**: Impossible to persist invalid state (Zod guards all entry points).
