import { assertEquals } from 'std/assert/mod.ts'
import { app } from '@/app/http/http.ts'

Deno.test('E2E Stress Test: Concurrent Bookings via HTTP', async (t) => {
  let token: string
  let projectId: string
  let resourceId: string
  
  // 1. Setup: Signup & Login
  await t.step('Setup', async () => {
    // Signup
    await app.request('/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'stress@test.com',
        password: 'password123'
      })
    })

    // Login
    const res = await app.request('/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'stress@test.com',
        password: 'password123'
      })
    })
    const body = await res.json()
    token = body.token
  })

  // 2. Create Project & Resource
  await t.step('Create Resource (Capacity 1)', async () => {
    // Project
    const resProj = await app.request('/projects', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name: 'Stress Project' })
    })
    const projBody = await resProj.json()
    projectId = projBody.id

    // Resource
    const resRes = await app.request('/resources', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        projectId,
        name: 'Stress Resource',
        defaultCapacity: 1
      })
    })
    const resBody = await resRes.json()
    resourceId = resBody.id
  })

  // 3. The Stress Test
  await t.step('Hammer the API with 2000 concurrent booking requests', async () => {
    const CONCURRENT_REQUESTS = 2000;
    
    const bookingPayload = {
      projectId,
      resourceId,
      start: '2025-01-01T10:00:00Z',
      end: '2025-01-01T11:00:00Z',
      quantity: 1
    }

    const requestPromises = Array.from({ length: CONCURRENT_REQUESTS }, () => 
      app.request('/bookings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookingPayload)
      })
    );

    const responses = await Promise.all(requestPromises);
    
    let successCount = 0;
    let failureCount = 0;

    for (const res of responses) {
      if (res.status === 201) {
        successCount++;
      } else {
        failureCount++;
        // Optional: Check if the failure is indeed due to capacity
        // const body = await res.json();
        // if (body.error !== 'CapacityExceeded') console.log('Unexpected error:', body);
      }
    }

    console.log(`\nHTTP Stress Results: ${successCount} Created, ${failureCount} Rejected`);

    if (successCount > 1) {
      console.error('⚠️  CRITICAL FAILURE: HTTP Layer allowed overbooking!');
    }

    assertEquals(successCount, 1, 'Exactly one booking should succeed');
    assertEquals(failureCount, CONCURRENT_REQUESTS - 1, 'All other bookings should fail');
  })
})
