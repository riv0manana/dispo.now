import { assertEquals } from 'std/assert/mod.ts'
import { app } from '@/app/http/http.ts'

Deno.test('E2E: Full User Journey', async (t) => {
  let token: string
  let apiKey: string
  let projectId: string
  let resourceId: string
  
  // 1. User Signup
  await t.step('Signup', async () => {
    const res = await app.request('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'e2e@test.com',
        password: 'password123'
      })
    })
    assertEquals(res.status, 201)
    const body = await res.json()
    assertEquals(body.email, 'e2e@test.com')
  })

  // 2. User Login
  await t.step('Login', async () => {
    const res = await app.request('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'e2e@test.com',
        password: 'password123'
      })
    })
    assertEquals(res.status, 200)
    const body = await res.json()
    token = body.token
    assertEquals(typeof token, 'string')
  })

  // 3. Create Project (Protected by Bearer Token)
  await t.step('Create Project', async () => {
    const res = await app.request('/api/projects', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: 'E2E Project',
        metadata: { env: 'test' }
      })
    })
    assertEquals(res.status, 201)
    const body = await res.json()
    apiKey = body.apiKey
    projectId = body.id
    assertEquals(body.name, 'E2E Project')
    assertEquals(typeof apiKey, 'string')
  })

  // 4. Create Resource (Protected by API Key)
  await t.step('Create Resource', async () => {
    const res = await app.request('/api/resources', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        name: 'Meeting Room',
        defaultCapacity: 5,
        metadata: {}
      })
    })
    assertEquals(res.status, 201)
    const body = await res.json()
    resourceId = body.id
    assertEquals(typeof resourceId, 'string')
  })

  // 5. Create Booking (Protected by API Key)
  await t.step('Create Booking', async () => {
    const res = await app.request('/api/bookings', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        resourceId: resourceId,
        start: '2025-01-01T10:00:00Z',
        end: '2025-01-01T11:00:00Z',
        quantity: 1,
        metadata: {}
      })
    })
    assertEquals(res.status, 201)
    const body = await res.json()
    assertEquals(body.status, 'active')
  })

  // 6. Edge Case: Create Booking with Capacity Overflow
  await t.step('Booking Overflow', async () => {
    const res = await app.request('/api/bookings', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        resourceId: resourceId,
        start: '2025-01-01T10:00:00Z', // Same time
        end: '2025-01-01T11:00:00Z',
        quantity: 6, // Capacity is 5
        metadata: {}
      })
    })
    assertEquals(res.status, 409) // Conflict/CapacityExceeded
    const body = await res.json()
    assertEquals(body.error, 'CapacityExceeded')
  })

  // 7. Edge Case: Unauthorized Project Access (No Token)
  await t.step('Unauthorized Project Access', async () => {
    const res = await app.request('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Hacker Project' })
    })
    assertEquals(res.status, 401)
  })

  // 8. Edge Case: Invalid API Key
  await t.step('Invalid API Key', async () => {
    const res = await app.request('/api/resources', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-api-key': 'invalid_key'
      },
      body: JSON.stringify({ name: 'Hacker Resource' })
    })
    assertEquals(res.status, 401)
  })
})
