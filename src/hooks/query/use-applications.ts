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

import useQuery from 'hooks/query/use-query'

export const APPLICATIONS_URL = './api/applications'

export function useApplicationList(search?: string) {
  const extraParams: Record<string, unknown> = {
    ...(search?.length ? { search } : {}),
  }

  const {
    data: applications,
    error,
    isError,
    isLoading,
    isSuccess,
  } = useQuery<API.Application[]>(APPLICATIONS_URL, extraParams)

  const data = useMemo(
    () =>
      applications.map<UI.ApplicationListItem>((application) => {
        const proxiedApplication: UI.ApplicationListItem = {
          ...application,
          apiKeysCount: application.apiKeys?.length || 0,
          subscriptionsCount: application.subscriptions?.length || 0,
        }
        return proxiedApplication
      }),
    [applications],
  )

  return { data, error, isError, isLoading, isSuccess }
}

export function useGetApplicationByAppId(appId?: string) {
  const { data: applications, error, isError, isLoading, isSuccess } = useQuery<API.Application[]>(APPLICATIONS_URL)

  const data = useMemo(() => {
    if (!appId) return undefined
    return applications.find((app) => app.appId === appId)
  }, [appId, applications])

  return { data, error, isError, isLoading, isSuccess }
}
