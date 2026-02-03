import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import { z } from '@/app/zod.ts'
import { container } from '@/container/index.ts'
import { hybridAuthMiddleware } from '../middlewares/hybridAuth.ts'
import { CreateResourceUseCase } from '@/core/application/usecases/CreateResourceUseCase.ts'
import { UpdateResourceUseCase } from '@/core/application/usecases/UpdateResourceUseCase.ts'
import { DeleteResourceUseCase } from '@/core/application/usecases/DeleteResourceUseCase.ts'
import { GetBookingsUseCase } from '@/core/application/usecases/GetBookingsUseCase.ts'
import { GetAvailabilityUseCase } from '@/core/application/usecases/GetAvailabilityUseCase.ts'
import { GetResourcesUseCase } from '@/core/application/usecases/GetResourcesUseCase.ts'
import { HonoEnv } from '../types.ts'

const resources = new OpenAPIHono<HonoEnv>()

const BookingConfigSchema = z.object({
  daily: z.object({
    start: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional(),
    end: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).optional()
  }).optional(),
  weekly: z.object({
    availableDays: z.array(z.number().int().min(0).max(6)).optional()
  }).optional()
}).optional()

const CreateResourceSchema = z.object({
  projectId: z.string().optional(),
  name: z.string(),
  defaultCapacity: z.number().int().min(1).default(1),
  metadata: z.record(z.unknown()).optional(),
  bookingConfig: BookingConfigSchema
})

const UpdateResourceSchema = z.object({
  name: z.string().optional(),
  defaultCapacity: z.number().int().min(1).optional(),
  metadata: z.record(z.unknown()).optional(),
  bookingConfig: BookingConfigSchema
})

const ResourceSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  name: z.string(),
  defaultCapacity: z.number().int(),
  metadata: z.record(z.unknown()),
  bookingConfig: BookingConfigSchema
})

const BookingSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  resourceId: z.string(),
  timeRange: z.object({
    start: z.date().or(z.string()),
    end: z.date().or(z.string())
  }),
  quantity: z.number().int(),
  status: z.enum(['active', 'cancelled']),
  metadata: z.record(z.unknown())
})

const AvailabilitySlotSchema = z.object({
  start: z.string().datetime(),
  end: z.string().datetime(),
  available: z.number().int().min(0)
})

// POST /
resources.openapi(
  createRoute({
    method: 'post',
    path: '/',
    summary: 'Create a Resource',
    middleware: [hybridAuthMiddleware] as any,
    request: {
      body: {
        content: {
          'application/json': {
            schema: CreateResourceSchema
          }
        }
      }
    },
    responses: {
      201: {
        content: {
          'application/json': {
            schema: ResourceSchema
          }
        },
        description: 'Resource created'
      },
      401: { description: 'Unauthorized' },
      403: { description: 'Forbidden' }
    }
  }),
  async (c) => {
    const body = c.req.valid('json')
    const authenticatedProjectId = c.get('projectId')
    if (!authenticatedProjectId) return c.json({ error: 'Unauthorized' }, 401)
    
    if (body.projectId && body.projectId !== authenticatedProjectId) {
      return c.json({ error: 'Forbidden: ProjectId mismatch' }, 403)
    }

    const useCase = container.get('CreateResourceUseCase') as CreateResourceUseCase
    
    const result = await useCase.execute({
      projectId: authenticatedProjectId,
      name: body.name,
      defaultCapacity: body.defaultCapacity,
      metadata: body.metadata || {},
      bookingConfig: body.bookingConfig
    })

    return c.json({
      id: result,
      projectId: authenticatedProjectId,
      name: body.name,
      defaultCapacity: body.defaultCapacity,
      metadata: body.metadata || {},
      bookingConfig: body.bookingConfig
    }, 201)
  }
)

// GET /
resources.openapi(
  createRoute({
    method: 'get',
    path: '/',
    summary: 'List Resources',
    middleware: [hybridAuthMiddleware] as any,
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.array(ResourceSchema)
          }
        },
        description: 'List of resources'
      },
      401: { description: 'Unauthorized' }
    }
  }),
  async (c) => {
    const authenticatedProjectId = c.get('projectId')
    if (!authenticatedProjectId) return c.json({ error: 'Unauthorized' }, 401)
    
    const useCase = container.get('GetResourcesUseCase') as GetResourcesUseCase
    const result = await useCase.execute(authenticatedProjectId)

    return c.json(result, 200)
  }
)

