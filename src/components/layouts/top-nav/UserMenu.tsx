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

import {
  Box,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  styled,
} from '@traefiklabs/faency'
import React, { useId } from 'react'
import { FiLogOut } from 'react-icons/fi'

import UserMenuTrigger from 'components/layouts/top-nav/UserMenuTrigger'

const RightSlot = styled('div', {
  marginLeft: 'auto',
  paddingLeft: 20,
  ':focus > &': { color: 'white' },
  '[data-disabled] &': { color: '$deepBlue3' },
} as any)

export default function UserMenu() {
  const dropdownId = useId()

  return (
    <DropdownMenu modal>
      <DropdownMenuTrigger asChild>
        <UserMenuTrigger id={dropdownId} userId="test.user@domain.com" />
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent align="end" css={{ minWidth: 200, bc: '$01dp', borderRadius: 0 }}>
          <DropdownMenuGroup>
            <DropdownMenuItem
              css={{ cursor: 'pointer', fontSize: '$3', lineHeight: '$6', height: '$6', '&:hover': { bc: '$red9' } }}
              onSelect={() => {
                localStorage.removeItem('TryIt_securitySchemeValues')
                location.replace('./logout')
              }}
            >
              Sign out
              <RightSlot>
                <Box css={{ color: 'inherit' }}>
                  <FiLogOut size={16} />
                </Box>
              </RightSlot>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  )
}
