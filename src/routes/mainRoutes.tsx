import { Routes, Route } from 'react-router-dom'
import { PRIVATE_ROUTES } from '~/constants/private-routes.tsx'
import { Suspense } from 'react'
import { PUBLIC_ROUTES } from '~/constants/public-routes.tsx'
import RequireAuth from '~/utils/RequiredAuth.tsx'

export const MainRoutes = () => {
  return (
    <Routes>
      {PUBLIC_ROUTES.map((item, index) => {
        return (
          <Route
            key={index}
            path={item.path}
            element={
              <Suspense>
                <item.component />
              </Suspense>
            }
          />
        )
      })}
      {PRIVATE_ROUTES.map((item, index) => {
        return (
          <RequireAuth key={index} allowedRoles={item.allowedRoles}>
            <Route
              path={item.path}
              element={
                <Suspense>
                  <item.component />
                </Suspense>
              }
            />
          </RequireAuth>
        )
      })}
    </Routes>
  )
}
