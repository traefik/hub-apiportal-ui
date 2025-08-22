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
import { Card as FaencyCard, Flex, Skeleton, Text } from '@traefiklabs/faency'
import React, { ComponentProps, useState } from 'react'

import PlanDescriptionModal from 'components/api/PlanDescriptionModal'
import UsageLimit, { UsageLimitSkeleton } from 'components/api/UsageLimit'
import LinkAsButton from 'components/buttons/LinkAsButton'
import { eventPreventStop } from 'utils/events'

// @FIXME type incompatibility
const Card = FaencyCard as any

const PlanCard = ({ plan, css, ...rest }: ComponentProps<typeof Card> & { plan: API.Plan }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  return (
    <Card
      css={{
        width: '100%',
        border: 'var(--borders-layoutSection)',
        borderRadius: 0,
        boxShadow: 'none',
        '&:before': { borderRadius: 0 },
        ...css,
      }}
      interactive
      type="button"
      {...rest}
    >
      {plan.description ? (
        <PlanDescriptionModal plan={plan} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      ) : null}

      <Flex gap={4} css={{ width: '100%' }} justify="space-between">
        <Flex direction="column" gap={2} css={{ width: '40%' }}>
          <Text size={5} css={{ overflowWrap: 'break-word', fontWeight: '$semiBold' }}>
            {plan.title || plan.name}
          </Text>{' '}
          {!!plan.description && (
            <LinkAsButton
              onClick={(e) => {
                eventPreventStop(e)
                setIsModalOpen(true)
              }}
              css={{ textAlign: 'left', width: 'fit-content' }}
            >
              See plan description
            </LinkAsButton>
          )}
        </Flex>

        <Flex gap={4} css={{ flex: 1 }}>
          <UsageLimit
            limit={plan.rateLimit}
            css={{ width: '50%', height: '100%', justifyContent: 'space-between' }}
            direction="column"
          />
          <UsageLimit
            limit={plan.quota}
            css={{ height: '100%', justifyContent: 'space-between' }}
            direction="column"
            isQuota
          />
        </Flex>
      </Flex>
    </Card>
  )
}

export const PlanCardSkeleton = () => {
  return (
    <Card css={{ width: 200, border: 'var(--borders-layoutSection)', borderRadius: 0, boxShadow: 'none' }}>
      <Flex direction="column" gap={4}>
        <Skeleton css={{ width: '75%' }} />
        <UsageLimitSkeleton direction="column" />
        <UsageLimitSkeleton direction="column" />
      </Flex>
    </Card>
  )
}

export default PlanCard
