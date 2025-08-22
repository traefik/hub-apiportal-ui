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

import { useField } from 'formik'
import React from 'react'

import Checkbox from 'components/forms/Checkbox'

type CheckboxFieldProps = {
  disabled?: boolean
  label?: string
  name: string
}

const CheckboxField = ({ disabled, label, name }: CheckboxFieldProps) => {
  const [{ value }, , { setValue }] = useField<boolean>(name)

  return <Checkbox checked={value} disabled={disabled} label={label} name={name} onCheckedChange={setValue} />
}

export default CheckboxField
