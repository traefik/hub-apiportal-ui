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

import { useCallback } from 'react'

import { GetValueType, SortingStateType, ToggleSortingType } from 'hooks/use-sort'

export const useSortHelpers = <T extends Record<string, unknown>>(
  sortingState?: SortingStateType<T>,
  toggleSorting?: ToggleSortingType<T>,
) => {
  const onSort = useCallback(
    (key: string, getValue?: GetValueType<T>) => (toggleSorting ? () => toggleSorting(key, getValue) : undefined),
    [toggleSorting],
  )
  const order = useCallback(
    (key: string) => (sortingState?.key === key && sortingState?.order) || undefined,
    [sortingState?.key, sortingState?.order],
  )
  return { onSort, order }
}
