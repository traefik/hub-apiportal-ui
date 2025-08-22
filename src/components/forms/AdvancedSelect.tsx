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

import { Box, CSS, css, elevationVariants } from '@traefiklabs/faency'
import React, { ReactNode, useCallback, useMemo, useState } from 'react'
import Select, { Props } from 'react-select'
import { AsyncPaginate as AsyncSelect } from 'react-select-async-paginate'
const EMPTY_VALUE = ''

export type AdvancedSelectProps = {
  id?: string
  name?: string
  value?: string
  placeholder?: string
  options?: any[]
  loadOptions?: (changeProps: any) => Promise<any>
  formatOptionLabel?: (opt: any) => ReactNode
  getOptionValue?: (opt: any) => string
  getOptionLabel?: (opt: any) => string
  onChange?: (value: any) => void
  isSearchable?: boolean
  creatable?: boolean
  creatableGroupLabel?: string
  disabled?: boolean
  invalid?: boolean
  css?: CSS
  usedValue?: any
} & Omit<Props, 'formatOptionLabel' | 'getOptionValue' | 'onChange'> &
  ({ options: any[]; loadOptions?: never } | { options?: undefined; loadOptions: (changeProps: any) => Promise<any> })

const selectStyle = css<CSS[]>({
  '&.invalid': {
    '& .advanced-select__control': {
      boxShadow: 'inset 0 0 0 1px $colors$selectInvalidBorder',
      '&:focus-visible': {
        boxShadow: `inset 0 0 0 2px $colors$selectInvalidBorder`,
      },
    },
  },

  '.advanced-select__value-container': {
    px: '$3',
    py: 0,
  },

  '.advanced-select__control': {
    height: '$7',
    backgroundColor: '$selectBg',
    border: 'none',
    borderRadius: 0,
    boxShadow: 'inset 0 0 0 1px $colors$selectBorder',

    ['&::before, &::after']: {
      boxSizing: 'border-box',
      content: '""',
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      borderRadius: 'inherit',
    },

    '&:hover': {
      '&::before': {
        backgroundColor: '$selectHoverBg',
      },
      '&::after': {
        backgroundColor: '$primary',
        opacity: 0.05,
      },
    },
  },

  '.advanced-select__dropdown-indicator': {
    color: '$selectText',
    '&:hover': {
      color: '$selectText',
    },
  },
  '.advanced-select__indicator-separator': {
    display: 'none',
  },

  '.advanced-select__control--is-focused': {
    backgroundColor: '$selectFocusBg',
    boxShadow: 'inset 0 0 0 2px $colors$selectFocusBorder',
  },

  '.advanced-select__menu': {
    ...elevationVariants[4],
    isolation: 'isolate',
    zIndex: 10,
  },

  '.advanced-select__option': {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '$selectFocusBg',
    },
  },

  '.advanced-select__option--is-focused': {
    backgroundColor: '$selectFocusBg',
  },

  '.advanced-select__group-heading': {
    fontSize: '0.875rem',
    fontWeight: 'normal',
    textTransform: 'none',
  },

  '.advanced-select__input': {
    color: '$selectText !important',
    fontSize: '$3',
  },

  '.advanced-select__placeholder': {
    color: '$selectPlaceholder',
    fontSize: '$3',
  },

  '.advanced-select__single-value': {
    color: '$selectText',
    fontSize: '$3',
  },
})

const AdvancedSelect = ({
  id,
  name,
  value,
  className = '',
  placeholder = 'Select...',
  formatOptionLabel = () => null,
  getOptionValue,
  getOptionLabel,
  formatGroupLabel,
  options: optionsProp,
  loadOptions: loadOptionsProp,
  onChange = () => null,
  isSearchable = true,
  disabled = false,
  creatable = false,
  invalid = false,
  css = {},
  usedValue: usedValueProps,
  ...props
}: AdvancedSelectProps) => {
  const [isLoading, setLoading] = useState<boolean>(false)
  const [options, setOptions] = useState<any[]>([])
  const [createdOptions, setCreatedOptions] = useState<any[]>([])

  const loadOptions = useCallback(
    async (changeProps) => {
      setLoading(true)
      if (!loadOptionsProp) {
        console.error('loadOptions and options are both undefined.')
        setLoading(false)
        return
      }
      const res = await loadOptionsProp(changeProps)
      setOptions(res.options)
      setLoading(false)

      return res
    },
    [setLoading, setOptions, loadOptionsProp],
  )

  const optionsPropOrAsync: any[] = useMemo(() => (optionsProp ? optionsProp : options), [optionsProp, options])

  const hasGroupedOptions = useMemo(
    () => (optionsPropOrAsync || []).some((option) => option?.options),
    [optionsPropOrAsync],
  )

  const fullOptionsSource = useMemo(() => {
    const flattenedOptions = hasGroupedOptions
      ? optionsPropOrAsync.reduce((acc, { options }) => acc.concat(options), [])
      : optionsPropOrAsync
    if (creatable) {
      return flattenedOptions.concat(createdOptions)
    }
    return flattenedOptions
  }, [optionsPropOrAsync, createdOptions, creatable, hasGroupedOptions])

  const valueOption = useMemo(
    () => fullOptionsSource.find((o) => (getOptionValue ? getOptionValue(o) === value : o.value === value)),
    [fullOptionsSource, getOptionValue, value],
  )
  // bind to empty value if no valueOption
  const usedValue = useMemo(() => {
    if (usedValueProps) return usedValueProps
    return valueOption === undefined ? EMPTY_VALUE : valueOption
  }, [valueOption, usedValueProps])

  const onCreatableChange = useCallback(
    (value) => {
      const existingOption = fullOptionsSource.find((option) => option === value)
      if (existingOption === undefined) {
        setCreatedOptions((prevOptions) => [...prevOptions, value])
      }
      onChange(value)
    },
    [onChange, setCreatedOptions, fullOptionsSource],
  )

  const handleChange = useMemo(
    () => (creatable ? onCreatableChange : onChange),
    [creatable, onChange, onCreatableChange],
  )

  const isAsync = useMemo(() => !optionsProp, [optionsProp])

  const commonProps = {
    inputId: id,
    value: usedValue,
    isLoading: isLoading,
    onChange: handleChange,
    placeholder: placeholder,
    formatOptionLabel: formatOptionLabel,
    getOptionValue: getOptionValue,
    getOptionLabel: getOptionLabel,
    className: `${selectStyle}${invalid ? ' invalid' : ''} ${className}`,
    classNamePrefix: 'advanced-select',
    additional: {
      page: null,
    },
    isSearchable: isSearchable,
    isDisabled: disabled,
    formatGroupLabel: formatGroupLabel,
  }

  return (
    <Box data-testid={`advanced-select-${name}`} css={css}>
      {isAsync ? (
        <AsyncSelect {...commonProps} loadOptions={loadOptions} defaultOptions {...props} />
      ) : (
        <Select options={optionsProp} {...commonProps} {...props} />
      )}
    </Box>
  )
}

export default AdvancedSelect
