/*
Copyright (C) 2022-2023 Traefik Labs
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

import React from 'react'
import { Flex, H2 } from '@traefiklabs/faency'
import { FaCog } from 'react-icons/fa'

import { TokensListWithData } from 'components/settings/TokensList'

const Settings = () => {
  return (
    <Flex direction="column">
      <Flex align="center" gap={1} css={{ mb: '$4' }}>
        <FaCog size={24} />
        <H2 css={{ color: '$blackA12' }}>Settings</H2>
      </Flex>
      <TokensListWithData />
    </Flex>
  )
}

export default Settings
