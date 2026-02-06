import { Context, Next } from 'hono'
import { cyan, green, red, yellow, gray, bold } from 'std/fmt/colors.ts'

export const httpLogger = async (c: Context, next: Next) => {
  const start = performance.now()
  const { method, path } = c.req

  await next()

  const end = performance.now()
  const duration = (end - start).toFixed(2)
  const status = c.res.status

  let statusColor = green
  if (status >= 500) statusColor = red
  else if (status >= 400) statusColor = yellow
  else if (status >= 300) statusColor = cyan

  const methodColor = (m: string) => {
    switch (m) {
      case 'GET': return cyan(m)
      case 'POST': return green(m)
      case 'PUT': return yellow(m)
      case 'DELETE': return red(m)
      default: return gray(m)
    }
  }

  console.log(
    `${gray(`[${new Date().toISOString()}]`)} ${bold(methodColor(method))} ${path} ${statusColor(String(status))} - ${duration}ms`
  )
}
