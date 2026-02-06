import { assertEquals, assertExists } from 'std/assert/mod.ts'
import { app } from '@/app/http/http.ts'

Deno.test('E2E: Advanced Scenarios (Recurring, Group, Search)', async (t) => {
  let token: string
  let apiKey: string
  let projectId: string
  let resourceId: string
  const email = `advanced_${crypto.randomUUID()}@test.com`

  // 1. Setup
  await t.step('Setup', async () => {
    // Signup
    await app.request('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'password123' })
    })

    // Login
    const loginRes = await app.request('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: 'password123' })
    })
    token = (await loginRes.json()).token

    // Create Project
    const projRes = await app.request('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ name: 'Advanced Project', metadata: {} })
    })
    const projBody = await projRes.json()
    apiKey = projBody.apiKey
    projectId = projBody.id

    // Create Resource
    const resRes = await app.request('/api/resources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
      body: JSON.stringify({
        name: 'Conference Room',
        defaultCapacity: 10,
        metadata: { type: 'room' }
      })
    })
    resourceId = (await resRes.json()).id
  })

  // 2. Recurring Booking
  await t.step('Recurring Booking', async () => {
    const res = await app.request('/api/bookings/recurring', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
      body: JSON.stringify({
        resourceId,
        start: '2025-02-01T10:00:00Z',
        end: '2025-02-01T11:00:00Z',
        quantity: 1,
        recurrence: {
          frequency: 'daily',
          count: 3 // Should create 3 bookings: Feb 1, Feb 2, Feb 3
        }
      })
    })
    
    assertEquals(res.status, 201)
    const ids = await res.json()
    assertEquals(Array.isArray(ids), true)
    assertEquals(ids.length, 3)
  })

  // 3. Group Booking
  await t.step('Group Booking', async () => {
    const res = await app.request('/api/bookings/group', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
      body: JSON.stringify({
        bookings: [
          {
            resourceId,
            start: '2025-03-01T09:00:00Z',
            end: '2025-03-01T10:00:00Z',
            quantity: 2
          },
          {
            resourceId,
            start: '2025-03-01T14:00:00Z',
            end: '2025-03-01T15:00:00Z',
            quantity: 2
          }
        ]
      })
    })

    assertEquals(res.status, 201)
    const ids = await res.json()
    assertEquals(Array.isArray(ids), true)
    assertEquals(ids.length, 2)
  })

  // 4. Fetch/Search Capabilities
  await t.step('Fetch & Search', async () => {
    // List Projects (Owner)
    const projListRes = await app.request('/api/projects', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (projListRes.status !== 200) {
      const err = await projListRes.json()
      throw new Error(`Failed to list projects: ${JSON.stringify(err)}`)
    }
    assertEquals(projListRes.status, 200)
    const projects = await projListRes.json()
    assertEquals(Array.isArray(projects), true)
    assertExists(projects.find((p: any) => p.id === projectId))

    // List Resources (Project context - via API Key)
    const resListRes = await app.request('/api/resources', {
      method: 'GET',
      headers: { 'x-api-key': apiKey }
    })
    assertEquals(resListRes.status, 200)
    const resources = await resListRes.json()
    assertEquals(Array.isArray(resources), true)
    assertExists(resources.find((r: any) => r.id === resourceId))
  })
})
