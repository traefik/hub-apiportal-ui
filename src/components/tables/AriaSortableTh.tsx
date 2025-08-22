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

import { CSS, Flex, Label, AriaTh } from '@traefiklabs/faency'
import React, { useMemo } from 'react'

import SortButton from 'components/buttons/SortButton'
import SortIcon from 'components/icons/sort'

type SortIconProps = React.ComponentProps<typeof SortIcon>
type AriaSortableThProps = {
  label: string
  isSortable?: boolean
  onSort?: () => void
  order?: SortIconProps['order']
  align?: 'left' | 'center' | 'right'
  css?: CSS
}

const styleByAlignValue = {
  left: {},
  center: {
    justifyContent: 'center',
  },
  right: {
    justifyContent: 'flex-end',
  },
}

const AriaSortableTh = ({
  label,
  isSortable = false,
  onSort = () => null,
  order,
  align = 'left',
  css,
}: AriaSortableThProps) => {
  const wrapperStyle = useMemo(() => styleByAlignValue[align], [align])

  return (
    <AriaTh css={css}>
      {isSortable && !!onSort && order !== null ? (
        <Flex align="center" css={wrapperStyle}>
          <SortButton onClick={onSort} type="button">
            <Flex align="center">
              <Label css={{ cursor: 'inherit', color: 'inherit' }}>{label}</Label>
              <SortIcon height={15} css={{ ml: '$2' }} order={order} />
            </Flex>
          </SortButton>
        </Flex>
      ) : (
        <Flex align="center" css={wrapperStyle}>
          <Label>{label}</Label>
        </Flex>
      )}
    </AriaTh>
  )
}

export default AriaSortableTh
