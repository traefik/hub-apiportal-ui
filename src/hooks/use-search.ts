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

import { ChangeEvent, useCallback } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { StringParam, useQueryParam } from 'use-query-params'

type SetSearch = (newValue: string, updateType?: 'pushIn' | 'push' | 'replaceIn' | 'replace') => void

type useDebouncedQuerySearchType = (
  urlPropName?: string,
  debounceDelayMs?: number,
) => [string | undefined, SetSearch, (e: string | ChangeEvent<HTMLInputElement>) => void]

export const useDebouncedQuerySearch: useDebouncedQuerySearchType = (urlPropName = 'search', debounceDelayMs = 500) => {
  const [search, setSearch] = useQueryParam(urlPropName, StringParam)
  const onInputChange = useCallback(
    (e: string | ChangeEvent<HTMLInputElement>): void => {
      setSearch((typeof e === 'string' ? e : e?.target?.value) || undefined)
    },
    [setSearch],
  )
  const debouncedOnInputChange = useDebouncedCallback(onInputChange, debounceDelayMs)

  return [search as string | undefined, setSearch, debouncedOnInputChange]
}
