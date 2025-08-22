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

import { AriaTable, AriaTbody, AriaTr, CSS } from '@traefiklabs/faency'
import React, { ReactNode } from 'react'

import AriaTdSkeleton from 'components/tables/AriaTdSkeleton'

type AriaTableSkeletonProps = {
  children?: ReactNode
  columns?: number
  css?: CSS
  lastColumnIsNarrow?: boolean
  rowHeight?: string
  rows?: number
  skeletonWidth?: string
}

export const AriaTableRowSkeleton = ({
  lastColumnIsNarrow = false,
  rowHeight = undefined,
  rows = 5,
  columns = 3,
  skeletonWidth = '50%',
}: AriaTableSkeletonProps) => {
  return (
    <>
      {[...Array(rows)].map((_, rowIdx) => (
        <AriaTr key={`row-${rowIdx}`} css={{ height: rowHeight }}>
          {[...Array(columns)].map((_, colIdx) => (
            <AriaTdSkeleton
              key={`row-${rowIdx}-col-${colIdx}`}
              css={{ width: colIdx === columns - 1 && lastColumnIsNarrow ? '20px' : skeletonWidth }}
            />
          ))}
        </AriaTr>
      ))}
    </>
  )
}

export default function AriaTableSkeleton({
  children,
  columns = 3,
  css = {},
  lastColumnIsNarrow = false,
  rowHeight = undefined,
  rows = 5,
  skeletonWidth = '50%',
}: AriaTableSkeletonProps) {
  return (
    <AriaTable css={{ border: 'var(--borders-layoutSection)', borderRadius: 0, boxShadow: 'none', ...css }}>
      {children ? children : null}
      <AriaTbody>
        <AriaTableRowSkeleton
          columns={columns}
          rows={rows}
          lastColumnIsNarrow={lastColumnIsNarrow}
          rowHeight={rowHeight}
          skeletonWidth={skeletonWidth}
        />
      </AriaTbody>
    </AriaTable>
  )
}
