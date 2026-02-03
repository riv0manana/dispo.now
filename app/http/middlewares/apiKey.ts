import { Context, Next } from 'hono'
import { container } from '@/container/index.ts'
import { VerifyApiKeyUseCase } from '@/core/application/usecases/VerifyApiKeyUseCase.ts'

export const apiKeyMiddleware = async (c: Context, next: Next) => {
  const apiKey = c.req.header('x-api-key')

  if (!apiKey) {
    return c.json({ error: 'MissingApiKey' }, 401)
  }

  try {
    const useCase = container.get('VerifyApiKeyUseCase') as VerifyApiKeyUseCase
    const projectId = await useCase.execute(apiKey)
    
    // Attach projectId to context for downstream routes
    c.set('projectId', projectId)
    
    await next()
  } catch (err: any) {
    if (err.message === 'InvalidApiKey') {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    throw err
  }
}
