# API Reference

**Base URL**: `/`
**Version**: `1.1.0-beta`
**Content-Type**: `application/json`

---

## Authentication

The API supports two authentication methods depending on the endpoint:

1.  **Bearer Authentication** (Dashboard / Management)
    *   Used for User and Project management.
    *   Header: `Authorization: Bearer <token>`
    *   Obtain token via `/api/users/login`.

2.  **API Key Authentication** (Runtime / Integration)
    *   Used for Resource and Booking operations.
    *   Header: `x-api-key: <your-project-api-key>`
    *   Obtain API Key upon Project creation.

---

## 1. Users

### Create Account
Register a new user account.

*   **POST** `/api/users`
*   **Auth**: Public

**Request Body** (`CreateUserRequest`):
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (201 Created)** (`User`):
```json
{
  "id": "user_123",
  "email": "user@example.com"
}
```

### Login
Authenticate and receive a Bearer token.

*   **POST** `/api/users/login`
*   **Auth**: Public

**Request Body** (`LoginRequest`):
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK)** (`LoginResponse`):
```json
{
  "token": "eyJhbGciOiJIUzI1Ni..."
}
```

---

## 2. Projects

### Create Project
Initialize a new project tenant. Returns the API Key once.

*   **POST** `/api/projects`
*   **Auth**: Bearer Token

**Request Body** (`CreateProjectRequest`):
```json
{
  "name": "My SaaS Tenant",
  "metadata": {
    "plan": "premium"
  }
}
```

**Response (201 Created)** (`CreateProjectResponse`):
```json
{
  "id": "proj_123",
  "name": "My SaaS Tenant",
  "metadata": { "plan": "premium" },
  "apiKey": "sk_live_..."
}
```
> **Warning**: Store the `apiKey` securely. It is not retrievable later.

### List Projects
Get all projects for the authenticated user.

*   **GET** `/api/projects`
*   **Auth**: Bearer Token

**Response (200 OK)** (`Array<Project>`):
```json
[
  {
    "id": "proj_123",
    "name": "My SaaS Tenant",
    "metadata": { "plan": "premium" }
  }
]
```

### Update Project
Update project details.

*   **PATCH** `/api/projects/{id}`
*   **Auth**: Bearer Token

**Request Body** (`UpdateProjectRequest`):
```json
{
  "name": "New Project Name",
  "metadata": { "plan": "enterprise" }
}
```

**Response (200 OK)** (`Project`):
```json
{
  "id": "proj_123",
  "name": "New Project Name",
  "metadata": { "plan": "enterprise" }
}
```

### Delete Project
Permanently remove a project.

*   **DELETE** `/api/projects/{id}`
*   **Auth**: Bearer Token

**Response (200 OK)**:
```json
{
  "status": "deleted",
  "id": "proj_123"
}
```

---

## 3. Resources

### Create Resource
Define a bookable asset.

*   **POST** `/api/resources`
*   **Auth**: API Key (`x-api-key`)

**Request Body** (`CreateResourceRequest`):
```json
{
  "projectId": "proj_123",
  "name": "Conference Room A",
  "defaultCapacity": 10,
  "metadata": { "type": "room" },
  "bookingConfig": {
    "daily": {
      "start": "09:00",
      "end": "18:00"
    },
    "weekly": {
      "availableDays": [1, 2, 3, 4, 5]
    }
  }
}
```

**Response (201 Created)** (`Resource`):
```json
{
  "id": "res_123",
  "projectId": "proj_123",
  "name": "Conference Room A",
  "defaultCapacity": 10,
  "metadata": { "type": "room" },
  "bookingConfig": { ... }
}
```

### Update Resource
Update resource configuration.

*   **PATCH** `/api/resources/{id}`
*   **Auth**: API Key (`x-api-key`)

**Request Body** (`UpdateResourceRequest`):
```json
{
  "name": "Updated Name",
  "defaultCapacity": 15
}
```

**Response (200 OK)** (`Resource`):
```json
{
  "id": "res_123",
  ...
}
```

### Delete Resource
Permanently remove a resource.

*   **DELETE** `/api/resources/{id}`
*   **Auth**: API Key (`x-api-key`)

**Response (200 OK)**:
```json
{
  "status": "deleted",
  "id": "res_123"
}
```

### Get Availability
Get available time slots for a resource.

*   **GET** `/api/resources/{id}/availability`
*   **Auth**: API Key (`x-api-key`)
*   **Query Parameters**:
    *   `start` (required): ISO8601 Date
    *   `end` (required): ISO8601 Date
    *   `slotDurationMinutes` (optional, default 60): Duration of each slot in minutes.

**Response (200 OK)**:
```json
[
  {
    "start": "2024-01-01T09:00:00.000Z",
    "end": "2024-01-01T10:00:00.000Z",
    "available": 5
  },
  {
    "start": "2024-01-01T10:00:00.000Z",
    "end": "2024-01-01T11:00:00.000Z",
    "available": 3
  }
]
```

---

## 4. Bookings

### Create Booking
Reserve a resource.

*   **POST** `/api/bookings`
*   **Auth**: API Key (`x-api-key`)

**Request Body** (`BookingCreateRequest`):
```json
{
  "projectId": "proj_123", // Optional if inferred from API Key context
  "resourceId": "res_123",
  "start": "2024-01-01T10:00:00Z",
  "end": "2024-01-01T11:00:00Z",
  "quantity": 1,
  "capacity": 10, // Optional override
  "metadata": { "user": "alice" }
}
```

**Response (201 Created)** (`BookingResponse`):
```json
{
  "id": "book_123",
  "status": "active",
  "timeRange": {
    "start": "2024-01-01T10:00:00.000Z",
    "end": "2024-01-01T11:00:00.000Z"
  }
}
```

### Create Group Booking
Atomically create multiple bookings. If one fails, all fail.

*   **POST** `/api/bookings/group`
*   **Auth**: API Key (`x-api-key`)

**Request Body** (`GroupBookingCreateRequest`):
```json
{
  "projectId": "proj_123",
  "bookings": [
    {
      "resourceId": "res_A",
      "start": "2024-01-01T10:00:00Z",
      "end": "2024-01-01T11:00:00Z",
      "quantity": 1
    },
    {
      "resourceId": "res_B",
      "start": "2024-01-01T10:00:00Z",
      "end": "2024-01-01T11:00:00Z",
      "quantity": 2
    }
  ]
}
```

**Response (201 Created)**:
```json
[
  "book_123",
  "book_124"
]
```

### Create Recurring Booking
Atomically create a series of bookings based on a recurrence rule. If any slot in the series fails, the entire series fails.

*   **POST** `/api/bookings/recurring`
*   **Auth**: API Key (`x-api-key`)

**Request Body**:
```json
{
  "projectId": "proj_123",
  "resourceId": "res_123",
  "start": "2024-02-01T10:00:00Z", // Start of the first slot
  "end": "2024-02-01T11:00:00Z",   // End of the first slot
  "quantity": 1,
  "recurrence": {
    "frequency": "daily", // daily, weekly, monthly
    "interval": 1,        // e.g. every 1 day
    "count": 5            // Repeat 5 times
    // OR "until": "2024-03-01T00:00:00Z"
    // OR "byWeekDays": [1, 3] // Mon, Wed (for weekly)
  },
  "metadata": { "series": "Team Standup" }
}
```

**Response (201 Created)**:
```json
[
  "book_123",
  "book_124",
  "book_125",
  "book_126",
  "book_127"
]
```
