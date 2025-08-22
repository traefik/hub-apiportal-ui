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

import { styled } from '@traefiklabs/faency'

const SortButton = styled('button', {
  border: 'none',
  margin: 0,
  padding: 0,
  overflow: 'visible',
  background: 'transparent',
  color: 'inherit',
  font: 'inherit',
  verticalAlign: 'middle',
  lineHeight: 'normal',
  '-webkit-font-smoothing': 'inherit', // @FIXME not on standard tracks https://developer.mozilla.org/en-US/docs/Web/CSS/font-smooth
  '-moz-osx-font-smoothing': 'inherit',
  '-webkit-appearance': 'none',
  '&:focus': {
    outline: 0,
    color: '$hiContrast',
  },
  '&::-moz-focus-inner': {
    // @FIXME not on standard tracks https://developer.mozilla.org/en-US/docs/Web/CSS/::-moz-focus-inner
    border: 0,
    padding: 0,
  },
  '@hover': {
    '&:hover': {
      cursor: 'pointer',
      color: '$hiContrast',
    },
  },
} as any)

export default SortButton
