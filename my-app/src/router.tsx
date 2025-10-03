import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router'
import LoginForm from './LoginForm'
import UserDetails from './UserDetails'

// Create the root route
const rootRoute = createRootRoute({
  component: () => <div><Outlet /></div>,
})

// Create the login route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LoginForm,
})

// Create the user details route
const userDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/user-details',
  component: UserDetails,
  validateSearch: (search: Record<string, unknown>) => ({
    username: (search.username as string) || '',
  }),
})

// Create the route tree
const routeTree = rootRoute.addChildren([indexRoute, userDetailsRoute])

// Create the router
export const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}