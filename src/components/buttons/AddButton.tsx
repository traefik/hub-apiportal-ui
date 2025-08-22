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

import { Button } from '@traefiklabs/faency'
import React, { ComponentProps } from 'react'
import { FiPlusCircle } from 'react-icons/fi'
import { Link } from 'react-router-dom'

import IconButton from 'components/buttons/IconButton'

type ButtonWrapperProps = {
  children: React.ReactNode
  disabled?: boolean
  href?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  target?: '_blank' | '_parent' | '_self' | '_top'
}

const ButtonWrapper = ({ children, disabled, href, onClick, target }: ButtonWrapperProps) => {
  if (disabled || typeof onClick !== 'undefined') {
    return <>{children}</>
  }
  return (
    <Link to={href as string} target={target}>
      {children}
    </Link>
  )
}

type AddButtonProps = ComponentProps<typeof Button> & {
  href?: string
  target?: '_blank' | '_parent' | '_self' | '_top'
  text: string
}

const AddButton = ({ disabled, href, onClick, target = '_self', text, ...props }: AddButtonProps) => {
  return (
    <ButtonWrapper disabled={disabled} href={href} onClick={onClick} target={target}>
      <IconButton disabled={disabled} icon={<FiPlusCircle size={20} />} onClick={onClick} text={text} {...props} />
    </ButtonWrapper>
  )
}

export default AddButton
