import { OpenAPIHono } from 'npm:@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { serveStatic } from 'hono/serve-static'
import { cors } from 'hono/cors'
import { projects } from './routes/projects.ts'
import { resources } from './routes/resources.ts'
import { bookings } from './routes/bookings.ts'
import { users } from './routes/users.ts'
import { openapiSpec } from './openapi.ts'
import { HonoEnv } from './types.ts'

export const app = new OpenAPIHono<HonoEnv>()

// CORS Middleware
app.use('/*', cors())

// Global Error Handler
app.onError((err, c) => {
  const knownErrors = [
    'CapacityExceeded',
    'ResourceNotFound',
    'BookingNotFound',
    'ResourceDoesNotBelongToProject',
    'BookingDoesNotBelongToProject',
    'InvalidTimeRange',
    'BookingAlreadyCancelled',
    'DayNotAllowed',
    'StartTimeOutsideConfig',
    'EndTimeOutsideConfig',
    'BookingSpansClosedHours'
  ];

  if (!knownErrors.includes(err.message)) {
    console.error(err)
  }
  
  if (err.message === 'CapacityExceeded') {
    return c.json({ error: 'CapacityExceeded' }, 409)
  }
  
  if (err.message === 'ResourceNotFound' || err.message === 'BookingNotFound') {
    return c.json({ error: 'NotFound' }, 404)
  }

  if (err.message === 'ResourceDoesNotBelongToProject' || err.message === 'BookingDoesNotBelongToProject') {
    return c.json({ error: 'Forbidden' }, 403)
  }

  if (
    err.message === 'InvalidTimeRange' || 
    err.message === 'BookingAlreadyCancelled' ||
    err.message === 'DayNotAllowed' ||
    err.message === 'StartTimeOutsideConfig' ||
    err.message === 'EndTimeOutsideConfig' ||
    err.message === 'BookingSpansClosedHours'
  ) {
      return c.json({ error: err.message }, 400)
  }

  // Handle Deno/Zod OpenApi Registry Error specifically
  if (err instanceof TypeError && err.message.includes("reading 'parent'")) {
    return c.json({ error: 'OpenAPI Generation Error', message: 'Deno/Zod compatibility issue. The API works, but Swagger UI is unavailable in this environment.' }, 500)
  }

  // Zod Errors (often wrapped or thrown directly depending on usage)
  if (err instanceof Error && 'issues' in err) {
    return c.json({ error: 'ValidationError', issues: (err as any).issues }, 400)
  }

  return c.json({ error: 'InternalServerError', message: err.message }, 500)
})

// Routes
app.route('/users', users)
app.route('/projects', projects)
app.route('/resources', resources)
app.route('/bookings', bookings)

app.get('/doc', (c) => c.json(openapiSpec))

// Swagger UI
app.get('/ui', swaggerUI({ url: '/doc' }))

// Serve Frontend (Static Files)
const getContent = async (path: string) => {
  try {
    return await Deno.readFile(path)
  } catch (e) {
    return null
  }
}

app.use('/*', serveStatic({ root: './frontend/dist', getContent }))

// SPA Fallback (Serve index.html for unknown routes)
app.get('*', serveStatic({ path: './frontend/dist/index.html', getContent }))
