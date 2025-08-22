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

export const addThousandSeparator = new Intl.NumberFormat('fr-FR') // the locale that use space is FR

export const formatUsageLimitDisplay = (usage?: API.UsageLimit) => {
  if (!usage || usage.period == '0s') return 'Unlimited'
  const requests = `${addThousandSeparator.format(usage.limit)} req`
  return `${requests} / ${usage.period}`
}

export const getNormalized = (data?: { limit: number; period?: string }): number => {
  if (!data) return 31536000 // 12 months in seconds, a significant value to use when the plan is unlimited.

  const { limit, period } = data
  if (!limit) return 0 // Malformed: a limit must always be defined.

  const match = (period || '1s').match(/^(\d+)([a-zA-Z]+)$/)
  if (!match) return limit

  const periodAmount = parseInt(match[1], 10)
  const periodUnit = match[2]

  switch (periodUnit) {
    case 's':
      return limit / periodAmount
    case 'm':
      return (limit / periodAmount) * 60
    case 'h':
      return (limit / periodAmount) * 3600
    default:
      return limit
  }
}
