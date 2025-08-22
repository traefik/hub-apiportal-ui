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
  Text,
  Box,
  DropdownMenu,
  DropdownMenuTrigger,
  Button,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  Tooltip,
} from '@traefiklabs/faency'
import React from 'react'
import { FiMoreVertical } from 'react-icons/fi'

import { eventPreventStop } from 'utils/events'

const SuspendedSubscriptionText = () => {
  return (
    <Tooltip content="You are not allowed to unsubscribe from a suspended subscription.">
      <Text css={{ color: '$textSubtle', cursor: 'not-allowed' }}>Unsubscribe</Text>
    </Tooltip>
  )
}

const SubscriptionActions = ({
  suspended,
  setIsUnsubscribeModalOpen,
}: {
  suspended: boolean
  setIsUnsubscribeModalOpen: (isOpen: boolean) => void
}) => {
  return (
    <Box onClick={eventPreventStop}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" ghost variant="secondary" css={{ p: 0, borderRadius: 0, boxShadow: 'none' }}>
            <FiMoreVertical size={20} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent align="end" css={{ borderRadius: 0 }}>
            <DropdownMenuGroup>
              <DropdownMenuItem
                css={!suspended ? { cursor: 'pointer', '&:hover': { bc: '$red9' } } : {}}
                onSelect={() => setIsUnsubscribeModalOpen(true)}
                disabled={suspended}
              >
                {suspended ? <SuspendedSubscriptionText /> : <Text>Unsubscribe</Text>}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    </Box>
  )
}

export default SubscriptionActions
