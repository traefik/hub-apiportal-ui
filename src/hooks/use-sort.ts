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

import _ from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'

export interface GetValueType<T extends Record<string, unknown>> {
  (data: T): string | number
}

export interface ToggleSortingType<T extends Record<string, unknown>> {
  (key: string, getValue?: GetValueType<T>): void
}

export interface SortingStateType<T extends Record<string, unknown>> {
  key: string
  getValue?: GetValueType<T>
  order: 'asc' | 'desc'
}

export type Options = {
  disabled?: boolean
}

export const useSort = <T extends Record<string, unknown>>(
  data: T[] = [],
  defaultSorting: SortingStateType<T> = {
    key: 'id',
    order: 'asc',
  },
  options: Options = { disabled: false },
): [T[], SortingStateType<T>, ToggleSortingType<T>] => {
  const { disabled } = options

  const [sorting, setSorting] = useState<SortingStateType<T>>(defaultSorting)
  const [sortedData, setSortedData] = useState<T[]>(data)

  const toggleSorting = useCallback(
    (key: string, getValue: GetValueType<T> | undefined): void => {
      setSorting({
        key,
        getValue,
        order: sorting.key === key && sorting.order === 'asc' ? 'desc' : 'asc',
      })
    },
    [sorting, setSorting],
  )

  const getValue = useMemo(
    () =>
      sorting.getValue ||
      function (o: any) {
        if (!o) return null
        const props = Object.keys(o)
        const value = _.get(o, sorting.key)
        if (typeof value === 'undefined') {
          return props?.[0] || _.get(o, 'id')
        }
        return value
      },
    [sorting],
  )

  useEffect(() => {
    if (disabled || !data?.length) {
      return setSortedData(data)
    }

    const sampleValue = getValue(data?.[0])

    if (typeof sampleValue !== 'undefined') {
      if (typeof sampleValue === 'boolean' || typeof sampleValue === 'string') {
        const newData = [...data].sort((a, b) => {
          const valueA = `${getValue(a)}`.toUpperCase() // ignore upper and lowercase
          const valueB = `${getValue(b)}`.toUpperCase() // ignore upper and lowercase

          if (valueA < valueB) {
            return sorting.order === 'asc' ? -1 : 1
          }

          if (valueA > valueB) {
            return sorting.order === 'asc' ? 1 : -1
          }

          return 0
        })

        setSortedData(newData)
      } else if (typeof sampleValue === 'number') {
        const newData = [...data].sort((a, b) => {
          if (sorting.order === 'asc') {
            return (getValue(a) as number) - (getValue(b) as number)
          }

          return (getValue(b) as number) - (getValue(a) as number)
        })

        setSortedData(newData)
      } else if (Array.isArray(sampleValue)) {
        const newData = [...data].sort((a, b) => {
          if (sorting.order === 'asc') {
            return (getValue(a).length as number) - (getValue(b).length as number)
          }

          return (getValue(b).length as number) - (getValue(a).length as number)
        })

        setSortedData(newData)
      } else {
        setSortedData(data)
      }
    }
  }, [data, disabled, getValue, sorting.order])

  return [sortedData, sorting, toggleSorting]
}
