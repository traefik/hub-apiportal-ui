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
  CSS,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  Flex,
  H2,
  VisuallyHidden,
} from '@traefiklabs/faency'
import React, { ReactNode } from 'react'

type AccessibleDialogProps = {
  children: ReactNode
  css?: CSS
  description: string
  isDangerous?: boolean
  isOpen: boolean
  onClose: () => void
  title: string
}

export default function AccessibleDialog({
  children,
  css,
  description,
  isDangerous = false,
  isOpen,
  onClose,
  title,
}: AccessibleDialogProps) {
  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent css={{ bc: '$02dp', minWidth: 544, maxWidth: 960, p: '$5', zIndex: 1, ...css }}>
          <DialogTitle asChild>
            <Flex direction="column" gap={2} css={{ marginBottom: '$3' }}>
              <Flex align="baseline" gap={3}>
                <H2 css={isDangerous ? { color: '$red10' } : undefined}>{title}</H2>
              </Flex>
              <hr style={{ width: '100%', borderColor: 'var(--colors-textSubtle)' }} />
            </Flex>
          </DialogTitle>
          <VisuallyHidden asChild>
            <DialogDescription>{description}</DialogDescription>
          </VisuallyHidden>
          {children}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}
