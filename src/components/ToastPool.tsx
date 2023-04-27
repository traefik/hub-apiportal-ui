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

import { Flex } from '@traefiklabs/faency'
import React, { useContext } from 'react'

import { ToastContext } from 'context/toasts'
import { PositionXProps, PositionYProps, getPositionValues } from 'utils/position'

import Toast from './Toast'

type ToastPoolProps = {
  positionX?: PositionXProps
  positionY?: PositionYProps
  toastTimeout?: number
}

const ToastPool = ({ positionX = 'center', positionY = 'bottom', toastTimeout = 5000 }: ToastPoolProps) => {
  const { toasts, hideToast } = useContext(ToastContext)

  return (
    <>
      {!!toasts?.length}
      <Flex
        css={{
          ...getPositionValues(positionX, positionY),
          position: 'fixed',
          flexDirection: 'column',
          maxWidth: '420px',
          zIndex: 20,
          margin: positionX === 'center' ? 'auto' : 0,
          px: '$2',
        }}
        data-testid="toast-pool"
      >
        {toasts?.map((toast) => (
          <Toast
            key={toast.key}
            {...toast}
            dismiss={(): void => hideToast(toast)}
            timeout={toast.timeout || toastTimeout}
          />
        ))}
      </Flex>
    </>
  )
}

export default ToastPool
