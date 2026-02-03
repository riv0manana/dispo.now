import { assertEquals } from 'std/assert/mod.ts'
import { app } from '@/app/http/http.ts'

Deno.test('E2E: Availability Check', async (t) => {
  let token: string
  let apiKey: string
  let projectId: string
  let resourceId: string
  const email = `avail_${crypto.randomUUID()}@test.com`

  // 1. Setup (Signup, Login, Create Project, Create Resource)
  await t.step('Setup', async () => {
    // Signup
    await app.request('/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'password123' })
    })

    // Login
    const loginRes = await app.request('/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'password123' })
    })
    token = (await loginRes.json()).token

    // Create Project
    const projRes = await app.request('/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ name: 'Avail Project', metadata: {} })
    })
    const projBody = await projRes.json()
    apiKey = projBody.apiKey
    projectId = projBody.id

    // Create Resource (Capacity 2)
    const resRes = await app.request('/resources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
      body: JSON.stringify({
        name: 'Room A',
        defaultCapacity: 2,
        metadata: {}
      })
    })
    resourceId = (await resRes.json()).id
  })

  // 2. Book 1 Slot
  await t.step('Book Slot', async () => {
    const res = await app.request('/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
      body: JSON.stringify({
        resourceId,
        start: '2025-01-01T10:00:00Z',
        end: '2025-01-01T11:00:00Z',
        quantity: 1,
        metadata: {}
      })
    })
    assertEquals(res.status, 201)
  })

  // 3. Check Availability (Should see 1 left)
  await t.step('Check Availability', async () => {
    const start = '2025-01-01T09:00:00Z'
    const end = '2025-01-01T12:00:00Z'
    
    // Using API Key (Consumer context)
    const res = await app.request(
      `/resources/${resourceId}/availability?start=${start}&end=${end}&slotDurationMinutes=60`, 
      {
        method: 'GET',
        headers: { 'x-api-key': apiKey }
      }
    )
    
    assertEquals(res.status, 200)
    const slots = await res.json()
    
    // Expected:
    // 09-10: 2 available
    // 10-11: 1 available (2-1)
    // 11-12: 2 available
    assertEquals(slots.length, 3)
    assertEquals(slots[0].available, 2)
    assertEquals(slots[1].available, 1)
    assertEquals(slots[2].available, 2)
  })
})
