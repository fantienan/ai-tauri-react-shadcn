import MapPage from '@/pages/map'
import { useAppStore } from '@/stores'
import { User } from '@/types'
import { Link, Navigate, Outlet, RouterProvider, createBrowserRouter, useLoaderData, useRouteError } from 'react-router'

function RootErrorBoundary() {
  let error = useRouteError() as Error
  return (
    <div>
      <h1>Uh oh, something went terribly wrong 😩</h1>
      <pre>{error.message || JSON.stringify(error)}</pre>
      <button onClick={() => (window.location.href = '/')}>Click here to reload the app</button>
    </div>
  )
}
function NoMatch() {
  return (
    <div>
      <h1>404 未找到</h1>
      <p>抱歉，您要查找的页面不存在</p>
      <Link to="/">单击此处重新加载应用程序</Link>
    </div>
  )
}
function Layout() {
  const data = useLoaderData() as { user: User }
  if (!data.user) return <Navigate replace to="/login" />
  return (
    <>
      <Navigate replace to="/chat" />
      <Outlet />
    </>
  )
}
const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <RootErrorBoundary />,
    Component: Layout,
    loader: async () => ({ user: await useAppStore.getState().getUserInfo() }),
    children: [
      {
        path: 'map',
        element: <MapPage />,
      },
      {
        path: 'chat',
        lazy: async () => ({ Component: (await import('@/pages/chat')).default }),
      },
      {
        path: 'chat/:id',
        lazy: async () => ({ Component: (await import('@/pages/chat')).default }),
      },
    ],
  },
  {
    path: '/login',
    lazy: async () => ({ Component: (await import('@/pages/login')).default }),
  },
  {
    path: '*',
    element: <NoMatch />,
  },
])

if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose())
}

export const createRouter = () => <RouterProvider router={router} />
