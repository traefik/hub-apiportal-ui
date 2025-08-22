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

import { AccessibleIcon, Button, Flex, VariantProps } from '@traefiklabs/faency'
import Avatar from 'boring-avatars'
import React, { ComponentProps, forwardRef } from 'react'
import { FiUser } from 'react-icons/fi'

type UserMenuTriggerProps = ComponentProps<typeof Button> &
  VariantProps<typeof Button> & {
    userId: string
  }

const UserMenuTrigger = forwardRef<HTMLButtonElement, UserMenuTriggerProps>(({ disabled, userId, ...props }, ref) => (
  <Button
    data-testid="user-dropdown-menu"
    ref={ref}
    ghost
    size="large"
    css={{
      width: 40,
      p: 0,
      color: '$hiContrast',
      opacity: disabled ? 0.5 : 1,
      '&:focus': { borderRadius: 20 },
      '&:hover': { color: '$hiContrast' },
    }}
    disabled={disabled}
    {...props}
  >
    <AccessibleIcon label="menu">
      <Flex align="center" justify="center" css={{ position: 'relative' }}>
        <Flex align="center" justify="center" css={{ position: 'absolute', height: 40, width: 40, opacity: 0.5 }}>
          <Avatar
            name={userId}
            colors={['#d4ea48', '#482bea', '#eaea48', '#48ea92', '#ea4848', '#ea48d4']}
            variant="marble"
          />
        </Flex>
        <Flex align="center" justify="center" css={{ position: 'absolute', height: 40, width: 40, color: 'inherit' }}>
          <FiUser size={20} />
        </Flex>
      </Flex>
    </AccessibleIcon>
  </Button>
))

UserMenuTrigger.displayName = 'UserMenuTrigger'

export default UserMenuTrigger
