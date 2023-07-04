import { Routes, Route } from 'react-router-dom'
import { PRIVATE_ROUTES } from '~/constants/private-routes.tsx'
import { Suspense } from 'react'
import { PUBLIC_ROUTES } from '~/constants/public-routes.tsx'
import RequireAuth from '~/utils/RequiredAuth.tsx'
import MainLayout from '~/layouts/MainLayout.tsx'

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
      <Route path='/' element={<MainLayout />}>
        {PRIVATE_ROUTES.map((item, index) => {
          return (
            <Route
              path={item.path}
              key={index}
              element={
                <RequireAuth allowedRoles={item.allowedRoles}>
                  <item.component />
                </RequireAuth>
              }
            />
          )
        })}
      </Route>
    </Routes>
  )
}
