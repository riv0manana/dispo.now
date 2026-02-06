
async function main() {
  const BASE_URL = 'http://localhost:8000'

  console.log('1. Creating Project...')
  const projRes = await fetch(`${BASE_URL}/api/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test Project',
      metadata: { plan: 'test' }
    })
  })
  
  if (!projRes.ok) throw new Error(await projRes.text())
  const project = await projRes.json()
  console.log('✅ Project Created:', project)
  
  const API_KEY = project.apiKey
  const PROJECT_ID = project.id

  console.log('\n2. Creating Resource...')
  const resRes = await fetch(`${BASE_URL}/api/resources`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'x-api-key': API_KEY 
    },
    body: JSON.stringify({
      projectId: PROJECT_ID,
      name: 'Test Resource',
      defaultCapacity: 5,
      metadata: { type: 'room' }
    })
  })

  if (!resRes.ok) throw new Error(await resRes.text())
  const resource = await resRes.json()
  console.log('✅ Resource Created:', resource)
  
  const RESOURCE_ID = resource.id

  console.log('\n3. Creating Booking...')
  const bookRes = await fetch(`${BASE_URL}/api/bookings`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'x-api-key': API_KEY 
    },
    body: JSON.stringify({
      projectId: PROJECT_ID,
      resourceId: RESOURCE_ID,
      start: '2025-01-01T10:00:00Z',
      end: '2025-01-01T11:00:00Z',
      quantity: 1,
      metadata: { user: 'test' }
    })
  })

  if (!bookRes.ok) throw new Error(await bookRes.text())
  const booking = await bookRes.json()
  console.log('✅ Booking Created:', booking)

  console.log('\n4. Verifying Booking List...')
  const listRes = await fetch(`${BASE_URL}/api/resources/${RESOURCE_ID}/api/bookings?start=2025-01-01T00:00:00Z&end=2025-01-02T00:00:00Z`, {
    headers: { 'x-api-key': API_KEY }
  })
  
  if (!listRes.ok) throw new Error(await listRes.text())
  const bookings = await listRes.json()
  console.log('✅ Bookings List:', bookings)
  
  if (bookings.length !== 1) throw new Error('Expected 1 booking')

  console.log('\n🎉 E2E Verification Successful!')
}

main().catch(console.error)
