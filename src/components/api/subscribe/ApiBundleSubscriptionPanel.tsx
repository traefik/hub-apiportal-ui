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

import { Box, Button, DialogTitle, Flex, H2, SidePanel, Text, VisuallyHidden } from '@traefiklabs/faency'
import { Formik, Form, useFormikContext, FieldArray } from 'formik'
import { AnimatePresence } from 'framer-motion'
import React, { useCallback, useMemo } from 'react'

import ApiSubscriptionSummary from './ApiSubscriptionSummary'
import ApplicationSelector from './ApplicationSelector'
import PlanSelector from './PlanSelector'
import { apiBundleSubscriptionSchema, API_SUBSCRIPTION_INITIAL_VALUES } from './schema'
import { buildSubscriptionPayload, EXISTING_PLAN_NAME } from './utils'

import CheckboxField from 'components/forms/CheckboxField'
import useLazyFetch from 'hooks/fetcher/use-lazy-fetch'
import useInvalidateQueries from 'hooks/query/use-invalidate-queries'
import { PORTAL_URL } from 'hooks/query/use-portal'
import useToasts from 'hooks/use-toasts'

type FormikFormProps = {
  apiBundle: API.APIBundle
  onCancel: () => void
  isLoading: boolean
}

const FormikForm = ({ apiBundle, onCancel, isLoading }: FormikFormProps) => {
  const { values } = useFormikContext<Forms.APIBundleSubscription>()

  const availablePlans = useMemo(() => apiBundle.plans || [], [apiBundle.plans])

  const selectedPlan = useMemo(
    () =>
      values.selectedPlanName
        ? apiBundle.plans?.find(({ name }) => name === values.selectedPlanName)
        : apiBundle.plans?.[0],
    [apiBundle.plans, values.selectedPlanName],
  )

  return (
    <Form>
      <Flex direction="column" gap={6}>
        <Flex direction="column" gap={2}>
          <Text>Select an application:</Text>
          <ApplicationSelector plans={apiBundle.plans} subscriptions={[]} />
        </Flex>

        <Flex direction="column" gap={2}>
          <Text>
            {availablePlans.length ? 'Select a plan:' : 'There are no available plans to subscribe to at the moment.'}
          </Text>
          <Box css={{ my: '$2' }}>
            <CheckboxField name={`keepExistingPlan`} label="Keep existing plan" />
          </Box>
          <PlanSelector
            plans={availablePlans}
            resourceName={apiBundle.name}
            css={{ flex: 1 }}
            selectedPlan={selectedPlan as API.Plan}
          />
        </Flex>

        {values.appId && values.selectedPlanName && (
          <AnimatePresence>
            <Flex direction="column" gap={4}>
              <Text css={{ fontSize: '$4' }}>Your subscription choice for {apiBundle.name}:</Text>
              <Flex align="center" gap={2}>
                <Text css={{ fontSize: '$4', fontWeight: 'bold' }}>{values.appName}</Text>
              </Flex>
              <FieldArray
                name="apis"
                render={(arrayProps) => (
                  <ApiSubscriptionSummary
                    apiBundlePlans={apiBundle.plans}
                    apiBundleSelectedPlan={selectedPlan}
                    {...arrayProps}
                  />
                )}
              />
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

const ApiBundleSubscriptionForm = ({ apiBundle, onCancel }: { apiBundle: API.APIBundle; onCancel: () => void }) => {
  const invalidateQueries = useInvalidateQueries()
  const [subscribe, { loading }] = useLazyFetch('./api/self-service-subscriptions', { method: 'POST' })
  const { addToast } = useToasts()

  const handleSubmit = useCallback(
    async (values: Forms.APIBundleSubscription) => {
      try {
        const payload = values.apis
          .filter((api) => api.selectedPlanName !== EXISTING_PLAN_NAME)
          .map((api) => {
            const { selectedPlanName } = api
            const plan = apiBundle.plans?.find((plan) => plan.name === selectedPlanName)
            if (!plan) throw new Error(`The plan named ${selectedPlanName} could not be found.`)

            return buildSubscriptionPayload({
              appId: values.appId,
              plan: { name: plan.name, title: plan.title },
              rateLimit: plan.rateLimit,
              quota: plan.quota,
              operationFilter: plan.operationFilter,
              api,
            })
          })
        await subscribe({
          body: JSON.stringify(payload),
        })
        invalidateQueries({ queryKey: [PORTAL_URL] })
        addToast({
          severity: 'success',
          message: 'Successfully subscribed to the APIs',
        })
        onCancel()
      } catch (err) {
        console.error(err)
        onCancel()
        addToast({
          severity: 'error',
          message: 'Something went wrong while subscribing to the API bundle, please try again later',
          timeout: 60000,
        })
      }
    },
    [addToast, apiBundle.plans, invalidateQueries, onCancel, subscribe],
  )

  const initialValues = useMemo(
    () => ({
      ...API_SUBSCRIPTION_INITIAL_VALUES,
      apis: apiBundle.apis.map((api) => ({ ...api, selectedPlanName: '' })),
    }),
    [apiBundle.apis],
  )

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={apiBundleSubscriptionSchema}>
      <FormikForm apiBundle={apiBundle} onCancel={onCancel} isLoading={loading} />
    </Formik>
  )
}
const SubscriptionPanel = ({ isOpen, onOpenChange, apiBundle }) => {
  return (
    <SidePanel
      open={isOpen}
      onOpenChange={onOpenChange}
      css={{ width: 650 }}
      description="api bundle subscription form"
    >
      <VisuallyHidden>
        <DialogTitle>API bundle subscription form</DialogTitle>
      </VisuallyHidden>
      <Flex direction="column" css={{ pt: '$4' }} gap={6}>
        <H2>Subscribe to {apiBundle.title}</H2>
        <ApiBundleSubscriptionForm apiBundle={apiBundle} onCancel={() => onOpenChange(false)} />
      </Flex>
    </SidePanel>
  )
}

export default SubscriptionPanel
