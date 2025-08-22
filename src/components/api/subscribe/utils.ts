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

import { omit } from 'lodash'

// NOTE: The non-conforming name is intentional, to avoid any possible edge case conflicts.
export const EXISTING_PLAN_NAME = 'keepExisting'

export const getApplicationSelfSubscription = (appId: string, subscriptions?: API.APISubscription[]) => {
  return (subscriptions || []).find((sub) => !sub.isManaged && sub.application.appId === appId)
}

export const buildSubscriptionPayload = ({
  appId,
  plan,
  rateLimit,
  quota,
  api,
  operationFilter,
}: {
  appId: string
  plan: API.Plan
  rateLimit?: API.UsageLimit
  quota?: API.UsageLimit
  api: API.API
  operationFilter?: API.OperationFilter
}) => {
  const activeSubscription = getApplicationSelfSubscription(appId, api.subscriptions)

  return {
    ...(activeSubscription ? { id: activeSubscription.id } : {}),
    appId,
    api: {
      name: api.name,
      namespace: api.namespace,
    },
    apiPlan: {
      name: plan.name,
      namespace: api.namespace,
      title: plan.title,
    },
    operationFilter,
    rateLimit,
    ...(quota ? { quota: omit(quota, ['current']) } : {}),
  }
}
