import { createRouter, createRoute } from '@tanstack/react-router'
import { Route as rootRoute } from './routes/__root'
import { LandingRoute } from './routes/index'
import { DocsRoute } from './routes/docs/index'
import { LoginRoute } from './routes/login'
import { RegisterRoute } from './routes/register'
import { DashboardLayout } from './components/DashboardLayout'
import { DashboardIndex } from './routes/dashboard/index'
import { ProjectDetailRoute } from './routes/dashboard/project'

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingRoute,
})

const docsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/docs',
  component: DocsRoute,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginRoute,
})

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterRoute,
})

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardLayout,
})

const dashboardIndexRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/',
  component: DashboardIndex,
})

const projectDetailRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '$projectId',
  component: ProjectDetailRoute,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  docsRoute,
  loginRoute,
  registerRoute,
  dashboardRoute.addChildren([
    dashboardIndexRoute,
    projectDetailRoute
  ])
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
