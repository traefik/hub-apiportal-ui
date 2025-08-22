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

declare namespace API {
  type Subscription = {
    createdAt: string
    id?: string
    name?: string
    isManaged: boolean
    plan: Plan
    suspended: boolean
  }

  type APISubscription = Subscription & {
    application: {
      name: string
      appId: string
    }
  }

  type API = {
    name: string
    namespace: string
    description?: string
    title: string
    specLink: string
    versions?: Version[]
    plans?: Plan[]
    subscriptions?: APISubscription[]
  }

  type APIBundle = {
    name: string
    namespace: string
    title: string
    apis: API[]
    plans?: Plan[]
  }

  type APIKey = {
    createdAt?: string // NOTE: createdAt is available only if the user created a secret.
    updatedAt?: string // NOTE: updatedAt is available only in self-service applications.
    suspended?: boolean
    title: string
  }

  type APIKeyCreateReq = {
    title: string
  }

  type APIKeyCreateRes = {
    token: string
  }

  type APIKeyDeleteReq = {
    title: string
  }

  type APISummary = NameAndNamespace & {
    title: string
    description?: string
  }

  type ApplicationSubscription = Subscription & {
    api: APISummary
  }

  type Application = {
    appId: string
    name: string
    owner: string
    notes: string
    apiKeys?: APIKey[]
    subscriptions?: ApplicationSubscription[]
    isManaged: boolean
  }

  type CreateApplicationReq = {
    appId: string
    name: string
    notes?: string
  }

  type Name = {
    name: string
  }

  type NameAndNamespace = Name & {
    namespace: string
  }

  type OperationFilter = {
    include: string[]
  }

  type Plan = {
    name: string
    description?: string
    title?: string
    rateLimit?: UsageLimit
    quota?: UsageLimit
    operationFilter?: OperationFilter
  }

  type Portal = {
    logoUrl?: string
    title?: string
    description?: string
    jwtAuth: boolean
    apis: API[]
    bundles?: APIBundle[]
    features?: string[]
  }

  type UsageLimit = {
    limit: number
    period: string
    current?: number
  }

  type Version = {
    semverVersion: string
    name: string
    title: string
    release: string
  }
}
