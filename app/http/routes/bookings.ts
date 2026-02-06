import { OpenAPIHono, createRoute } from 'npm:@hono/zod-openapi'
import { z } from '@/app/zod.ts'
import { loadDeps } from '@/core/container/index.ts'
import { HonoEnv } from '../types.ts'
import { hybridAuthMiddleware } from "../middlewares/hybridAuth.ts";

const bookings = new OpenAPIHono<HonoEnv>()

const CreateBookingSchema = z.object({
  projectId: z.string().optional(),
  resourceId: z.string(),
  start: z.string(),
  end: z.string(),
  quantity: z.number().int().min(1),
  capacity: z.number().int().min(1).optional(),
  metadata: z.record(z.unknown()).optional()
})

const CreateGroupBookingSchema = z.object({
  projectId: z.string().optional(),
  bookings: z.array(z.object({
    resourceId: z.string(),
    start: z.string(),
    end: z.string(),
    quantity: z.number().int().min(1),
    capacity: z.number().int().min(1).optional(),
    metadata: z.record(z.unknown()).optional()
  }))
})

const CreateRecurringBookingSchema = z.object({
  projectId: z.string().optional(),
  resourceId: z.string(),
  start: z.string(),
  end: z.string(),
  quantity: z.number().int().min(1),
  recurrence: z.object({
    frequency: z.enum(['daily', 'weekly', 'monthly']),
    interval: z.number().int().min(1).default(1),
    count: z.number().int().min(1).optional(),
    until: z.string().optional(),
    byWeekDays: z.array(z.number().int().min(0).max(6)).optional()
  }),
  metadata: z.record(z.unknown()).optional()
})

const BookingResponseSchema = z.object({
  id: z.string(),
  status: z.string(),
  timeRange: z.object({
    start: z.string(),
    end: z.string()
  })
})

const CancelResponseSchema = z.object({
  status: z.string()
})

// POST /
bookings.openapi(
  createRoute({
    method: 'post',
    path: '/',
    summary: 'Create a Booking',
    middleware: [hybridAuthMiddleware] as any,
    request: {
      body: {
        content: {
          'application/json': {
            schema: CreateBookingSchema
          }
        }
      }
    },
    responses: {
      201: {
        content: {
          'application/json': {
            schema: BookingResponseSchema
          }
        },
        description: 'Booking created'
      },
      401: { description: 'Unauthorized' },
      403: { description: 'Forbidden' },
      409: { description: 'Capacity Exceeded' }
    }
  }),
  async (c) => {
    const body = c.req.valid('json')
    const authenticatedProjectId = c.get('projectId')
    if (!authenticatedProjectId) return c.json({ error: 'Unauthorized' }, 401)

    if (body.projectId && body.projectId !== authenticatedProjectId) {
      return c.json({ error: 'Forbidden: ProjectId mismatch' }, 403)
    }

    const useCase = loadDeps('CreateBookingUseCase')
    
    const result = await useCase.execute({
      projectId: authenticatedProjectId,
      resourceId: body.resourceId,
      start: new Date(body.start),
      end: new Date(body.end),
      quantity: body.quantity,
      capacity: body.capacity,
      metadata: body.metadata || {}
    })

    return c.json({
      id: result,
      status: 'active',
      timeRange: {
        start: body.start,
        end: body.end
      }
    }, 201)
  }
)

// POST /group
bookings.openapi(
  createRoute({
    method: 'post',
    path: '/group',
    summary: 'Create a Group Booking',
    middleware: [hybridAuthMiddleware] as any,
    request: {
      body: {
        content: {
          'application/json': {
            schema: CreateGroupBookingSchema
          }
        }
      }
    },
    responses: {
      201: {
        content: {
          'application/json': {
            schema: z.array(z.string())
          }
        },
        description: 'Group Booking created'
      },
      401: { description: 'Unauthorized' },
      403: { description: 'Forbidden' },
      409: { description: 'Capacity Exceeded' }
    }
  }),
  async (c) => {
    const body = c.req.valid('json')
    const authenticatedProjectId = c.get('projectId')
    if (!authenticatedProjectId) return c.json({ error: 'Unauthorized' }, 401)

    if (body.projectId && body.projectId !== authenticatedProjectId) {
      return c.json({ error: 'Forbidden: ProjectId mismatch' }, 403)
    }

    const useCase = loadDeps('CreateGroupBookingUseCase')
    
    const result = await useCase.execute({
      projectId: authenticatedProjectId,
      bookings: body.bookings.map(b => ({
        resourceId: b.resourceId,
        start: new Date(b.start),
        end: new Date(b.end),
        quantity: b.quantity,
        capacity: b.capacity,
        metadata: b.metadata || {}
      }))
    })

    return c.json(result, 201)
  }
)

// POST /recurring
bookings.openapi(
  createRoute({
    method: 'post',
    path: '/recurring',
    summary: 'Create a Recurring Booking',
    description: 'Expands a recurrence pattern into multiple bookings and saves them atomically.',
    middleware: [hybridAuthMiddleware] as any,
    request: {
      body: {
        content: {
          'application/json': {
            schema: CreateRecurringBookingSchema
          }
        }
      }
    },
    responses: {
      201: {
        content: {
          'application/json': {
            schema: z.array(z.string())
          }
        },
        description: 'Recurring Bookings created'
      },
      401: { description: 'Unauthorized' },
      403: { description: 'Forbidden' },
      409: { description: 'Capacity Exceeded for one or more slots' }
    }
  }),
  async (c) => {
    const body = c.req.valid('json')
    const authenticatedProjectId = c.get('projectId')
    if (!authenticatedProjectId) return c.json({ error: 'Unauthorized' }, 401)

    if (body.projectId && body.projectId !== authenticatedProjectId) {
      return c.json({ error: 'Forbidden: ProjectId mismatch' }, 403)
    }

    const useCase = loadDeps('CreateRecurringBookingUseCase')
    
    try {
      const result = await useCase.execute({
        projectId: authenticatedProjectId,
        resourceId: body.resourceId,
        start: new Date(body.start),
        end: new Date(body.end),
        quantity: body.quantity,
        recurrence: {
          ...body.recurrence,
          until: body.recurrence.until ? new Date(body.recurrence.until) : undefined
        },
        metadata: body.metadata || {}
      })

      return c.json(result, 201)
    } catch (error: any) {
      if (error.message.includes('InvalidRecurrence')) {
        return c.json({ error: error.message }, 400)
      }
      throw error
    }
  }
)

// POST /:id/cancel
bookings.openapi(
  createRoute({
    method: 'post',
    path: '/{id}/cancel',
    summary: 'Cancel a Booking',
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
            schema: CancelResponseSchema
          }
        },
        description: 'Booking cancelled'
      },
      401: { description: 'Unauthorized' }
    }
  }),
  async (c) => {
    const id = c.req.param('id')
    const authenticatedProjectId = c.get('projectId')
    if (!authenticatedProjectId) return c.json({ error: 'Unauthorized' }, 401)
    
    const useCase = loadDeps('CancelBookingUseCase')
    
    await useCase.execute(id, authenticatedProjectId)
    
    return c.json({ status: 'cancelled' }, 200)
  }
)

export { bookings }
