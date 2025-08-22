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

import { CSS, Flex } from '@traefiklabs/faency'
import { useFormikContext, useField } from 'formik'
import React, { useCallback, useId, useMemo, useState } from 'react'

import PlanCard from 'components/api/PlanCard'
import AdvancedSelectField from 'components/forms/AdvancedSelectField'
import { FieldErrorText } from 'components/forms/TextFieldWithControls'

type PlanSelectorProps = {
  css?: CSS
  name?: string
  plans: API.Plan[]
  resourceName?: string
  selectedPlan: API.Plan
}

const PlanSelector = ({ css, name, plans, selectedPlan }: PlanSelectorProps) => {
  const { errors, setFieldValue, validateField } = useFormikContext<Forms.APISubscription>()
  const [activeSelection, setActiveSelection] = useState<API.Plan>(selectedPlan)
  const fieldName = useMemo(() => name || 'selectedPlanName', [name])

  const handleSelectPlan = useCallback(
    (opt: API.Plan) => {
      setFieldValue(fieldName, opt.name)
      validateField(fieldName)
    },
    [fieldName, setFieldValue, validateField],
  )

  const [, meta] = useField(fieldName)
  const hasError = useMemo(() => meta.touched && !!errors[fieldName], [errors, fieldName, meta.touched])

  return (
    <>
      <Flex css={{ width: '100%', ...css }} direction="column" gap={3} align="start">
        {plans.map((plan, idx) => (
          <PlanCard
            key={`plan-${idx}`}
            css={
              activeSelection?.name === plan.name
                ? { outline: '2px solid var(--colors-primary)', bc: '$cardBackground' }
                : {}
            }
            plan={plan}
            onClick={() => {
              setActiveSelection(plan)
              handleSelectPlan(plan)
            }}
            active={activeSelection?.name === plan.name}
          />
        ))}
      </Flex>
      {hasError && <FieldErrorText hasError={hasError} error={errors[fieldName]} />}
    </>
  )
}

export const PlanSelectorDropdown = ({ css, name, plans }: Omit<PlanSelectorProps, 'selectedPlan'>) => {
  const { errors, setFieldValue, validateField } = useFormikContext<Forms.APISubscription>()
  const id = useId()
  const fieldName = useMemo(() => name || 'selectedPlanName', [name])

  const handleSelectPlan = useCallback(
    (opt: API.Plan) => {
      setFieldValue(fieldName, opt.name)
      validateField(fieldName)
    },
    [fieldName, setFieldValue, validateField],
  )

  const [, meta] = useField(fieldName)
  const hasError = useMemo(() => meta.touched && !!errors[fieldName], [errors, fieldName, meta.touched])

  return (
    <Flex css={{ width: '100%', ...css }} direction="column" gap={2} align="start">
      <AdvancedSelectField
        name={fieldName}
        formatOptionLabel={(opt: API.Plan) => opt.title || opt.name}
        getOptionValue={(opt: API.Plan) => opt.name}
        invalid={hasError}
        key={`plan-selector-${id}`}
        onChange={(opt: API.Plan) => handleSelectPlan(opt)}
        options={plans}
        outerProps={{ css: { width: '100%' } }}
        placeholder="Select a plan"
      />
    </Flex>
  )
}

export default PlanSelector
