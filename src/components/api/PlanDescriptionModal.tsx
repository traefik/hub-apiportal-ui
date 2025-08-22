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
  Button,
  Dialog,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  Flex,
  H2,
  VisuallyHidden,
} from '@traefiklabs/faency'
import React from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import UsageLimit from './UsageLimit'

import StyledDialogContent from 'components/StyledDialogContent'
import components from 'utils/components'
import { eventPreventStop } from 'utils/events'

type PlanDescriptionlModalProps = {
  plan: API.Plan
  isOpen: boolean
  onClose: () => void
}

const PlanDescriptionModal = ({ plan, isOpen, onClose }: PlanDescriptionlModalProps) => {
  return (
    <Dialog onOpenChange={onClose} open={isOpen}>
      <DialogPortal>
        <DialogOverlay />
        <StyledDialogContent onClick={(e) => eventPreventStop(e)}>
          <DialogTitle>
            <Flex direction="column" gap={2} css={{ marginBottom: '$5' }}>
              <Flex align="baseline" gap={4}>
                <H2>{plan.title || plan.name}</H2>
                <UsageLimit limit={plan.rateLimit} />
                <UsageLimit limit={plan.quota} isQuota />
              </Flex>
              <hr />
            </Flex>
          </DialogTitle>
          <VisuallyHidden asChild>
            <DialogDescription>This dialog contains the description of the plan.</DialogDescription>
          </VisuallyHidden>
          <Flex direction="column" gap={5} css={{ flexGrow: 1 }}>
            <Flex direction="column" gap={3}>
              <Markdown components={components} remarkPlugins={[remarkGfm]}>
                {plan.description}
              </Markdown>
            </Flex>
            <Flex css={{ justifyContent: 'flex-end' }}>
              <Button
                type="button"
                css={{ borderRadius: 0, backgroundColor: 'var(--colors-textPrimary)' }}
                onClick={onClose}
              >
                Close
              </Button>
            </Flex>
          </Flex>
        </StyledDialogContent>
      </DialogPortal>
    </Dialog>
  )
}
export default PlanDescriptionModal
