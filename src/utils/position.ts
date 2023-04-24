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

export type PositionXProps = 'left' | 'center' | 'right'
export type PositionYProps = 'top' | 'bottom'

type GetPositionType = {
  top?: number
  bottom?: number
  left?: number
  right?: number
}

export function getPositionValues(positionX: PositionXProps, positionY: PositionYProps): GetPositionType {
  const position: GetPositionType = {}

  switch (positionX) {
    case 'left':
      position.left = 0
      break
    case 'center':
      position.left = 0
      position.right = 0
      break
    case 'right':
      position.right = 0
      break
  }

  switch (positionY) {
    case 'top':
      position.top = 0
      break
    case 'bottom':
      position.bottom = 0
      break
  }

  return position
}
