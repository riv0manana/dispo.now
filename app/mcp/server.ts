
import { Hono } from 'hono'
import { streamSSE } from 'hono/streaming'
import { Server } from 'npm:@modelcontextprotocol/sdk/server/index.js'
import { CallToolRequestSchema, ListToolsRequestSchema } from 'npm:@modelcontextprotocol/sdk/types.js'
import { loadDeps } from '@/container/index.ts'

// Session storage for transports
class HonoSSETransport {
    public onmessage?: (message: any) => void;
    private _stream: any; // Hono SSE Stream
    private _sessionId: string;

    constructor(stream: any, sessionId: string) {
        this._stream = stream;
        this._sessionId = sessionId;
    }

    async start() {
        const endpoint = `/mcp/messages?sessionId=${this._sessionId}`
        await this._stream.writeSSE({
            event: 'endpoint',
            data: endpoint
        })
    }

    async send(message: any) {
        await this._stream.writeSSE({
            event: 'message',
            data: JSON.stringify(message)
        })
    }

    async close() {
        // Cleanup
    }

    // Public method to receive data from POST request
    handlePostMessage(message: unknown) {
        if (this.onmessage) {
            this.onmessage(message);
        }
    }
}

const activeTransports = new Map<string, HonoSSETransport>();

export const mcpApp = new Hono()

mcpApp.get('/sse', async (c) => {
    const sessionId = crypto.randomUUID()
    
    return streamSSE(c, async (stream) => {
        const transport = new HonoSSETransport(stream, sessionId)
        activeTransports.set(sessionId, transport)

        const server = new Server(
            {
                name: "dispo-now-mcp",
                version: "1.0.0",
            },
            {
                capabilities: {
                    tools: {},
                },
            }
        )

        setupToolHandlers(server)

        await server.connect(transport as any)

        stream.onAbort(() => {
            activeTransports.delete(sessionId)
        })

        // Keep connection open
        await new Promise(() => {})
    })
})

mcpApp.post('/messages', async (c) => {
    const sessionId = c.req.query('sessionId')
    if (!sessionId) return c.text('Missing sessionId', 400)
    
    const transport = activeTransports.get(sessionId)
    if (!transport) return c.text('Session not found', 404)

    try {
        const body = await c.req.json()
        transport.handlePostMessage(body)
        return c.text('Accepted', 202)
    } catch (e) {
        return c.text('Invalid JSON', 400)
    }
})

