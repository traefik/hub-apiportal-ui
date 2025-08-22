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

import React, { useState } from 'react'

import ApplicationDeletionModal from 'components/applications/ApplicationDeletionModal'
import DeleteButton from 'components/buttons/DeleteButton'

type ApplicationDeletionButtonProps = {
  application: API.Application
  disabled?: boolean
}

export default function ApplicationDeletionButton({ application, disabled = false }: ApplicationDeletionButtonProps) {
  const { appId, name } = application
  const [isDeletionModalOpen, setIsDeletionModalOpen] = useState<boolean>(false)

  return (
    <>
      <DeleteButton buttonText="Delete application" disabled={disabled} onClick={() => setIsDeletionModalOpen(true)} />

      {isDeletionModalOpen && (
        <ApplicationDeletionModal
          appId={appId}
          applicationName={name}
          isOpen={isDeletionModalOpen}
          onClose={() => setIsDeletionModalOpen(false)}
        />
      )}
    </>
  )
}
