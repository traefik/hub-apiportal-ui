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

import { AriaTable, AriaTbody, AriaTd, AriaTh, AriaThead, AriaTr, Text } from '@traefiklabs/faency'
import { FieldArrayRenderProps, useField, useFormikContext } from 'formik'
import React, { useEffect, useMemo } from 'react'

import { PlanSelectorDropdown } from './PlanSelector'
import { EXISTING_PLAN_NAME, getApplicationSelfSubscription } from './utils'

import { isTheSamePlanLimit } from 'utils/resource'
import { formatUsageLimitDisplay } from 'utils/usage'

type ApiRowProps = {
  api: Forms.APIWithSelectedPlanName
  apiBundlePlans?: API.Plan[]
  name: string
  apiBundleSelectedPlan?: API.Plan
}

const ApiRow = ({ api, apiBundlePlans, name, apiBundleSelectedPlan }: ApiRowProps) => {
  const { values, setFieldValue } = useFormikContext<Forms.APIBundleSubscription>()
  const [{ value }, { touched }] = useField<Forms.APIWithSelectedPlanName>(name)

  const selectedPlan = useMemo(() => {
    if (value.selectedPlanName === EXISTING_PLAN_NAME) {
      const subscription = getApplicationSelfSubscription(values.appId, api.subscriptions)
      return subscription?.plan
    }
    if (value.selectedPlanName) {
      return apiBundlePlans?.find((plan) => plan.name === value.selectedPlanName)
    }
  }, [api.subscriptions, apiBundlePlans, value.selectedPlanName, values.appId])

  const availablePlans = useMemo(() => {
    const subscription = getApplicationSelfSubscription(values.appId, api.subscriptions)
    const plans = apiBundlePlans?.filter((plan) => !isTheSamePlanLimit(plan, subscription?.plan)) || []
    return subscription?.plan ? [{ name: EXISTING_PLAN_NAME, title: 'Keep existing' }, ...plans] : plans
  }, [api.subscriptions, apiBundlePlans, values.appId])

  useEffect(() => {
    if (!apiBundleSelectedPlan) return

    const currentPlan = getApplicationSelfSubscription(values.appId, api.subscriptions)?.plan
    const updatedApi = { ...api, selectedPlanName: api.selectedPlanName || '' }

    // initialize value
    if (!touched) {
      updatedApi.selectedPlanName = apiBundleSelectedPlan.name
    }

    // the following block of code controls values related to the "keep existing plan" checkbox
    // so we only take APIs with a current active subscriptions for this
    if (currentPlan) {
      if (values.keepExistingPlan) {
        // keep the existing plan
        updatedApi.selectedPlanName = EXISTING_PLAN_NAME
      } else {
        // only update the value if the field is untouched OR it still has a "keep existing" value
        if (!touched || api.selectedPlanName === EXISTING_PLAN_NAME) {
          // if the current plan is the same as the selected plan for the bundle, keep the existing one
          if (isTheSamePlanLimit(currentPlan, apiBundleSelectedPlan)) {
            updatedApi.selectedPlanName = EXISTING_PLAN_NAME
          } else {
            updatedApi.selectedPlanName = apiBundleSelectedPlan.name
          }
        }
      }
    }

    setFieldValue(name, updatedApi)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.appId, values.keepExistingPlan, values.selectedPlanName])

  return (
    <AriaTr css={{ height: '64px' }} data-testid="subscription-table-row">
      <AriaTd>
        <Text>{api.name}</Text>
      </AriaTd>

      <AriaTd>
        <PlanSelectorDropdown name={`${name}.selectedPlanName`} plans={availablePlans} />
      </AriaTd>

      <AriaTd>
        <Text>{formatUsageLimitDisplay(selectedPlan?.rateLimit)}</Text>
      </AriaTd>

      <AriaTd>
        <Text>{formatUsageLimitDisplay(selectedPlan?.quota)}</Text>
      </AriaTd>
    </AriaTr>
  )
}

type ApiSubscriptionSummary = FieldArrayRenderProps & {
  apiBundlePlans?: API.Plan[]
  apiBundleSelectedPlan?: API.Plan
}

const ApiSubscriptionSummary = ({ apiBundlePlans, name, apiBundleSelectedPlan }: ApiSubscriptionSummary) => {
  const { values } = useFormikContext<Forms.APIBundleSubscription>()

  return (
    <AriaTable css={{ overflow: 'auto', border: 'var(--borders-layoutSection)', borderRadius: 0, boxShadow: 'none' }}>
      <AriaThead>
        <AriaTr>
          <AriaTh>API</AriaTh>
          <AriaTh>Plan</AriaTh>
          <AriaTh>Rate limit</AriaTh>
          <AriaTh>Quota</AriaTh>
        </AriaTr>
      </AriaThead>

      <AriaTbody>
        {values.apis.map((api, idx) => (
          <ApiRow
            key={`api-bundle-subs-${idx}`}
            name={`${name}.${idx}`}
            api={api}
            apiBundlePlans={apiBundlePlans}
            apiBundleSelectedPlan={apiBundleSelectedPlan}
          />
        ))}
      </AriaTbody>
    </AriaTable>
  )
}

export default ApiSubscriptionSummary
