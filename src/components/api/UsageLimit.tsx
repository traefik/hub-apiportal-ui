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

import { CSS, Flex, Skeleton, Text } from '@traefiklabs/faency'
import React, { useMemo } from 'react'

import { formatUsageLimitDisplay } from 'utils/usage'

type UsageLimitProps = {
  limit?: API.UsageLimit
  isQuota?: boolean
  textSize?: number
  direction?: 'row' | 'column'
  description?: string
  noLabel?: boolean
  css?: CSS
}

export default function UsageLimit({
  limit,
  isQuota,
  textSize = 3,
  direction = 'row',
  description,
  noLabel = false,
  css = {},
}: UsageLimitProps) {
  const limitString = useMemo(() => formatUsageLimitDisplay(limit), [limit])

  return (
    <Flex gap={2} css={direction === 'row' ? { maxWidth: '50%', ...css } : css} direction={direction}>
      <Text size={textSize} css={{ fontWeight: '$semiBold', visibility: noLabel ? 'hidden' : 'visible' }}>
        {isQuota ? 'Quota' : 'Rate limit'}
      </Text>
      {!!description && <Text css={{ color: 'inherit' }}>{description}</Text>}

      <Text css={{ color: 'inherit' }} size={textSize}>
        {limitString}
      </Text>
    </Flex>
  )
}

export const UsageLimitSkeleton = ({ direction }) => {
  return (
    <Flex gap={2} css={direction === 'row' ? { maxWidth: '50%' } : {}} direction={direction}>
      <Skeleton css={{ width: 125 }} />
      <Skeleton css={{ width: 150 }} />
    </Flex>
  )
}
