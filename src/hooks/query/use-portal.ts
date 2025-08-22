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

import { useMemo } from 'react'

import {
  addApiVersionsLabel,
  filterApiBySearchQuery,
  filterBundleBySearchQuery,
} from 'components/layouts/side-nav/utils'
import useQuery from 'hooks/query/use-query'

export const PORTAL_URL = './api/'

export const usePortal = (searchQuery?: string) => {
  const portalData = useQuery<API.Portal>(PORTAL_URL)

  if (searchQuery) {
    const filteredBundles: UI.APIBundleWithLabeledVersions[] | undefined = portalData?.data?.bundles
      ?.map((bundle) => filterBundleBySearchQuery(bundle, searchQuery))
      .filter((bundle) => !!bundle)

    const filteredApis: UI.APIWithLabeledVersions[] = portalData?.data?.apis
      ?.map((api) => filterApiBySearchQuery(api, searchQuery))
      .filter((api) => !!api)

    return {
      ...portalData,
      data: {
        ...portalData.data,
        bundles: filteredBundles,
        apis: filteredApis,
      },
    }
  }

  const bundlesWithLabeledVersions = portalData?.data?.bundles?.map((bundle) => ({
    ...bundle,
    apis: bundle.apis.map((api) => addApiVersionsLabel(api)),
  }))

  const apisWithLabeledVersions = portalData?.data?.apis?.map((api) => addApiVersionsLabel(api))

  return {
    ...portalData,
    data: {
      ...portalData.data,
      bundles: bundlesWithLabeledVersions,
      apis: apisWithLabeledVersions,
    },
  }
}

export const useAPI = (apiId?: string, apiBundleId?: string) => {
  const { data: portal } = usePortal()

  return useMemo(() => {
    if (!apiId) {
      return undefined
    }

    if (apiBundleId) {
      const bundle = portal?.bundles?.find((bundle) => `${bundle.name}@${bundle.namespace}` === apiBundleId)

      return bundle?.apis.find((api) => `${api.name}@${api.namespace}` === apiId)
    }
    return portal?.apis.find((api) => `${api.name}@${api.namespace}` === apiId)
  }, [apiBundleId, apiId, portal?.bundles, portal?.apis])
}

export const useJWTAuth = () => {
  const { data: portal } = usePortal()
  return portal?.jwtAuth || false
}
