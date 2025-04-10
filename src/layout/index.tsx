import { useAppStore } from '@/stores'
import type { User } from '@/types'
import { Navigate, Outlet, useLoaderData } from 'react-router'
import { SWRConfig } from 'swr'

export const layoutLoader = async () => ({ user: await useAppStore.getState().getUserInfo() })

export default function Layout() {
  const data = useLoaderData() as { user: User }
  if (!data.user) return <Navigate replace to="/login" />

  return (
    <SWRConfig
      value={{
        provider: () => new Map(),
        // fetcher: (i, ii) => {
        //   return fetcher(i, ii)
        // },
      }}
    >
      <Navigate to="/map" />
      <Outlet />
    </SWRConfig>
  )
}
