import { assertEquals, assertExists } from 'std/assert/mod.ts'
import { app } from '@/app/http/http.ts'
import { container } from '@/container/index.ts'

Deno.test('E2E: Hybrid Authentication Logic', async (t) => {
  // 1. Setup User & Project
  const email = `test-hybrid-${crypto.randomUUID()}@example.com`
  const password = 'password123'
  await app.request('/users', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: { 'Content-Type': 'application/json' }
  })
  const loginRes = await app.request('/users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: { 'Content-Type': 'application/json' }
  })
  const { token } = await loginRes.json()

  const projectRes = await app.request('/projects', {
    method: 'POST',
    body: JSON.stringify({ name: 'Hybrid Project' }),
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
  })
  const project = await projectRes.json()
  const projectId = project.id
  const apiKey = project.apiKey

  // 2. Case: Bearer + ProjectId (Should Succeed)
  const bearerRes = await app.request('/resources', {
    method: 'POST',
    body: JSON.stringify({
      projectId,
      name: 'Bearer Resource',
      defaultCapacity: 10
    }),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  assertEquals(bearerRes.status, 201)
  const res1 = await bearerRes.json()
  assertEquals(res1.projectId, projectId)

  // 3. Case: Bearer WITHOUT ProjectId (Should Fail - Missing projectId or API Key)
  const failRes = await app.request('/resources', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Fail Resource',
      defaultCapacity: 10
    }),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  // Expect 401 because HybridAuth sees no projectId and no API Key
  assertEquals(failRes.status, 401)
  const err1 = await failRes.json()
  assertEquals(err1.error, 'Unauthorized: Missing projectId or API Key')

  // 4. Case: Priority Check (ProjectId supplied + Invalid Token + Valid API Key) -> Should Fail
  // Reason: If projectId is supplied, we MUST use Bearer Auth. API Key is ignored.
  const priorityRes = await app.request('/resources', {
    method: 'POST',
    body: JSON.stringify({
      projectId,
      name: 'Priority Resource',
      defaultCapacity: 10
    }),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer invalid-token',
      'x-api-key': apiKey
    }
  })
  assertEquals(priorityRes.status, 401)
  const err2 = await priorityRes.json()
  assertEquals(err2.error, 'Unauthorized: Invalid token')

  // 5. Case: API Key Only (No ProjectId in Body) -> Should Succeed
  const apiKeyRes = await app.request('/resources', {
    method: 'POST',
    body: JSON.stringify({
      name: 'API Key Resource',
      defaultCapacity: 10
    }),
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey
    }
  })
  assertEquals(apiKeyRes.status, 201)
  const res3 = await apiKeyRes.json()
  assertEquals(res3.projectId, projectId)
})
