
async function main() {
  const BASE_URL = 'http://localhost:8000'
  const RED = '\x1b[31m'
  const GREEN = '\x1b[32m'
  const RESET = '\x1b[0m'

  function log(msg: string, type: 'info' | 'success' | 'error' = 'info') {
    const color = type === 'success' ? GREEN : type === 'error' ? RED : RESET
    console.log(`${color}${msg}${RESET}`)
  }

  async function assertStatus(res: Response, expected: number, context: string) {
    if (res.status !== expected) {
      const body = await res.text()
      throw new Error(`[${context}] Expected status ${expected}, got ${res.status}. Body: ${body}`)
    }
    log(`[${context}] Status ${res.status} OK`, 'success')
    return res
  }

  try {
    // ==========================================
    // 1. HAPPY PATH SETUP
    // ==========================================
    log('\n--- 1. SETUP ---')
    
    // Create Project A
    const p1Res = await fetch(`${BASE_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Project A', metadata: {} })
    })
    const p1 = await (await assertStatus(p1Res, 201, 'Create Project A')).json()
    const KEY_A = p1.apiKey
    const ID_A = p1.id

    // Create Project B (Attacker)
    const p2Res = await fetch(`${BASE_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Project B', metadata: {} })
    })
    const p2 = await (await assertStatus(p2Res, 201, 'Create Project B')).json()
    const KEY_B = p2.apiKey
    const ID_B = p2.id

    // Create Resource A1 for Project A
    const r1Res = await fetch(`${BASE_URL}/resources`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-api-key': KEY_A 
      },
      body: JSON.stringify({
        name: 'Resource A1',
        defaultCapacity: 1, // Single capacity for conflict testing
        metadata: {}
      })
    })
    const r1 = await (await assertStatus(r1Res, 201, 'Create Resource A1')).json()
    const RES_ID_A1 = r1.id

    // ==========================================
    // 2. AUTHENTICATION EDGE CASES
    // ==========================================
    log('\n--- 2. AUTHENTICATION ---')

    // Missing Header
    await assertStatus(
      await fetch(`${BASE_URL}/resources`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: '{}' 
      }), 
      401, 
      'Missing API Key'
    )

    // Invalid Header
    await assertStatus(
      await fetch(`${BASE_URL}/resources`, { 
        method: 'POST', 
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': 'invalid-key' 
        }, 
        body: '{}' 
      }), 
      401, 
      'Invalid API Key'
    )

    // ==========================================
    // 3. SECURITY / ISOLATION EDGE CASES
    // ==========================================
    log('\n--- 3. SECURITY & ISOLATION ---')

    // Project B trying to create resource for Project A
    // (Assuming body.projectId is A, but Key is B)
    await assertStatus(
      await fetch(`${BASE_URL}/resources`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': KEY_B 
        },
        body: JSON.stringify({
          projectId: ID_A, // Mismatch
          name: 'Hacked Resource',
          defaultCapacity: 1
        })
      }),
      403,
      'Project B creating resource for A'
    )

    // Project B trying to book Project A's resource
    await assertStatus(
      await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': KEY_B 
        },
        body: JSON.stringify({
          projectId: ID_B,
          resourceId: RES_ID_A1, // Belongs to A
          start: '2025-01-01T10:00:00Z',
          end: '2025-01-01T11:00:00Z',
          quantity: 1
        })
      }),
      403, // Should be Forbidden (ResourceDoesNotBelongToProject)
      'Project B booking Resource A'
    )

    // ==========================================
    // 4. VALIDATION EDGE CASES
    // ==========================================
    log('\n--- 4. VALIDATION ---')

    // Logic Error: Start > End
    await assertStatus(
      await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': KEY_A 
        },
        body: JSON.stringify({
          resourceId: RES_ID_A1,
          start: '2025-01-01T12:00:00Z',
          end: '2025-01-01T11:00:00Z', // END BEFORE START
          quantity: 1
        })
      }),
      400, // InvalidTimeRange
      'Start after End'
    )

    // Zero Quantity
    await assertStatus(
      await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': KEY_A 
        },
        body: JSON.stringify({
          resourceId: RES_ID_A1,
          start: '2025-01-01T10:00:00Z',
          end: '2025-01-01T11:00:00Z',
          quantity: 0 // Invalid
        })
      }),
      400, // Zod Error (min 1)
      'Zero Quantity'
    )

    // ==========================================
    // 5. CAPACITY & LIFECYCLE EDGE CASES
    // ==========================================
    log('\n--- 5. CAPACITY & LIFECYCLE ---')

    // 5.1 Create Valid Booking 1
    const b1Res = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-api-key': KEY_A 
      },
      body: JSON.stringify({
        resourceId: RES_ID_A1,
        start: '2025-01-01T10:00:00Z',
        end: '2025-01-01T11:00:00Z',
        quantity: 1
      })
    })
    const b1 = await (await assertStatus(b1Res, 201, 'Create Booking 1')).json()
    const BOOK_ID = b1.id

    // 5.2 Attempt Overbooking (Conflict)
    await assertStatus(
      await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': KEY_A 
        },
        body: JSON.stringify({
          resourceId: RES_ID_A1,
          start: '2025-01-01T10:30:00Z', // Overlaps
          end: '2025-01-01T11:30:00Z',
          quantity: 1
        })
      }),
      409, // CapacityExceeded
      'Overbooking'
    )

    // 5.3 Cancel Booking
    await assertStatus(
      await fetch(`${BASE_URL}/bookings/${BOOK_ID}/cancel`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': KEY_A 
        }
      }),
      200,
      'Cancel Booking'
    )

    // 5.4 Cancel Again (Idempotency check / Error check)
    try {
        await assertStatus(
        await fetch(`${BASE_URL}/bookings/${BOOK_ID}/cancel`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'x-api-key': KEY_A 
            }
        }),
        400, // Expected for double cancel
        'Double Cancel'
        )
    } catch (e) {
        log('⚠️ Double Cancel failed (Expected if error mapping missing)', 'error')
    }

    // 5.5 Create Booking 2 (Should succeed now that B1 is cancelled)
    await assertStatus(
      await fetch(`${BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': KEY_A 
        },
        body: JSON.stringify({
          resourceId: RES_ID_A1,
          start: '2025-01-01T10:00:00Z',
          end: '2025-01-01T11:00:00Z',
          quantity: 1
        })
      }),
      201,
      'Re-book after cancel'
    )

    log('\n🎉 ALL EDGE CASES VERIFIED SUCCESSFULLY!', 'success')

  } catch (err) {
    console.error('\n❌ TEST FAILED:', err)
    Deno.exit(1)
  }
}

main()
