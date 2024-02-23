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
import { getExtendedUnit, parseDuration } from 'utils/time'

describe('utils/time', () => {
  describe('getExtendedUnit', () => {
    test.each([
      { payload: { period: 1, unit: 'h' }, expected: 'hour' },
      { payload: { period: 2, unit: 'h' }, expected: 'hours' },
      { payload: { period: 1, unit: 'm' }, expected: 'minute' },
      { payload: { period: 2, unit: 'm' }, expected: 'minutes' },
      { payload: { period: 1, unit: 's' }, expected: 'second' },
      { payload: { period: 2, unit: 's' }, expected: 'seconds' },
      { payload: { period: 0, unit: 'z' }, expected: '?' },
    ])('must return "$expected" for $payload', ({ payload, expected }) => {
      expect(getExtendedUnit(payload)).toBe(expected)
    })
  })

  describe('parseDuration', () => {
    test.each([
      { payload: '', expected: undefined },
      { payload: 's', expected: undefined },
      { payload: 'string', expected: undefined },
      { payload: '0h', expected: { period: 0, unit: 'h' } },
      { payload: '0h10m', expected: { period: 10, unit: 'm' } },
      { payload: '0h10m5s', expected: { period: 605, unit: 's' } },
      { payload: '0m', expected: { period: 0, unit: 'm' } },
      { payload: '0m5s', expected: { period: 5, unit: 's' } },
      { payload: '0s', expected: { period: 0, unit: 's' } },
      { payload: '1h', expected: { period: 1, unit: 'h' } },
      { payload: '1h10m', expected: { period: 70, unit: 'm' } },
      { payload: '1h10m5s', expected: { period: 4205, unit: 's' } },
      { payload: '1m', expected: { period: 1, unit: 'm' } },
      { payload: '1m5s', expected: { period: 65, unit: 's' } },
      { payload: '1s', expected: { period: 1, unit: 's' } },
    ])('must return $expected for "$payload"', ({ payload, expected }) => {
      expect(parseDuration(payload)).toStrictEqual(expected)
    })
  })
})
