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

import { Dialog, DialogContent, DialogOverlay, DialogPortal } from '@traefiklabs/faency'
import React from 'react'

import NewTokenForm from './NewTokenForm'

type NewTokenModalProps = {
  isOpen: boolean
  onComplete: () => void
  onOpenChange: (isOpen: boolean) => void
}

export const NewTokenModal = ({ isOpen, onComplete, onOpenChange }: NewTokenModalProps) => {
  return (
    <Dialog onOpenChange={onOpenChange} open={isOpen}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent css={{ width: 480, bc: '$02dp' }}>
          <NewTokenForm onCancel={() => onOpenChange(false)} onComplete={onComplete} />
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}

export default NewTokenModal