// PATCH /:id
resources.openapi(
  createRoute({
    method: 'patch',
    path: '/{id}',
    summary: 'Update a Resource',
    middleware: [hybridAuthMiddleware] as any,
    request: {
      params: z.object({
        id: z.string()
      }),
      body: {
        content: {
          'application/json': {
            schema: UpdateResourceSchema
          }
        }
      }
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: ResourceSchema
          }
        },
        description: 'Resource updated'
      },
      401: { description: 'Unauthorized' },
      404: { description: 'Resource not found' }
    }
  }),
  async (c) => {
    const authenticatedProjectId = c.get('projectId')
    if (!authenticatedProjectId) return c.json({ error: 'Unauthorized' }, 401)
    
    const resourceId = c.req.param('id')
    const body = c.req.valid('json')
    
    const useCase = container.get('UpdateResourceUseCase') as UpdateResourceUseCase
    
    await useCase.execute({
      resourceId,
      projectId: authenticatedProjectId,
      data: body
    })

    // Fetch updated resource
    const getUseCase = container.get('GetResourcesUseCase') as GetResourcesUseCase
    const resources = await getUseCase.execute(authenticatedProjectId)
    const resource = resources.find(r => r.id === resourceId)
    
    if (!resource) return c.json({ error: 'NotFound' }, 404)

    return c.json(resource, 200)
  }
)

// DELETE /:id
resources.openapi(
  createRoute({
    method: 'delete',
    path: '/{id}',
    summary: 'Delete a Resource',
    middleware: [hybridAuthMiddleware] as any,
    request: {
      params: z.object({
        id: z.string()
      })
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.object({
              status: z.string(),
              id: z.string()
            })
          }
        },
        description: 'Resource deleted'
      },
      401: { description: 'Unauthorized' },
      404: { description: 'Resource not found' }
    }
  }),
  async (c) => {
    const authenticatedProjectId = c.get('projectId')
    if (!authenticatedProjectId) return c.json({ error: 'Unauthorized' }, 401)
    
    const resourceId = c.req.param('id')
    
    const useCase = container.get('DeleteResourceUseCase') as DeleteResourceUseCase
    
    await useCase.execute({
      resourceId,
      projectId: authenticatedProjectId
    })

    return c.json({ status: 'deleted', id: resourceId }, 200)
  }
)

// GET /:resourceId/bookings
resources.openapi(
  createRoute({
    method: 'get',
    path: '/{resourceId}/bookings',
    summary: 'List Bookings for a Resource',
    middleware: [hybridAuthMiddleware] as any,
    request: {
      params: z.object({
        resourceId: z.string()
      }),
      query: z.object({
        start: z.string(),
        end: z.string()
      })
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.array(BookingSchema)
          }
        },
        description: 'List of bookings'
      },
      400: { description: 'Invalid Time Range' },
      401: { description: 'Unauthorized' }
    }
  }),
  async (c) => {
    const resourceId = c.req.param('resourceId')
    const { start, end } = c.req.valid('query')
    const authenticatedProjectId = c.get('projectId')
    if (!authenticatedProjectId) return c.json({ error: 'Unauthorized' }, 401)

    if (!start || !end) {
      return c.json({ error: 'InvalidTimeRange' }, 400)
    }

    const useCase = container.get('GetBookingsUseCase') as GetBookingsUseCase
    
    const result = await useCase.execute({
      projectId: authenticatedProjectId,
      resourceId,
      start: new Date(start),
      end: new Date(end)
    })

    return c.json(result, 200)
  }
)

// GET /:id/availability
resources.openapi(
  createRoute({
    method: 'get',
    path: '/{id}/availability',
    summary: 'Get Availability Slots',
    middleware: [hybridAuthMiddleware] as any,
    request: {
      params: z.object({
        id: z.string()
      }),
      query: z.object({
        start: z.string().datetime(),
        end: z.string().datetime(),
        slotDurationMinutes: z.string().regex(/^\d+$/).transform(Number).optional().default('60')
      })
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.array(AvailabilitySlotSchema)
          }
        },
        description: 'List of available slots'
      },
      401: { description: 'Unauthorized' },
      403: { description: 'Forbidden' }
    }
  }),
  async (c) => {
    const { id } = c.req.valid('param')
    const { start, end, slotDurationMinutes } = c.req.valid('query')
    const authenticatedProjectId = c.get('projectId')
    if (!authenticatedProjectId) return c.json({ error: 'Unauthorized' }, 401)

    const useCase = container.get('GetAvailabilityUseCase') as GetAvailabilityUseCase
    
    const slots = await useCase.execute({
      projectId: authenticatedProjectId,
      resourceId: id,
      start: new Date(start),
      end: new Date(end),
      slotDurationMinutes: slotDurationMinutes
    })
    
    return c.json(slots, 200)
  }
)

export { resources }
