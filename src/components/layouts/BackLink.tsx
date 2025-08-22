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

import { Button, Flex } from '@traefiklabs/faency'
import React, { useMemo } from 'react'
import { FiChevronLeft } from 'react-icons/fi'
import { Link, matchPath, useSearchParams } from 'react-router-dom'

import { ROUTES } from 'Routes'

const TEMPLATE_TO_LABEL = {
  '/api-catalog': 'API catalog',
  '/api-catalog/apis/:apiId': 'API catalog',
  '/api-catalog/apis/:apiId/overview': 'API catalog',
  '/api-catalog/apis/:apiId/versions/:apiVersion': 'API catalog',
  '/api-catalog/bundles/:apiBundleId/apis/:apiId': 'API catalog',
  '/api-catalog/bundles/:apiBundleId/apis/:apiId/overview': 'API catalog',
  '/api-catalog/bundles/:apiBundleId/apis/:apiId/versions/:apiVersion': 'API catalog',
  '/applications': 'Applications',
  '/applications/:id': 'Application',
}

export default function BackLink() {
  const [searchParams] = useSearchParams()

  const allTheRoutes = useMemo(() => ['/api-catalog', ...ROUTES.map(({ path }) => path)], [])

  const [to, label] = useMemo((): [string?, string?] => {
    const returnTo = searchParams.get('returnTo')
    if (returnTo) {
      for (const route of allTheRoutes) {
        if (matchPath(route, returnTo?.split('?')[0])) {
          return [returnTo, TEMPLATE_TO_LABEL[route]]
        }
      }
    }
    return []
  }, [allTheRoutes, searchParams])

  return (
    <Flex align="center" css={{ height: '40px', mb: '$2' }}>
      {to ? (
        <Link to={to}>
          <Button type="button" ghost variant="secondary" css={{ p: 0, pr: '$2', borderRadius: 0, boxShadow: 'none' }}>
            <FiChevronLeft size={20} />
            {label}
          </Button>
        </Link>
      ) : null}
    </Flex>
  )
}
