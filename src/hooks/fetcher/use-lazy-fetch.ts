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

import { useCallback, useMemo, useState } from 'react'

type FetchData<T> = (body: any) => Promise<
  | {
      data: T | null
      loading: boolean
      nextPage: undefined
      statusCode: number
    }
  | undefined
>

type LazyFetchResultMetadata<T> = {
  data: T | null
  error: any | null
  loading: boolean
  statusCode: number | null
}

type LazyFetchResult<T> = [FetchData<T>, LazyFetchResultMetadata<T>]

export default function useLazyFetch<T>(input: RequestInfo | URL, init?: RequestInit): LazyFetchResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [statusCode, setStatusCode] = useState<number | null>(null)

  const request: FetchData<T> = useCallback(
    async (body: any) => {
      setData(null)
      setError(null)
      setLoading(true)
      setStatusCode(null)
      try {
        const response = await fetch(input, { ...init, ...body })
        setStatusCode(response.status)

        if (!response.ok) {
          const error = new Error(`${response.status} ${response.statusText}`)
          setError(error)
          if (response.status === 401) {
            // Expired auth, reload the page to trigger the sign in flow.
            location.reload()
            return
          }
          throw error
        }

        let resData: T | null = null
        if (response.status !== 204) {
          try {
            resData = (await response.json()) as T
          } catch (err) {
            console.error(err)
            resData = null
          }
        }
        setData(resData)
        return {
          data: resData,
          loading: false,
          nextPage: undefined, // No pagination in the developer portal API.
          statusCode: response.status,
        }
      } catch (error) {
        setData(null)
        setError(error)
        setStatusCode(500)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [init, input],
  )

  const metadata = useMemo(() => ({ data, error, loading, statusCode }), [data, error, loading, statusCode])

  return [request, metadata]
}
