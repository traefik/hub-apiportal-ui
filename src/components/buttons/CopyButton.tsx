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

import { CSS } from '@traefiklabs/faency'
import React, { useState, useEffect, useCallback } from 'react'
import { FiCopy } from 'react-icons/fi'

import IconButton from 'components/buttons/IconButton'
import useToasts from 'hooks/use-toasts'

type CopyButtonProps = {
  text: string
  disabled: boolean
  css?: CSS
  onClick?: () => void
}

const CopyButton = ({ text, disabled, css, onClick }: CopyButtonProps) => {
  const { addToast } = useToasts()
  const initialCopyState = 'Copy'
  const [copyState, setCopyState] = useState(initialCopyState)

  const onIconButtonClick = useCallback(
    (e: React.MouseEvent) => {
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
            message: 'Unable to copy the API key, please try again.',
            timeout: 6000,
          })
        })
    },
    [addToast, onClick, text],
  )

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
    <IconButton
      icon={<FiCopy size={20} />}
      text={copyState}
      ghost
      css={{ color: '$hiContrast', ...css }}
      disabled={disabled}
      onClick={onIconButtonClick}
      title={copyState}
      type="button"
    />
  )
}

export default CopyButton
