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

import { Checkbox as FaencyCheckbox, Flex, Label } from '@traefiklabs/faency'
import React, { ReactNode, useId } from 'react'

type CheckboxProps = {
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  label?: string | ReactNode
  name?: string
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = ({ checked, defaultChecked, disabled, label, name, onCheckedChange }: CheckboxProps) => {
  const id = useId()

  return (
    <Flex align="center" gap={2}>
      <FaencyCheckbox
        checked={checked}
        css={{ borderRadius: 0, cursor: 'pointer' }}
        defaultChecked={defaultChecked}
        disabled={disabled}
        id={id}
        name={name}
        onCheckedChange={onCheckedChange}
      />
      {label ? (
        <Label css={{ cursor: 'pointer', fontSize: '$3', lineHeight: 'inherit' }} htmlFor={id}>
          {label}
        </Label>
      ) : null}
    </Flex>
  )
}

export default Checkbox
