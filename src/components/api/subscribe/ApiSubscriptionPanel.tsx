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

import { Button, DialogTitle, Flex, H2, SidePanel, Text, VisuallyHidden } from '@traefiklabs/faency'
import { Formik, Form, useFormikContext } from 'formik'
import { AnimatePresence } from 'framer-motion'
import React, { useCallback, useMemo } from 'react'

import UsageLimit from '../UsageLimit'

import ApplicationSelector from './ApplicationSelector'
import PlanSelector from './PlanSelector'
import { API_SUBSCRIPTION_INITIAL_VALUES, apiSubscriptionSchema } from './schema'
import { buildSubscriptionPayload, getApplicationSelfSubscription } from './utils'

import useLazyFetch from 'hooks/fetcher/use-lazy-fetch'
import useInvalidateQueries from 'hooks/query/use-invalidate-queries'
import { PORTAL_URL } from 'hooks/query/use-portal'
import useToasts from 'hooks/use-toasts'
import { isTheSamePlanLimit } from 'utils/resource'

const FormikForm = ({ api, onCancel, isLoading }: { api: API.API; onCancel: () => void; isLoading: boolean }) => {
  const { values } = useFormikContext<Forms.APISubscription>()

  const activeSubscription = useMemo(() => {
    if (values.appId) {
      return getApplicationSelfSubscription(values.appId, api.subscriptions)
    }

    return null
  }, [api, values.appId])

  const availablePlans = useMemo(
    () => api.plans?.filter((plan) => !isTheSamePlanLimit(activeSubscription?.plan, plan)) || [],
    [activeSubscription?.plan, api.plans],
  )

  const selectedPlan = useMemo(
    () => (values.selectedPlanName ? api.plans?.find(({ name }) => name === values.selectedPlanName) : api.plans?.[0]),
    [api.plans, values.selectedPlanName],
  )

  return (
    <Form>
      <Flex direction="column" gap={6}>
        <Flex direction="column" gap={2}>
          <Text>Select an application:</Text>
          <ApplicationSelector plans={api.plans} subscriptions={api.subscriptions} />
        </Flex>

        <Flex direction="column" gap={2}>
          <Text>
            {availablePlans.length ? 'Select a plan:' : 'There are no available plans to subscribe to at the moment.'}
          </Text>
          <PlanSelector
            key={values.appId}
            plans={availablePlans}
            resourceName={api.name}
            selectedPlan={selectedPlan as API.Plan}
          />
        </Flex>

        {values.appId && selectedPlan && !!activeSubscription && (
          <AnimatePresence>
            <Flex direction="column" gap={4}>
              <Text variant="subtle" css={{ fontSize: '$4', lineHeight: 1.3 }}>
                You have an active subscription for {api.name}. Your current subscription will be overridden by the new
                plan selection:
              </Text>

              <Flex align="center" gap={2}>
                <Text css={{ fontSize: '$4', fontWeight: 'bold' }}>{values.appName}</Text>
              </Flex>
              <Flex gap={8}>
                <Flex direction="column" gap={4}>
                  <UsageLimit
                    limit={activeSubscription.plan?.rateLimit}
                    direction="column"
                    description="Current subscription"
                    css={{ color: '$textSubtle' }}
                  />
                  <UsageLimit
                    limit={activeSubscription.plan?.quota}
                    direction="column"
                    isQuota
                    description="Current subscription"
                    css={{ color: '$textSubtle' }}
                  />
                </Flex>

                <Flex direction="column" gap={4}>
                  <UsageLimit
                    limit={selectedPlan.rateLimit}
                    direction="column"
                    description={'Selected plan'}
                    noLabel
                    css={{ fontWeight: '$bold' }}
                  />
                  <UsageLimit
                    limit={selectedPlan.quota}
                    direction="column"
                    description={'Selected plan'}
                    css={{ fontWeight: '$bold' }}
                    noLabel
                    isQuota
                  />
                </Flex>
              </Flex>
            </Flex>
          </AnimatePresence>
        )}
      </Flex>

      <Flex direction="row" gap={4} css={{ mt: '$6' }} justify="end">
        <Button type="button" ghost onClick={onCancel} css={{ borderRadius: 0 }}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!values.appId || !values.selectedPlanName}
          css={{ borderRadius: 0 }}
          state={isLoading ? 'waiting' : undefined}
        >
          Confirm
        </Button>
      </Flex>
    </Form>
  )
}

type ApiSubscriptionFormProps = {
  api: API.API
  onCancel: () => void
  selectedPlanName?: string
}

const ApiSubscriptionForm = ({ api, onCancel, selectedPlanName }: ApiSubscriptionFormProps) => {
  const invalidateQueries = useInvalidateQueries()
  const { addToast } = useToasts()

  const [subscribe, { loading }] = useLazyFetch('./api/self-service-subscriptions', {
    method: 'POST',
  })

  const handleSubmit = useCallback(
    async ({ appId, selectedPlanName }: Forms.APISubscription) => {
      try {
        const plan = api.plans?.find((plan) => plan.name === selectedPlanName)
        if (!plan) throw new Error(`The plan named ${selectedPlanName} could not be found.`)

        const payload = buildSubscriptionPayload({
          appId,
          plan: { name: plan.name, title: plan.title },
          rateLimit: plan.rateLimit,
          quota: plan.quota,
          operationFilter: plan.operationFilter,
          api,
        })

        await subscribe({
          body: JSON.stringify([payload]),
        })

        invalidateQueries({ queryKey: [PORTAL_URL] })
        addToast({
          severity: 'success',
          message: `Successfully subscribed to the API ${api.name}`,
        })
        onCancel()
      } catch (err) {
        console.error(err)
        onCancel()
        addToast({
          severity: 'error',
          message: 'Something went wrong while subscribing to the API, please try again later',
          timeout: 60000,
        })
      }
    },
    [addToast, api, invalidateQueries, onCancel, subscribe],
  )

  const initialValues = useMemo<Forms.APISubscription>(
    () => ({
      ...API_SUBSCRIPTION_INITIAL_VALUES,
      selectedPlanName: selectedPlanName || '',
    }),
    [selectedPlanName],
  )

  return (
    <Formik initialValues={initialValues} validationSchema={apiSubscriptionSchema} onSubmit={handleSubmit}>
      <FormikForm api={api} onCancel={onCancel} isLoading={loading} />
    </Formik>
  )
}

type ApiSubscriptionPanelProps = {
  api: API.API
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  selectedPlanName?: string
}
const ApiSubscriptionPanel = ({ api, isOpen, onOpenChange, selectedPlanName }: ApiSubscriptionPanelProps) => {
  return (
    <SidePanel open={isOpen} onOpenChange={onOpenChange} css={{ width: 550 }} description="api subscription form">
      <VisuallyHidden>
        <DialogTitle>API subscription form</DialogTitle>
      </VisuallyHidden>
      <Flex direction="column" css={{ pt: '$4' }} gap={6}>
        <H2>Subscribe to {api?.name}</H2>
        <ApiSubscriptionForm api={api} onCancel={() => onOpenChange(false)} selectedPlanName={selectedPlanName} />
      </Flex>
    </SidePanel>
  )
}

export default ApiSubscriptionPanel
