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

import React, { ComponentProps } from 'react'
import { FiEdit2 } from 'react-icons/fi'
import { Link, useLocation } from 'react-router-dom'

import IconButton from 'components/buttons/IconButton'
import { useHrefWithReturnTo } from 'hooks/use-href-with-return-to'

type EditButtonProps = Omit<ComponentProps<typeof IconButton>, 'icon'> & {
  query?: string
}

export default function EditButton({ query, ...rest }: EditButtonProps) {
  const { pathname } = useLocation()
  const to = useHrefWithReturnTo(`${pathname}/edit${query || ''}`)

  return (
    <Link to={to}>
      <IconButton type="button" icon={<FiEdit2 size={20} />} text="Edit" title="Edit" {...rest} />
    </Link>
  )
}
