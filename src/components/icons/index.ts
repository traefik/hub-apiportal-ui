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

import { CSS, Flex, VariantProps } from '@traefiklabs/faency'
import { HTMLAttributes } from 'react'

export type CustomIconProps = HTMLAttributes<SVGElement> & {
  color?: string
  fill?: string
  stroke?: string
  width?: number | string
  height?: number | string
  flexProps?: VariantProps<typeof Flex>
  css?: CSS
  viewBox?: string
}

export { default as FilterIcon } from './filter'
export { default as SortIcon } from './sort'
