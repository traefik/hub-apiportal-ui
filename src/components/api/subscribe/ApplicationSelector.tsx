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

import { Box, CSS } from '@traefiklabs/faency'
import { useFormikContext, useField } from 'formik'
import { sortBy } from 'lodash'
import qs from 'query-string'
import React, { useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { getApplicationSelfSubscription } from 'components/api/subscribe/utils'
import AdvancedSelectField from 'components/forms/AdvancedSelectField'
import { APPLICATIONS_URL } from 'hooks/query/use-applications'
import useToasts from 'hooks/use-toasts'
import { isTheSamePlanLimit } from 'utils/resource'

type ApplicationSelectorProps = {
  css?: CSS
  plans?: API.Plan[]
  subscriptions?: API.APISubscription[]
}

const ApplicationSelector = ({ css, plans = [], subscriptions = [] }: ApplicationSelectorProps) => {
  const { apiId } = useParams()
  const [, meta] = useField('appId')
  const { errors, setFieldValue, values } = useFormikContext<Forms.APISubscription | Forms.APIBundleSubscription>()
  const { addToast } = useToasts()

  const loadOptions = useCallback(
    async (changeProps) => {
      const queryParams = {
        ...(changeProps ? { search: changeProps } : {}),
      }

      try {
        const res = await fetch(
          qs.stringifyUrl({
            url: APPLICATIONS_URL,
            query: queryParams,
          }),
        )

        const applications: API.Application[] = await res.json()
        return {
          options: sortBy(
            applications.filter((application) => !application.isManaged),
            ['name'],
          ),
        }
      } catch (e) {
        console.error(e)
        addToast({
          severity: 'error',
          message: 'There was an error while trying to fetch the applications.',
          timeout: 60000,
        })
      }
    },
    [addToast],
  )

  const hasError = useMemo(() => {
    return meta.touched && !!errors.appId
  }, [errors, meta.touched])

  const onChange = useCallback(
    (opt: API.Application) => {
      setFieldValue('appName', opt.name)
      setFieldValue('appId', opt.appId)
      const activeSubscription = getApplicationSelfSubscription(opt.appId, subscriptions)
      const availablePlans = plans.filter((plan) => !isTheSamePlanLimit(activeSubscription?.plan, plan))
      const selectedPlan = values.selectedPlanName
        ? plans?.find(({ name }) => name === values.selectedPlanName)
        : undefined
      if (!availablePlans.find((plan) => plan.name === selectedPlan?.name)) {
        setFieldValue('selectedPlanName', availablePlans[0]?.name || '')
      }
    },
    [plans, setFieldValue, subscriptions, values.selectedPlanName],
  )

  return (
    <Box css={css}>
      <AdvancedSelectField
        name="appId"
        key={`application-selector-${apiId}`}
        placeholder="Select an application"
        getOptionValue={(opt: API.Application) => opt.appId}
        formatOptionLabel={(opt: API.Application) => opt.name}
        loadOptions={loadOptions}
        css={{ width: '100%' }}
        invalid={hasError}
        onChange={onChange}
      />
    </Box>
  )
}

export default ApplicationSelector
