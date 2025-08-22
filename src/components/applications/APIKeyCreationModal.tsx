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

import React from 'react'

import APIKeyCreationFlow from 'components/applications/APIKeyCreationFlow'
import AccessibleDialog from 'components/shared/AccessibleDialog'

type APIKeyCreationModalProps = {
  appId: string
  isOpen: boolean
  onClose: () => void
}

export default function APIKeyCreationModal({ appId, isOpen, onClose }: APIKeyCreationModalProps) {
  return (
    <AccessibleDialog
      title="Create API key"
      description="This dialog shows a form containing the details for the new API key."
      isOpen={isOpen}
      onClose={onClose}
      css={{ borderRadius: 0, maxWidth: 1000 }}
    >
      <APIKeyCreationFlow appId={appId} onCancel={onClose} onComplete={onClose} />
    </AccessibleDialog>
  )
}
