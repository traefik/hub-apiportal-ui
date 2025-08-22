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

import * as Yup from 'yup'

export const API_SUBSCRIPTION_INITIAL_VALUES: Forms.APISubscription = {
  appId: '',
  appName: '',
  keepExistingPlan: true,
  selectedPlanName: '',
}

export const apiSubscriptionSchema = Yup.object().shape({
  appId: Yup.string().trim().required('Please select an application.'),
  selectedPlanName: Yup.string().trim().required('Please select a plan.'),
})

export const apiBundleSubscriptionSchema = apiSubscriptionSchema.shape({
  apis: Yup.array().of(
    Yup.object().shape({
      selectedPlanName: Yup.string().trim().required('Please select a plan.'),
    }),
  ),
})
