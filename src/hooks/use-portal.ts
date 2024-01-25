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

import axios from 'axios'
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

export interface Portal {
  logoUrl?: string
  title?: string
  description?: string
  jwtAuth: boolean
  apis: API.Resp[]
  collections: Collection.Resp[]
}

export const usePortal = () => {
  const fetchUrl = '/api/'

  return useQuery<Portal>({
    queryKey: [fetchUrl],

    queryFn: () =>
      axios
        .get(fetchUrl)
        .then(({ data }) => data)
        .catch((error) => {
          console.error(error)
          return error
        }),
  })
}

export const useAPI = (apiName?: string, collectionName?: string) => {
  const { data: portal } = usePortal()

  return useMemo(() => {
    if (!apiName) {
      return undefined
    }

    if (!collectionName) {
      return portal?.apis.find((x) => x.name === apiName)
    }

    const collection = portal?.collections.find((x) => x.name === collectionName)
    if (!collection) {
      return undefined
    }
    return collection.apis.find((x) => x.name === apiName)
  }, [apiName, collectionName, portal])
}
