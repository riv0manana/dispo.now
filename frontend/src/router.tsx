// deno-lint-ignore-file no-sloppy-imports
import { createRouter, createRoute, lazyRouteComponent } from '@tanstack/react-router'
import { Route as rootRoute } from './routes/__root'

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: lazyRouteComponent(() => import('./routes/index').then((d) => ({ default: d.LandingRoute }))),
})

const docsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/docs',
  component: lazyRouteComponent(() => import('./routes/docs/index').then((d) => ({ default: d.DocsRoute }))),
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: lazyRouteComponent(() => import('./routes/login').then((d) => ({ default: d.LoginRoute }))),
})

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: lazyRouteComponent(() => import('./routes/register').then((d) => ({ default: d.RegisterRoute }))),
})

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: lazyRouteComponent(() => import('./components/DashboardLayout').then((d) => ({ default: d.DashboardLayout }))),
})

const dashboardIndexRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '/',
  component: lazyRouteComponent(() => import('./routes/dashboard/index').then((d) => ({ default: d.DashboardIndex }))),
})

const projectDetailRoute = createRoute({
  getParentRoute: () => dashboardRoute,
  path: '$projectId',
  component: lazyRouteComponent(() => import('./routes/dashboard/project').then((d) => ({ default: d.ProjectDetailRoute }))),
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
