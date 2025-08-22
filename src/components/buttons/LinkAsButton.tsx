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

import { CSS, Link } from '@traefiklabs/faency'
import React, { ReactNode } from 'react'

type LinkAsButtonProps = {
  onClick: (e?: any) => void
  css?: CSS
  children: ReactNode
  disabled?: boolean
}
const LinkAsButton = ({ onClick, children, css, disabled = false }: LinkAsButtonProps) => {
  return (
    <Link
      type="button"
      css={{ background: 'none', border: 'none', cursor: disabled ? 'initial' : 'pointer', ...css }}
      as="button"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Link>
  )
}

export default LinkAsButton
