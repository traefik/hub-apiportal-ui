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

import AccessibleDialog from 'components/shared/AccessibleDialog'
import DangerZone from 'components/shared/DangerZone'
import useDeleteResource from 'hooks/fetcher/use-delete-resource'
import { APPLICATIONS_URL } from 'hooks/query/use-applications'

type ApplicationDeletionModalProps = {
  appId: string
  applicationName: string
  isOpen: boolean
  noRedirect?: boolean
  onClose: () => void
}

export default function ApplicationDeletionModal({
  appId,
  applicationName,
  isOpen,
  noRedirect,
  onClose,
}: ApplicationDeletionModalProps) {
  const [handleDelete, isDeleting] = useDeleteResource({
    defaultReturnTo: !noRedirect ? '/applications' : undefined,
    mutateUrls: [APPLICATIONS_URL],
    onComplete: onClose,
    resourceName: 'application',
    url: `./api/applications/${appId}`,
  })

  return (
    <AccessibleDialog
      title="Confirmation required"
      description={`This dialog ask for confirmation before deleting the application ${applicationName}`}
      isDangerous
      isOpen={isOpen}
      onClose={onClose}
      css={{ borderRadius: 0, maxWidth: 1000 }}
    >
      <DangerZone
        asCard={false}
        cancelButtonText="Cancel"
        confirmButtonText="Delete application"
        confirmationText={`delete ${applicationName}`}
        description={`Are you sure you want to delete the application "${applicationName}"?`}
        isLoading={isDeleting}
        onCancel={onClose}
        onSubmit={handleDelete}
        submitButtonType="button"
      />
    </AccessibleDialog>
  )
}
