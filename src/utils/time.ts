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

import { format, intervalToDuration, parseISO } from 'date-fns'
import { enUS } from 'date-fns/locale'

export const getFormattedDateWithTime = (isoTime?: string) => {
  if (!isoTime) {
    return ''
  }

  const dt = parseISO(isoTime)

  // workaround to keep the month name in English, instead of directly using toLocaleString to format the date
  return format(dt, 'dd MMMM yyyy, HH:mm', { locale: enUS })
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

export const getAge = (isoDateTime: string): string => {
  const duration = intervalToDuration({ end: Date.now(), start: isoDateTime })

  const res: string[] = []
  if (duration.years) res.push(`${Math.floor(duration.years)} year${duration.years !== 1 ? 's' : ''}`)
  if (duration.months) res.push(`${Math.floor(duration.months)} month${duration.months !== 1 ? 's' : ''}`)
  if (duration.weeks) res.push(`${Math.floor(duration.weeks)} week${duration.weeks !== 1 ? 's' : ''}`)
  if (duration.days) res.push(`${Math.floor(duration.days)} day${duration.days !== 1 ? 's' : ''}`)
  if (duration.hours) res.push(`${Math.floor(duration.hours)} hour${duration.hours !== 1 ? 's' : ''}`)
  if (duration.minutes) res.push(`${Math.floor(duration.minutes)} minute${duration.minutes !== 1 ? 's' : ''}`)

  if (res.length === 1 && res[0].startsWith('0 ')) {
    return 'Now'
  }

  return res.length > 0
    ? res
        .slice(0, 2)
        .filter((x) => !x.startsWith('0 '))
        .join(', ')
    : 'Today'
}

export const formatLocaleDateTime = (isoDateTime: string): string => {
  return format(isoDateTime, 'dd MMMM yyyy, HH:mm O')
}
