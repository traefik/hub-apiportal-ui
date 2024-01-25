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

import { Flex, Button, CSS } from '@traefiklabs/faency'
import { useToasts } from 'context/toasts'
import React, { useState, useEffect } from 'react'
import { FaCopy } from 'react-icons/fa'

type CopyButtonProps = {
  text: string
  disabled: boolean
  css?: CSS
  onClick?: () => void
}

const CopyButton = ({ text, disabled, css, onClick }: CopyButtonProps) => {
  const { addToast } = useToasts()
  const initialCopyState = 'Copy key'
  const [copyState, setCopyState] = useState(initialCopyState)

  useEffect(() => {
    let timer
    if (copyState !== initialCopyState) {
      timer = setTimeout(() => setCopyState(initialCopyState), 2500)
    }

    return () => {
      clearTimeout(timer)
    }
  }, [copyState])

  return (
    <Button
      ghost
      size="medium"
      css={{
        color: '$hiContrast',
        height: 32,
        ...css,
      }}
      title={copyState}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation()
        if (onClick) {
          onClick()
        }
        navigator.clipboard
          .writeText(text)
          .then(() => {
            setCopyState('Copied!')
          })
          .catch(() => {
            addToast({
              severity: 'error',
              message: 'Fail to copy token, please try again.',
              timeout: 6000,
            })
          })
      }}
      disabled={disabled}
    >
      <Flex align="center" gap={2}>
        <FaCopy color="$hiContrast" size={16} />
        {copyState}
      </Flex>
    </Button>
  )
}

export default CopyButton
