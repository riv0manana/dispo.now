
import { assertEquals, assertExists } from 'std/assert/mod.ts'
import { app } from '@/app/http/http.ts'
import { mcpApp } from '@/app/mcp/server.ts'

// Mock MCP_SERVER environment variable
Deno.env.set('MCP_SERVER', 'test-enabled')

Deno.test('E2E: MCP Agent Journey', async (t) => {
  let sessionId: string
  let token: string
  let projectId: string
  let resourceId: string
  const email = `agent_${Date.now()}@mcp.test`
  const password = 'password123'
  
  // Helper to simulate JSON-RPC call
  const callTool = async (method: string, params: any) => {
    // 1. Send Request
    const reqBody = {
      jsonrpc: '2.0',
      method: 'notifications/tools/call', 
      params: {
        name: method,
        arguments: params
      },
      id: Math.floor(Math.random() * 1000)
    }

    const rpcReq = {
      jsonrpc: "2.0",
      id: Math.floor(Math.random() * 1000),
      method: "tools/call",
      params: {
        name: method,
        arguments: params
      }
    }

    const res = await mcpApp.request(`/messages?sessionId=${sessionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rpcReq)
    })
    assertEquals(res.status, 202) // Accepted
  }

  let streamReader: ReadableStreamDefaultReader<Uint8Array>
  const messageQueue: any[] = []

  // 0. Setup User (via REST API first, as MCP login requires existing user)
  await t.step('Setup: Register User via API', async () => {
    const res = await app.request('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    assertEquals(res.status, 201)
  })

  // 1. Connect to MCP SSE
  await t.step('Connect MCP SSE', async () => {
    const res = await mcpApp.request('/sse')
    assertEquals(res.status, 200)
    assertExists(res.body)
    streamReader = res.body.getReader()

    // Start reading loop
    const readLoop = async () => {
      try {
        while (true) {
          const { done, value } = await streamReader.read()
          if (done) break
          const text = new TextDecoder().decode(value)
          const lines = text.split('\n')
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))
                messageQueue.push(data)
                // console.log('MCP MSG:', data)
              } catch (e) {
                // Ignore non-json data
                if (line.includes('/mcp/messages')) {
                    // Extract sessionId from endpoint URL
                    const match = line.match(/sessionId=([a-f0-9-]+)/)
                    if (match) {
                        sessionId = match[1]
                        console.log('Session ID:', sessionId)
                    }
                }
              }
            }
          }
        }
      } catch (e) {
        // Stream closed
      }
    }
    readLoop() // Run in background

    // Wait for session ID
    let retries = 0
    while (!sessionId && retries < 10) {
      await new Promise(r => setTimeout(r, 100))
      retries++
    }
    assertExists(sessionId, "Failed to get session ID from SSE")
  })

  const getNextResponse = async () => {
    let retries = 0
    while (messageQueue.length === 0 && retries < 20) {
      await new Promise(r => setTimeout(r, 100))
      retries++
    }
    return messageQueue.shift()
  }

  // 2. Login via MCP
  await t.step('MCP: Login', async () => {
    await callTool('login_user', { email, password })
    const res = await getNextResponse()
    // Response should be JSON-RPC result
    assertExists(res.result)
    const content = JSON.parse(res.result.content[0].text)
    token = content.token
    assertExists(token)
    console.log('Got Token via MCP')
  })

  // 3. Create Project via MCP
  await t.step('MCP: Create Project', async () => {
    await callTool('create_project', {
      name: 'MCP Agent Project',
      token: token
    })
    const res = await getNextResponse()
    assertExists(res.result)
    const project = JSON.parse(res.result.content[0].text)
    projectId = project.id
    assertEquals(project.name, 'MCP Agent Project')
    console.log('Created Project:', projectId)
  })

  // 4. Create Resource via MCP
  await t.step('MCP: Create Resource', async () => {
    await callTool('create_resource', {
      projectId: projectId,
      token: token,
      name: 'Agent Resource',
      defaultCapacity: 10
    })
    const res = await getNextResponse()
    assertExists(res.result)
    const resource = JSON.parse(res.result.content[0].text)
    resourceId = resource.id
    assertEquals(resource.name, 'Agent Resource')
    console.log('Created Resource:', resourceId)
  })

  // 5. Check Availability via MCP
  await t.step('MCP: Check Availability', async () => {
    const start = new Date().toISOString()
    const end = new Date(Date.now() + 3600000).toISOString() // +1 hour
    
    await callTool('check_availability', {
      projectId: projectId,
      token: token,
      resourceId: resourceId,
      start,
      end
    })
    const res = await getNextResponse()
    assertExists(res.result)
    const slots = JSON.parse(res.result.content[0].text)
    assertEquals(Array.isArray(slots), true)
    // Should be available
    assertExists(slots[0])
    assertEquals(slots[0].available, 10)
  })

  // Cleanup
  await streamReader.cancel()
})
