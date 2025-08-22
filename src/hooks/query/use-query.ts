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

import { useSuspenseQuery } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import qs from 'query-string'
import { useMemo } from 'react'

export default function useQuery<T>(
  fetchUrl: string,
  extraParams?: Record<string, unknown>,
  externalQueryFn?: (url: string) => Promise<T>,
) {
  const queryKey = useMemo(
    () => (Object.keys(extraParams || {}).length > 0 ? [fetchUrl, extraParams] : [fetchUrl]),
    [extraParams, fetchUrl],
  )

  const url = useMemo(() => {
    if (!extraParams || !Object.keys(extraParams).length) {
      return fetchUrl
    }
    return `${fetchUrl}?${qs.stringify(extraParams)}`
  }, [extraParams, fetchUrl])

  return useSuspenseQuery<T, AxiosError>({
    queryKey,
    queryFn: () =>
      externalQueryFn
        ? externalQueryFn(url)
        : axios
            .get(url)
            .catch((err) => {
              throw err
            })
            .then(({ data }) => data),
    refetchInterval: 10 * 1000,
  })
}
