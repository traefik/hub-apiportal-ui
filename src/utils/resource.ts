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

export const getId = (resource: { name: string; namespace: string }) => {
  if (!resource) return null

  return `${resource.name}@${resource.namespace}`
}

export const isTheSameUsageLimit = (res1?: API.UsageLimit, res2?: API.UsageLimit) => {
  if (!res1 && !res2) return true
  if (!res1 || !res2) return false

  return res1.limit === res2.limit && res1.period === res2.period
}

export const isTheSamePlanLimit = (plan1?: API.Plan, plan2?: API.Plan) => {
  if (!plan1 && !plan2) return true
  if (!plan1 || !plan2) return false

  return isTheSameUsageLimit(plan1.quota, plan2.quota) && isTheSameUsageLimit(plan1.rateLimit, plan2.rateLimit)
}
