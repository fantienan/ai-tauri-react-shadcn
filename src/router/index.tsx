import RootLayout from '@/layout/layout'
import MapPage from '@/pages/map'
import { RouterProvider, createBrowserRouter } from 'react-router'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        // index: true,
        path: 'map',
        element: <MapPage />,
      },
      {
        index: true,
        // path: 'chat',
        lazy: async () => ({ Component: (await import('@/pages/chat')).default }),
      },
      {
        path: 'chat/:id',
        lazy: async () => ({ Component: (await import('@/pages/chat')).default }),
      },
    ],
  },
])
export const createRouter = () => {
  return <RouterProvider router={router} />
}
