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

import { Flex, Label, Text } from '@traefiklabs/faency'
import { useField, useFormikContext } from 'formik'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useCallback, useMemo, useState } from 'react'

import AdvancedSelect, { AdvancedSelectProps } from 'components/forms/AdvancedSelect'

const AnimatedText = motion.create(Text)

type SelectFieldProps = {
  id?: string
  name: string
  placeholder?: string
  label?: string
  outerProps?: any
  getOptionValue?: any
  getOptionLabel?: any
  formatOptionLabel?: any
  loadOptions?: any
  options?: any[]
  disabled?: boolean
  touched?: boolean
  creatable?: boolean
  hideError?: boolean
  additionalOnChangeAction?: (v) => void
} & AdvancedSelectProps

const AdvancedSelectField = ({
  id,
  name,
  placeholder,
  label,
  getOptionValue = (opt) => opt,
  getOptionLabel = (opt) => opt,
  formatOptionLabel = (opt) => opt,
  loadOptions,
  outerProps = {},
  touched,
  disabled,
  hideError = false,
  additionalOnChangeAction,
  ...props
}: SelectFieldProps) => {
  const { css: outerPropsCss = {} } = outerProps
  const [input, meta, { setTouched, setValue }] = useField(name)
  const { error } = meta

  const [hasFocus, setHasFocus] = useState(false)

  const { isSubmitting } = useFormikContext()

  const fieldTouchedOrForceTouched = useMemo(() => meta.touched || touched, [meta, touched])
  const hasError = useMemo(() => !!error, [error])
  const invalid = useMemo(() => fieldTouchedOrForceTouched && hasError, [fieldTouchedOrForceTouched, hasError])

  const idOrName = useMemo(() => id || name, [id, name])
  const hasLabel = useMemo(() => !!label, [label])
  const labelId = useMemo(() => (hasLabel ? `${idOrName}-label` : undefined), [idOrName, hasLabel])
  const errorMessageid = useMemo(() => `${idOrName}-error`, [idOrName])

  const labelVariant = useMemo(() => {
    if (disabled) {
      return 'subtle'
    }
    if (invalid) {
      return 'invalid'
    }
    if (hasFocus) {
      return 'contrast'
    }
    return 'default'
  }, [invalid, disabled, hasFocus])

  const onChange = useCallback(
    (value) => {
      setValue(getOptionValue(value))
      if (additionalOnChangeAction) additionalOnChangeAction(getOptionValue(value))
    },
    [setValue, getOptionValue, additionalOnChangeAction],
  )

  const onBlur = useCallback(() => {
    setHasFocus(false)
    setTouched(true)
  }, [setHasFocus, setTouched])

  const onFocus = useCallback(() => {
    setHasFocus(true)
  }, [setHasFocus])

  return (
    <Flex
      {...outerProps}
      css={{
        flex: 1,
        flexDirection: 'column',
        ...outerPropsCss,
      }}
    >
      {hasLabel && (
        <Label id={labelId} htmlFor={idOrName} variant={labelVariant}>
          {label}
        </Label>
      )}
      <AdvancedSelect
        {...input}
        id={idOrName}
        aria-errormessage={errorMessageid}
        aria-invalid={hasError}
        aria-labelledby={labelId}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        formatOptionLabel={formatOptionLabel}
        getOptionValue={getOptionValue}
        getOptionLabel={getOptionLabel}
        loadOptions={loadOptions}
        disabled={disabled || isSubmitting}
        onFocus={onFocus}
        onBlur={onBlur}
        invalid={invalid}
        {...props}
      />

      {!hideError && (
        <AnimatePresence initial={false}>
          {invalid && (
            <AnimatedText
              variant="red"
              id={errorMessageid}
              role="alert"
              css={{ pt: '$2' }}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {error}
            </AnimatedText>
          )}
        </AnimatePresence>
      )}
    </Flex>
  )
}

AdvancedSelectField.displayName = 'AdvancedSelectField'

export default AdvancedSelectField
