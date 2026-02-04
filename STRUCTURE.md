This structure is **non-negotiable** and maps **1:1** to the document MAIN.md:

* Zod-based domain
* DDD separation
* Core is backend-agnostic
* Infra is adapter-based
* App is Hono (Deno)
* Ioctopus for DI
* Tests colocated with core logic

No guessing. No optional folders.

---

# PROJECT STRUCTURE (AUTHORITATIVE)

```txt
dispo.now/
│
├─ core/                             # BACKEND-AGNOSTIC KERNEL
│  │
│  ├─ domain/                         # PURE DOMAIN (ZOD + PURE LOGIC)
│  │  │
│  │  ├─ project/
│  │  │  ├─ Project.schema.ts
│  │  │
│  │  ├─ resource/
│  │  │  ├─ Resource.schema.ts
│  │  │
│  │  ├─ booking/
│  │  │  ├─ Booking.schema.ts
│  │  │  ├─ Booking.logic.ts
│  │  │
│  │  ├─ time-range/
│  │  │  ├─ TimeRange.schema.ts
│  │  │  ├─ TimeRange.logic.ts        # overlaps()
│  │  │
│  │  ├─ capacity/
│  │  │  ├─ Capacity.schema.ts
│  │  │
│  │  ├─ recurrence/
│  │  │  ├─ Recurrence.schema.ts
│  │  │  ├─ Recurrence.logic.ts
│  │  │
│  │  ├─ user/
│  │  │  ├─ User.schema.ts
│  │  │
│  │  ├─ policy/
│  │  │  ├─ CapacityPolicy.ts
│  │  │  ├─ BookingConfigPolicy.ts
│  │  │
│  │  └─ index.ts                     # domain public exports
│  │
│  ├─ application/                    # USE CASES + PORTS
│  │  │
│  │  ├─ ports/                       # INTERFACES (PORTS)
│  │  │  ├─ BookingRepository.ts
│  │  │  ├─ ProjectRepository.ts
│  │  │  ├─ ResourceRepository.ts
│  │  │  ├─ UserRepository.ts
│  │  │  ├─ IdGenerator.ts
│  │  │  ├─ PasswordService.ts
│  │  │  ├─ TokenService.ts
│  │  │  ├─ ApiKeyGenerator.ts
│  │  │
│  │  ├─ usecases/                    # APPLICATION SERVICES
│  │  │  ├─ CreateUserUseCase.ts
│  │  │  ├─ LoginUserUseCase.ts
│  │  │  ├─ CreateProjectUseCase.ts
│  │  │  ├─ GetProjectsUseCase.ts
│  │  │  ├─ UpdateProjectUseCase.ts
│  │  │  ├─ DeleteProjectUseCase.ts
│  │  │  ├─ CreateResourceUseCase.ts
│  │  │  ├─ GetResourcesUseCase.ts
│  │  │  ├─ UpdateResourceUseCase.ts
│  │  │  ├─ DeleteResourceUseCase.ts
│  │  │  ├─ CreateBookingUseCase.ts
│  │  │  ├─ CreateGroupBookingUseCase.ts
│  │  │  ├─ CreateRecurringBookingUseCase.ts
│  │  │  ├─ GetBookingsUseCase.ts
│  │  │  ├─ GetAvailabilityUseCase.ts
│  │  │  ├─ CancelBookingUseCase.ts
│  │  │  ├─ VerifyApiKeyUseCase.ts
│  │  │
│  │  └─ index.ts                     # application exports
│  │
│  ├─ tests/                          # CORE TESTS (NO INFRA)
│  │  │
│  │  ├─ fakes/
│  │  │  ├─ FakeBookingRepository.ts
│  │  │  ├─ FakeProjectRepository.ts
│  │  │  ├─ FakeResourceRepository.ts
│  │  │  ├─ FakeUserRepository.ts
│  │  │  ├─ FakePasswordService.ts
│  │  │  ├─ FakeTokenService.ts
│  │  │
│  │  ├─ usecases/
│  │  │  ├─ CreateProjectUseCase.test.ts
│  │  │  ├─ CreateResourceUseCase.test.ts
│  │  │  ├─ CreateBookingUseCase.test.ts
│  │  │  ├─ CreateBookingScenarios.test.ts
│  │  │  ├─ GroupBooking.test.ts
│  │  │  ├─ CancelBookingUseCase.test.ts
│  │  │  ├─ Security.test.ts
│  │  │  ├─ ... (other use case tests)
│  │  │
│  │  ├─ domain/
│  │  │  ├─ TimeRange.test.ts
│  │  │  ├─ CapacityPolicy.test.ts
│  │  │  ├─ Validation.test.ts
│  │  │
│  │  └─ index.ts                        # core public API
│  │
│  └─ container/                         # DEPENDENCY INJECTION
│     │
│     ├─ container.ts                    # Ioctopus bindings
│     │
│     └─ index.ts
│
├─ infrastructure/                    # ADAPTERS (TECH-SPECIFIC)
│  │
│  ├─ database/
│  │  ├─ postgres/
│  │  │  ├─ drizzle/                 # migrations
│  │  │  ├─ schema.ts                # drizzle schemas
│  │  │
│  │  ├─ client.ts                   # drizzle postgres client
│  │
│  ├─ repositories/
│  │  ├─ DrizzleBookingRepository.ts
│  │  ├─ DrizzleProjectRepository.ts
│  │  ├─ DrizzleResourceRepository.ts
│  │  ├─ DrizzleUserRepository.ts
│  │
│  ├─ services/
│  │  ├─ BcryptPasswordService.ts
│  │  ├─ HonoJwtTokenService.ts
│  │
│  └─ index.ts                        # infra exports
│
├─ app/                               # APPLICATION ENTRY (DENO + HONO)
│  │
│  ├─ http/
│  │  ├─ routes/
│  │  │  ├─ bookings.ts               # HTTP → use cases
│  │  │  ├─ projects.ts
│  │  │  ├─ resources.ts
│  │  │  ├─ users.ts
│  │  │
│  │  ├─ middlewares/
│  │  │  ├─ apiKey.ts
│  │  │  ├─ auth.ts
│  │  │  ├─ hybridAuth.ts
│  │  │
│  │  ├─ http.ts                      # hono instance
│  │  ├─ openapi.ts                   # swagger config
│  │  ├─ types.ts
│  │  ├─ zod.ts                       # zod config
│  │
│  ├─ tests/                          # E2E TESTS
│  │  ├─ e2e.test.ts
│  │  ├─ e2e_features.test.ts
│  │
│  ├─ server.ts                       # bootstrap server
│  │
│  └─ index.ts
│
├─ frontend/                          # REACT UI
│  ├─ src/
│  │  ├─ components/
│  │  ├─ lib/
│  │  ├─ routes/
│  │  ├─ main.tsx
│  │
│  ├─ package.json
│  ├─ vite.config.ts
│
├─ scripts/
│  ├─ migrate.ts                      # drizzle migrations
│  ├─ seed_user.ts
│  ├─ verify_e2e.ts
│
├─ deno.json
├─ deno.lock
├─ package.json                      # for tooling / shared deps
├─ tsconfig.json
└─ README.md                         # references core document
```

