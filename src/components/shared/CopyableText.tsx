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

import { Button, CSS, Flex, Text } from '@traefiklabs/faency'
import React, { useState } from 'react'
import { FiCheck, FiCopy } from 'react-icons/fi'

import { eventPreventStop } from 'utils/events'

export default function CopyableText({ css = {}, text }: { css?: CSS; text: string }) {
  const [showConfirmation, setShowConfirmation] = useState(false)

  return (
    <Flex align="center" gap={2} css={css}>
      <Text>{text}</Text>
      <Button
        type="button"
        ghost
        variant="secondary"
        css={{ height: '20px', borderRadius: 0, boxShadow: 'none', px: '$1' }}
        onClick={async (event) => {
          eventPreventStop(event)
          await navigator.clipboard.writeText(text)
          setShowConfirmation(true)
          setTimeout(() => setShowConfirmation(false), 1500)
        }}
      >
        {showConfirmation ? <FiCheck size={16} /> : <FiCopy size={16} />}
      </Button>
    </Flex>
  )
}
