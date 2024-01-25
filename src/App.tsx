/*
Copyright (C) 2022-2023 Traefik Labs
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.
You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
*/

import React, { lazy, useEffect, useMemo } from 'react'
import axios from 'axios'
import { FaencyProvider, globalCss, lightTheme } from '@traefiklabs/faency'
import PageLayout from 'components/PageLayout'
import { BrowserRouter, Navigate, Route, Routes as RouterRoutes } from 'react-router-dom'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

import ToastPool from 'components/ToastPool'
import { ToastProvider } from 'context/toasts'
import { usePortal } from 'hooks/use-portal'
import EmptyState from 'pages/EmptyState'
import useIsUsingJWTAuth from 'hooks/use-is-using-jwt-auth'
import NotFoundPage from 'pages/404'

const API = lazy(() => import('pages/API'))
const Settings = lazy(() => import('pages/Settings'))

const queryClient = new QueryClient()

/* axios global setup to handle 401 error status
 ** reload page when user's session end to initiate the auth flow
 */
axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response.status === 401) {
      location.reload()
      return error
    }
    return Promise.reject(error)
  },
)

const API_PATHS = [
  '/apis/:apiName',
  '/apis/:apiName/versions/:apiVersion',
  '/collections/:collectionName/apis/:apiName',
  '/collections/:collectionName/apis/:apiName/versions/:apiVersion',
]

const light = lightTheme('blue')

const bodyGlobalStyle = globalCss({
  body: {
    boxSizing: 'border-box',
    margin: 0,
  },
})

const Routes = () => {
  const { data: portal } = usePortal()
  const isUsingJWT = useIsUsingJWTAuth()

  const defaultRoute = useMemo(() => {
    if (portal?.collections) {
      for (let i = 0; i < portal.collections.length; i++) {
        if (portal.collections[i].apis?.length) {
          return portal.collections[i].apis[0].specLink
        }
      }
    }

    return portal?.apis?.[0]?.specLink
  }, [portal])

  return (
    <>
      <Helmet>
        <script src="https://unpkg.com/@stoplight/elements/web-components.min.js"></script>
      </Helmet>
      <RouterRoutes>
        {bodyGlobalStyle()}
        <Route
          path="/"
          element={
            defaultRoute ? (
              <Navigate to={defaultRoute} replace />
            ) : (
              <PageLayout portal={portal}>
                <EmptyState />
              </PageLayout>
            )
          }
        />
        {API_PATHS.map((path, key) => (
          <Route
            key={key}
            path={path}
            element={
              <PageLayout portal={portal} noGutter fixedHeight>
                <API />
              </PageLayout>
            }
          />
        ))}
        {!isUsingJWT && (
          <Route
            path="/settings"
            element={
              <PageLayout portal={portal}>
                <Settings />
              </PageLayout>
            }
          />
        )}
        <Route
          path="*"
          element={
            <PageLayout portal={portal}>
              <NotFoundPage />
            </PageLayout>
          }
        />
      </RouterRoutes>
    </>
  )
}

const App = () => {
  useEffect(() => {
    document.body.classList.add(light.toString())
  }, [])

  return (
    <ToastProvider>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <FaencyProvider>
            <BrowserRouter>
              <>
                <Routes />
                <ToastPool />
              </>
            </BrowserRouter>
          </FaencyProvider>
        </HelmetProvider>
      </QueryClientProvider>
    </ToastProvider>
  )
}

export default App
