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

import axios, { AxiosError } from 'axios'

import useQuery from 'hooks/query/use-query'

export default function useVerifySpec(specUrl: string) {
  const { data } = useQuery<{
    error: AxiosError | null
    hasSpec: boolean
    hasPaths: boolean
  }>(specUrl, undefined, () =>
    axios
      .get(specUrl)
      .then((res) => ({
        error: null,
        hasSpec: true,
        hasPaths: Object.keys(res?.data?.paths || {}).length > 0,
      }))
      .catch((error: AxiosError | null) => {
        if (error?.response?.status === 404) {
          return { error: null, hasSpec: false, hasPaths: false }
        }
        return { error, hasSpec: true, hasPaths: false }
      }),
  )

  return data
}
