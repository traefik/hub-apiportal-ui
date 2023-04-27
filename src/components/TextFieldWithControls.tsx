/*
Copyright (C) 2022-2023 Traefik Labs
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

/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react'
import { Box, Flex, TextField, Text, CSS } from '@traefiklabs/faency'
import { useField, useFormikContext } from 'formik'
import { useCallback, useMemo } from 'react'

export const FieldErrorText = ({ hasError, error, ...props }: { hasError: boolean; error: string }) => {
  return (
    <>
      {hasError && (
        <Box>
          <Text css={{ pt: '$2', whiteSpace: 'pre-wrap' }} role="alert" variant="invalid" {...props}>
            {error}
          </Text>
        </Box>
      )}
    </>
  )
}

interface TextFieldWithControlsProps {
  disabled?: boolean
  css?: CSS
  label?: string
  controls?: any
  size?: 'small' | 'medium' | 'large'
  hideErrorMsg?: boolean
  id?: string
  onChange?: () => void
  onBlur?: () => void
  errorProps?: any
}

const TextFieldWithControls = ({
  disabled,
  css,
  label,
  controls,
  size = 'large',
  hideErrorMsg = false,
  id,
  onChange = () => {},
  onBlur = () => {},
  errorProps,
  ...props
}: TextFieldWithControlsProps & React.ComponentProps<typeof TextField>) => {
  const { name } = props
  const [field, { touched, error }] = useField(props as any)
  const { isSubmitting } = useFormikContext()

  const hasError = useMemo(() => touched && !!error, [touched, error])

  const idOrName = useMemo(() => id || name, [id, name])

  const handleChange = useCallback(
    (e) => {
      field.onChange(e)
      onChange(e)
    },
    [field, onChange],
  )

  const handleBlur = useCallback(
    (e) => {
      field.onBlur(e)
      onBlur(e)
    },
    [field, onBlur],
  )

  return (
    <Box css={css}>
      <Flex align={label ? 'end' : 'center'}>
        <TextField
          size={size}
          label={label}
          state={hasError ? 'invalid' : undefined}
          disabled={disabled || isSubmitting}
          css={{ width: '100%' }}
          id={idOrName}
          {...field}
          onChange={handleChange}
          onBlur={handleBlur}
          {...props}
        />
        {controls}
      </Flex>
      <FieldErrorText hasError={hasError && !hideErrorMsg} error={error} {...errorProps} />
    </Box>
  )
}

export default TextFieldWithControls
