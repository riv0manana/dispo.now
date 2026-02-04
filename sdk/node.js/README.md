# @riv0manana/dispo-now-sdk

Official Node.js SDK for **dispo.now** - The Headless Booking Engine.

## Installation

```bash
npm install @riv0manana/dispo-now-sdk
# or
yarn add @riv0manana/dispo-now-sdk
```

## Usage

### 1. Initialization

You can initialize the client with your `apiKey`. This is the most common server-side usage pattern.

```typescript
import { DispoClient } from '@riv0manana/dispo-now-sdk';

const dispo = new DispoClient({
  baseURL: 'https://your-dispo-instance.com', // Defaults to http://localhost:8000
  apiKey: 'sk_live_...' // Your Project API Key
});
```

### 2. Checking Availability

```typescript
const slots = await dispo.getAvailability(
  'resource_123',
  '2024-06-01T09:00:00Z',
  '2024-06-01T17:00:00Z',
  60 // Slot duration in minutes
);

console.log(slots);
// [
//   { start: '...', end: '...', available: 1 },
//   ...
// ]
```

### 3. Creating a Booking

```typescript
try {
  const booking = await dispo.createBooking({
    resourceId: 'resource_123',
    start: '2024-06-01T10:00:00Z',
    end: '2024-06-01T11:00:00Z',
    quantity: 1,
    metadata: {
      userId: 'user_456',
      paymentId: 'pi_789'
    }
  });
  
  console.log('Booking confirmed:', booking.id);
} catch (error) {
  if (error.response && error.response.status === 409) {
    console.error('Slot is already booked!');
  } else {
    console.error('Error creating booking:', error);
  }
}
```

### 4. Management (Optional)

If you are building a platform that manages multiple tenants (Projects), you can use the Bearer token auth.

```typescript
const adminClient = new DispoClient({
  baseURL: 'https://your-dispo-instance.com',
  bearerToken: 'your_admin_token' // Obtained via login
});

// Create a new tenant
const project = await adminClient.createProject('New Salon Tenant');
console.log(project.apiKey); // Save this for the tenant!
```

## Types

The SDK exports Zod schemas for all domain objects, ensuring type safety and validation.

```typescript
import { BookingSchema, ResourceSchema } from '@riv0manana/dispo-now-sdk';
```

## License

MIT License
