/*
Copyright (C) 2022-2025 Traefik Labs
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

import { Box } from '@traefiklabs/faency'
import React, { ReactNode, Suspense, lazy, useMemo } from 'react'
import { Navigate, Route, Routes as RouterRoutes } from 'react-router-dom'

import EmptyState from 'components/api/EmptyState'
import SuspenseFallback from 'components/layouts/SuspenseFallback'
import TopNavbar from 'components/layouts/top-nav/TopNavbar'
import { usePortal } from 'hooks/query/use-portal'
import NotFoundPage from 'pages/NotFoundPage'

const APICatalogPage = lazy(() => import('pages/api-catalog'))
const ApplicationCreationPage = lazy(() => import('pages/applications/new'))
const ApplicationEditingPage = lazy(() => import('pages/applications/edit'))
const ApplicationDetailsPage = lazy(() => import('pages/applications/details'))
const ApplicationListPage = lazy(() => import('pages/applications'))

export const ROUTES: { path: string; element: ReactNode }[] = [
  {
    path: '/api-catalog/apis/:apiId',
    element: <APICatalogPage />,
  },
  {
    path: '/api-catalog/apis/:apiId/versions/:apiVersion',
    element: <APICatalogPage />,
  },
  {
    path: '/api-catalog/bundles/:apiBundleId/apis/:apiId',
    element: <APICatalogPage />,
  },
  {
    path: '/api-catalog/bundles/:apiBundleId/apis/:apiId/versions/:apiVersion',
    element: <APICatalogPage />,
  },
  {
    path: '/applications',
    element: <ApplicationListPage />,
  },
  {
    path: '/applications/new',
    element: <ApplicationCreationPage />,
  },
  {
    path: '/applications/:appId',
    element: <ApplicationDetailsPage />,
  },
  {
    path: '/applications/:appId/edit',
    element: <ApplicationEditingPage />,
  },
]

export default function Routes() {
  const { data: portal } = usePortal()

  const defaultRoute = useMemo(() => {
    if (portal?.bundles) {
      for (let i = 0; i < portal.bundles.length; i++) {
        if (portal.bundles[i].apis?.length) {
          const apiBundle = portal.bundles[i]
          const namespace = apiBundle.namespace
          return `./api-catalog/bundles/${apiBundle.name}@${namespace}/apis/${apiBundle.apis?.[0].name}@${namespace}`
        }
      }
    }

    const api = portal?.apis?.[0]
    if (api) return `./api-catalog/apis/${api.name}@${api.namespace}`

    return undefined
  }, [portal])

  return (
    <Box css={{ margin: 'auto', height: '100vh' }}>
      <TopNavbar portal={portal} />
      <Suspense fallback={<SuspenseFallback />}>
        <RouterRoutes>
          <Route path="/" element={defaultRoute ? <Navigate to={defaultRoute} replace /> : <EmptyState />} />
          <Route path="/api-catalog" element={defaultRoute ? <Navigate to={defaultRoute} replace /> : <EmptyState />} />
          {ROUTES.map(({ element, path }, key) => (
            <Route key={key} path={path} element={element} />
          ))}
          <Route path="*" element={<NotFoundPage />} />
        </RouterRoutes>
      </Suspense>
    </Box>
  )
}
