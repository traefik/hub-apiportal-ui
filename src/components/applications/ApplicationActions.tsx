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
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  Flex,
  Text,
} from '@traefiklabs/faency'
import React from 'react'
import { FiMoreVertical, FiTrash2 } from 'react-icons/fi'

import { eventPreventStop } from 'utils/events'

export default function ApplicationActions({
  setIsDeletionModalOpen,
}: {
  setIsDeletionModalOpen: (isOpen: boolean) => void
}) {
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
                css={{ color: '$textRed', cursor: 'pointer' }}
                onClick={() => setIsDeletionModalOpen(true)}
              >
                <Flex align="center" gap={2}>
                  <FiTrash2 size={16} />
                  <Text>Delete</Text>
                </Flex>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    </Box>
  )
}
