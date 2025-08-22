import { Box, Tooltip, VisuallyHidden } from '@traefiklabs/faency'
import React from 'react'
import { MdManageAccounts } from 'react-icons/md'

export default function ManagedByPublisher({ resource, size = 20 }: { resource: string; size?: number }) {
  return (
    <Tooltip content={`This ${resource} is managed by the API publisher.`}>
      <Box css={{ color: '$textSubtle' }}>
        <VisuallyHidden>Managed by API publisher</VisuallyHidden>
        <MdManageAccounts size={size} />
      </Box>
    </Tooltip>
  )
}
