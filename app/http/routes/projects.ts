import { OpenAPIHono, createRoute } from 'npm:@hono/zod-openapi'
import { z } from '@/app/zod.ts'
import { container } from '@/container/index.ts'
import { CreateProjectUseCase } from '@/core/application/usecases/CreateProjectUseCase.ts'
import { GetProjectsUseCase } from '@/core/application/usecases/GetProjectsUseCase.ts'
import { UpdateProjectUseCase } from '@/core/application/usecases/UpdateProjectUseCase.ts'
import { DeleteProjectUseCase } from '@/core/application/usecases/DeleteProjectUseCase.ts'
import { authMiddleware } from '../middlewares/auth.ts'
import { HonoEnv } from '../types.ts'

const projects = new OpenAPIHono<HonoEnv>()

// Auth Middleware for all project routes
projects.use('*', authMiddleware)

// Schemas
const CreateProjectSchema = z.object({
  name: z.string().min(1),
  metadata: z.record(z.unknown()).optional()
})

const UpdateProjectSchema = z.object({
  name: z.string().min(1).optional(),
  metadata: z.record(z.unknown()).optional()
})

const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  apiKey: z.string(),
  metadata: z.record(z.unknown())
})

const CreateProjectResponseSchema = ProjectSchema.extend({
  apiKey: z.string()
})

// POST /
projects.openapi(
  createRoute({
    method: 'post',
    path: '/',
    summary: 'Create a Project',
    request: {
      body: {
        content: {
          'application/json': {
            schema: CreateProjectSchema
          }
        }
      }
    },
    responses: {
      201: {
        content: {
          'application/json': {
            schema: CreateProjectResponseSchema
          }
        },
        description: 'Project created successfully'
      },
      401: { description: 'Unauthorized' }
    }
  }),
  async (c) => {
    const body = c.req.valid('json')
    const user = c.get('user')
    if (!user) return c.json({ error: 'Unauthorized' }, 401)
    
    const useCase = container.get('CreateProjectUseCase') as CreateProjectUseCase
    
    const result = await useCase.execute({
      userId: user.userId,
      name: body.name,
      metadata: body.metadata || {}
    })

    return c.json({
      id: result.id,
      name: body.name,
      apiKey: result.apiKey,
      metadata: body.metadata || {}
    }, 201)
  }
)

// GET /
projects.openapi(
  createRoute({
    method: 'get',
    path: '/',
    summary: 'List Projects',
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.array(ProjectSchema)
          }
        },
        description: 'List of projects'
      },
      401: { description: 'Unauthorized' }
    }
  }),
  async (c) => {
    const user = c.get('user')
    if (!user) return c.json({ error: 'Unauthorized' }, 401)
    
    const useCase = container.get('GetProjectsUseCase') as GetProjectsUseCase
    const result = await useCase.execute(user.userId)
    return c.json(result, 200)
  }
)

// PATCH /:id
projects.openapi(
  createRoute({
    method: 'patch',
    path: '/{id}',
    summary: 'Update a Project',
    request: {
      params: z.object({
        id: z.string()
      }),
      body: {
        content: {
          'application/json': {
            schema: UpdateProjectSchema
          }
        }
      }
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: ProjectSchema
          }
        },
        description: 'Project updated successfully'
      },
      401: { description: 'Unauthorized' },
      404: { description: 'Project not found' }
    }
  }),
  async (c) => {
    const user = c.get('user')
    if (!user) return c.json({ error: 'Unauthorized' }, 401)
    
    const projectId = c.req.param('id')
    const body = c.req.valid('json')
    
    const useCase = container.get('UpdateProjectUseCase') as UpdateProjectUseCase
    
    await useCase.execute({
      projectId,
      userId: user.userId,
      data: body
    })

    const getUseCase = container.get('GetProjectsUseCase') as GetProjectsUseCase
    const projects = await getUseCase.execute(user.userId)
    const project = projects.find(p => p.id === projectId)
    
    if (!project) return c.json({ error: 'NotFound' }, 404)

    return c.json(project, 200)
  }
)

// DELETE /:id
projects.openapi(
  createRoute({
    method: 'delete',
    path: '/{id}',
    summary: 'Delete a Project',
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
        description: 'Project deleted successfully'
      },
      401: { description: 'Unauthorized' },
      404: { description: 'Project not found' }
    }
  }),
  async (c) => {
    const user = c.get('user')
    if (!user) return c.json({ error: 'Unauthorized' }, 401)
    
    const projectId = c.req.param('id')
    
    const useCase = container.get('DeleteProjectUseCase') as DeleteProjectUseCase
    
    await useCase.execute({
      projectId,
      userId: user.userId
    })

    return c.json({ status: 'deleted', id: projectId }, 200)
  }
)

export { projects }
