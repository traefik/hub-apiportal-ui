/*
Copyright (C) 2022-2023 Traefik Labs
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

import { AriaTd, CSS, Flex, Skeleton, VariantProps } from '@traefiklabs/faency'
import React from 'react'

interface AriaTdSkeletonProps extends VariantProps<typeof Skeleton> {
  css?: CSS
  flexCss?: CSS
}

export const AriaTdSkeleton = ({ css = {}, flexCss = {} }: AriaTdSkeletonProps) => (
  <AriaTd css={{ height: 38 }}>
    <Flex css={{ flexDirection: 'column', justifyContent: 'space-around', alignItems: 'flex-start', ...flexCss }}>
      <Skeleton variant="text" css={css} />
    </Flex>
  </AriaTd>
)

export default AriaTdSkeleton
