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

import { describe, test, expect } from 'vitest'
import { getPositionValues } from 'utils/position'

describe('utils/position', () => {
  describe('getPositionValues', () => {
    test.each([
      { payload: ['left', 'bottom'], expected: { left: 0, bottom: 0 } },
      { payload: ['right', 'top'], expected: { right: 0, top: 0 } },
      { payload: [], expected: { left: 0, right: 0, bottom: 0 } },
    ])('must return "$expected" for $payload', ({ payload, expected }) => {
      expect(getPositionValues(...(payload as any))).toStrictEqual(expected)
    })
  })
})