function setupToolHandlers(server: Server) {
    server.setRequestHandler(ListToolsRequestSchema, async () => {
        return {
            tools: [
                {
                    name: "login_user",
                    description: "Login with email and password to get a Bearer token.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            email: { type: "string" },
                            password: { type: "string" }
                        },
                        required: ["email", "password"]
                    }
                },
                {
                    name: "create_project",
                    description: "Create a new project. Requires a valid Bearer token.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            name: { type: "string" },
                            metadata: { type: "object" },
                            token: { type: "string", description: "Bearer token from login_user" }
                        },
                        required: ["name", "token"]
                    }
                },
                {
                    name: "list_projects",
                    description: "List projects. Requires a valid Bearer token.",
                    inputSchema: {
                        type: "object",
                        properties: {
                            token: { type: "string", description: "Bearer token from login_user" }
                        },
                        required: ["token"]
                    }
                },
                {
                    name: "create_resource",
                    description: "Create a resource. Requires either apiKey OR (projectId + token).",
                    inputSchema: {
                        type: "object",
                        properties: {
                            projectId: { type: "string" },
                            apiKey: { type: "string" },
                            token: { type: "string" },
                            name: { type: "string" },
                            defaultCapacity: { type: "number" },
                            metadata: { type: "object" },
                            bookingConfig: { type: "object" }
                        },
                        required: ["name"]
                    }
                },
                {
                    name: "get_resources",
                    description: "List resources. Requires either apiKey OR (projectId + token).",
                    inputSchema: {
                        type: "object",
                        properties: {
                            projectId: { type: "string" },
                            apiKey: { type: "string" },
                            token: { type: "string" }
                        }
                    }
                },
                {
                    name: "create_booking",
                    description: "Create a booking. Requires either apiKey OR (projectId + token).",
                    inputSchema: {
                        type: "object",
                        properties: {
                            projectId: { type: "string" },
                            apiKey: { type: "string" },
                            token: { type: "string" },
                            resourceId: { type: "string" },
                            start: { type: "string" },
                            end: { type: "string" },
                            quantity: { type: "number" },
                            metadata: { type: "object" }
                        },
                        required: ["resourceId", "start", "end"]
                    }
                },
                {
                    name: "check_availability",
                    description: "Check availability. Requires either apiKey OR (projectId + token).",
                    inputSchema: {
                        type: "object",
                        properties: {
                            projectId: { type: "string" },
                            apiKey: { type: "string" },
                            token: { type: "string" },
                            resourceId: { type: "string" },
                            start: { type: "string" },
                            end: { type: "string" },
                            slotDurationMinutes: { type: "number" }
                        },
                        required: ["resourceId", "start", "end"]
                    }
                },
                {
                    name: "cancel_booking",
                    description: "Cancel a booking. Requires either apiKey OR (projectId + token).",
                    inputSchema: {
                        type: "object",
                        properties: {
                            projectId: { type: "string" },
                            apiKey: { type: "string" },
                            token: { type: "string" },
                            bookingId: { type: "string" }
                        },
                        required: ["bookingId"]
                    }
                }
            ]
        }
    })

    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params
        const anyArgs = args as any

        // Auth Helpers
        const verifyToken = async (token: string): Promise<string> => {
            if (!token) throw new Error('Missing Bearer token')
            const tokenService = loadDeps('TokenService')
            try {
                const payload = await tokenService.verify(token)
                return payload.userId as string
            } catch (e) {
                throw new Error('Invalid or expired token')
            }
        }

        const getProjectId = async (args: any) => {
            // Case 1: API Key provided -> Resolve to Project ID
            if (args.apiKey) {
                const verifyApiKey = loadDeps('VerifyApiKeyUseCase')
                return await verifyApiKey.execute(args.apiKey)
            }
            
            // Case 2: Project ID provided -> Require Bearer Token
            if (args.projectId) {
                if (!args.token) {
                    throw new Error('When providing projectId, a valid Bearer token is required for security.')
                }
                await verifyToken(args.token)

                return args.projectId
            }

            throw new Error('Missing authentication: Provide either apiKey OR (projectId + token)')
        }

        try {
            let result: any

            switch (name) {
                case "login_user": {
                    const useCase = loadDeps('LoginUserUseCase')
                    result = await useCase.execute({
                        email: anyArgs.email,
                        password: anyArgs.password
                    })
                    break
                }
                case "create_project": {
                    const userId = await verifyToken(anyArgs.token)
                    const useCase = loadDeps('CreateProjectUseCase')
                    const projectRes = await useCase.execute({
                        userId: userId,
                        name: anyArgs.name,
                        metadata: anyArgs.metadata || {}
                    })
                    result = {
                        id: projectRes.id,
                        apiKey: projectRes.apiKey,
                        name: anyArgs.name,
                        metadata: anyArgs.metadata || {}
                    }
                    break
                }
                case "list_projects": {
                    const userId = await verifyToken(anyArgs.token)
                    const useCase = loadDeps('GetProjectsUseCase')
                    result = await useCase.execute(userId)
                    break
                }
                case "create_resource": {
                    const projectId = await getProjectId(anyArgs)
                    const useCase = loadDeps('CreateResourceUseCase')
                    const resourceId = await useCase.execute({
                        projectId,
                        name: anyArgs.name,
                        defaultCapacity: anyArgs.defaultCapacity,
                        metadata: anyArgs.metadata || {},
                        bookingConfig: anyArgs.bookingConfig
                    })
                    result = {
                        id: resourceId,
                        projectId,
                        name: anyArgs.name,
                        defaultCapacity: anyArgs.defaultCapacity,
                        metadata: anyArgs.metadata || {},
                        bookingConfig: anyArgs.bookingConfig
                    }
                    break
                }
                case "get_resources": {
                    const projectId = await getProjectId(anyArgs)
                    const useCase = loadDeps('GetResourcesUseCase')
                    const resources = await useCase.execute(projectId)
                    
                    result = resources.filter(r => {
                        if (anyArgs.capacity?.gte && r.defaultCapacity < anyArgs.capacity.gte) {
                            return false
                        }
                        return true
                    })
                    break
                }
                case "create_booking": {
                    const projectId = await getProjectId(anyArgs)
                    const useCase = loadDeps('CreateBookingUseCase')
                    const bookingId = await useCase.execute({
                        projectId,
                        resourceId: anyArgs.resourceId,
                        start: new Date(anyArgs.start),
                        end: new Date(anyArgs.end),
                        quantity: anyArgs.quantity || 1,
                        metadata: anyArgs.metadata || {}
                    })
                    result = {
                        id: bookingId,
                        projectId,
                        resourceId: anyArgs.resourceId,
                        start: anyArgs.start,
                        end: anyArgs.end,
                        quantity: anyArgs.quantity || 1,
                        status: 'active'
                    }
                    break
                }
                case "check_availability": {
                    const projectId = await getProjectId(anyArgs)
                    const useCase = loadDeps('GetAvailabilityUseCase')
                    result = await useCase.execute({
                        projectId,
                        resourceId: anyArgs.resourceId,
                        start: new Date(anyArgs.start),
                        end: new Date(anyArgs.end),
                        slotDurationMinutes: anyArgs.slotDurationMinutes
                    })
                    break
                }
                case "cancel_booking": {
                    const projectId = await getProjectId(anyArgs)
                    const useCase = loadDeps('CancelBookingUseCase')
                    await useCase.execute(anyArgs.bookingId, projectId)
                    result = { success: true }
                    break
                }
                default:
                    throw new Error(`Unknown tool: ${name}`)
            }

            return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }]
            }
        } catch (error: any) {
            return {
                content: [{ type: "text", text: `Error: ${error.message}` }],
                isError: true
            }
        }
    })
}
