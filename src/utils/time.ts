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

export const getExtendedUnit = ({ period, unit }: { period: number; unit: string }): string => {
  switch (unit) {
    case 'h':
      return period > 1 ? 'hours' : 'hour'
    case 'm':
      return period > 1 ? 'minutes' : 'minute'
    case 's':
      return period > 1 ? 'seconds' : 'second'
    default:
      return '?'
  }
}

export const parseDuration = (dur: string): { period: number; unit: string } | undefined => {
  if (!dur) return undefined

  const res = /^((?<hours>\d+)h)?((?<minutes>\d+)m)?((?<seconds>\d+)s)?$/.exec(dur)
  if (!res || !res.groups) return undefined

  const { hours, minutes, seconds } = res.groups

  let intHours = parseInt(hours, 10)
  let intMinutes = parseInt(minutes, 10)
  let intSeconds = parseInt(seconds, 10)

  if (isNaN(intHours)) intHours = 0
  if (isNaN(intMinutes)) intMinutes = 0
  if (isNaN(intSeconds)) intSeconds = 0

  if (seconds) {
    return { period: intHours * 3600 + intMinutes * 60 + intSeconds, unit: 's' }
  }
  if (minutes) {
    return { period: intHours * 60 + intMinutes, unit: 'm' }
  }
  return { period: intHours, unit: 'h' }
}