---

## STRUCTURE RULES (MANDATORY)

### 1. `core/` RULES

* **No framework imports**
* **No HTTP**
* **No DB**
* **No DI container**
* Zod is the only validation system
* Pure logic only

---

### 2. `domain/`

* Zod schemas only
* Domain logic as pure functions
* No side effects
* No persistence

---

### 3. `application/`

* Use cases depend only on:
  * domain
  * ports
* No infrastructure imports
* No zod schemas defined here (only used)

---

### 4. `tests/`

* Tests run without DB
* Fake repositories only
* 100% deterministic

---

### 5. `infrastructure/`

* Adapters only
* Mapping Zod ↔ DB rows
* No domain rules implemented here

---

### 6. `container/`

* Single Ioctopus container
* No decorators
* Explicit bindings only

---

### 7. `app/`

* Deno runtime
* Hono HTTP only
* No domain logic
* No DB queries
* Orchestrates use cases only

---

## FILE OWNERSHIP SUMMARY

| Folder         | Owns           |
| -------------- | -------------- |
| domain         | Business rules |
| application    | Use cases      |
| tests          | Guarantees     |
| infrastructure | Persistence    |
| container      | Wiring         |
| app            | Delivery       |
| frontend       | Consumption    |

---

## GUARANTEE

This structure ensures:

* Zero ambiguity
* Enforced DDD
* Clean handover
* Easy onboarding
* Safe scaling

