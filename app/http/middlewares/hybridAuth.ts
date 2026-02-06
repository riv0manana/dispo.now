import { Context, Next } from 'hono'
import { loadDeps } from "@/core/container/index.ts";

export const hybridAuthMiddleware = async (c: Context, next: Next) => {
  let projectId: string | undefined = c.req.query('projectId')
  const authHeader = c.req.header('Authorization');
  const apiKey = c.req.header('x-api-key')
  
  if (apiKey && authHeader && authHeader.startsWith('Bearer ')){
    return c.json({ error: 'Unauthorized: API Key and Bearer token are mutually exclusive' }, 403)
  }

  
  if (!projectId) {
    const contentType = c.req.header('Content-Type')
    if (contentType && contentType.includes('application/json')) {
      try {
        const body = await c.req.json()
        if (body && typeof body === 'object') {
          projectId = body.projectId
        }
      } catch {
      }
    }
  }

  // Case 1: Project ID is supplied -> Must use Bearer Auth
  if (projectId) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized: Bearer token required when projectId is supplied' }, 401)
    }

    const token = authHeader.split(' ')[1]
    const tokenService = loadDeps('TokenService')
    let payload
    try {
      payload = await tokenService.verify(token)
    } catch {
      return c.json({ error: 'Unauthorized: Invalid token' }, 401)
    }

    const projectRepo = loadDeps('ProjectRepository')
    const project = await projectRepo.findById(projectId)

    if (!project) {
      return c.json({ error: 'ProjectNotFound' }, 404)
    }

    if (project.userId !== payload.userId) {
      return c.json({ error: 'Forbidden: You do not own this project' }, 403)
    }

    c.set('projectId', projectId)
    c.set('user', payload)
    await next()
    return
  }

  // Case 2: No Project ID -> Must use API Key
  
  if (!apiKey) {
    return c.json({ error: 'Unauthorized: Missing projectId or API Key' }, 401)
  }

  try {
    const useCase = loadDeps('VerifyApiKeyUseCase')
    const resolvedProjectId = await useCase.execute(apiKey)
    
    c.set('projectId', resolvedProjectId)
    await next()
  } catch (err: any) {
    if (err.message === 'InvalidApiKey') {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    throw err
  }
}
