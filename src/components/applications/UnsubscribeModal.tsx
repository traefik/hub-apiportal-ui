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
import { PORTAL_URL } from 'hooks/query/use-portal'

type UnsubscribeConfirmationModalProps = {
  isOpen: boolean
  onClose: () => void
  subscription: API.APISubscription | API.ApplicationSubscription
  applicationName?: string
}

export default function UnsubscribeConfirmationModal({
  subscription,
  isOpen,
  onClose,
  applicationName,
}: UnsubscribeConfirmationModalProps) {
  const [handleUnsubscribe, isLoading] = useDeleteResource({
    mutateUrls: [PORTAL_URL],
    onComplete: onClose,
    resourceName: 'subscription',
    url: `./api/self-service-subscriptions/${subscription.id}`,
  })

  return (
    <AccessibleDialog
      title="Confirmation required"
      description={`This dialog ask for confirmation before unsubscribing from the API`}
      isDangerous
      isOpen={isOpen}
      onClose={onClose}
      css={{ borderRadius: 0, maxWidth: 1000 }}
    >
      <DangerZone
        asCard={false}
        cancelButtonText="Cancel"
        confirmButtonText="Unsubscribe"
        confirmationText={`unsubscribe ${applicationName || (subscription as API.APISubscription).application.name}`}
        description={`Are you sure you want to unsubscribe ${
          applicationName || (subscription as API.APISubscription).application.name
        } from this API?`}
        isLoading={isLoading}
        onCancel={onClose}
        onSubmit={handleUnsubscribe}
        submitButtonType="button"
      />
    </AccessibleDialog>
  )
}
