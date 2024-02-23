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

import {
  AriaTable,
  AriaTbody,
  AriaTd,
  AriaTh,
  AriaThead,
  AriaTr,
  Box,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Flex,
  Text,
} from '@traefiklabs/faency'
import axios from 'axios'
import React, { useCallback, useState } from 'react'
import { BiDotsVerticalRounded } from 'react-icons/bi'
import { FaPauseCircle, FaPlayCircle, FaPlus, FaTrash } from 'react-icons/fa'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import SomethingWentWrong from 'components/SomethingWentWrong'
import AriaTdSkeleton from 'components/tables/AriaTdSkeleton'
import { useToasts } from 'context/toasts'

import NewTokenModal from 'components/settings/NewTokenModal'
import COLORS from 'components/styles/colors'

type TokenRowProps = {
  token: Settings.Token
}

export const TokenRow = ({ token }: TokenRowProps) => {
  const queryClient = useQueryClient()
  const { addToast } = useToasts()

  const onDeleteClick = useCallback(async () => {
    try {
      await axios.delete(`/api/tokens`, {
        data: {
          name: token.name,
        },
      })
      queryClient.invalidateQueries({ queryKey: [`/api/tokens`] })
      addToast({
        severity: 'success',
        message: 'Token successfully deleted',
      })
    } catch (err) {
      addToast({
        severity: 'error',
        message: `Something went wrong while deleting the token, please try again later`,
        timeout: 60000,
      })
      console.error(err)
    }
  }, [token])

  const onSuspendClick = useCallback(async () => {
    try {
      await axios.post(`/api/tokens/suspend`, {
        name: token.name,
        suspend: !token.suspended,
      })
      queryClient.invalidateQueries({ queryKey: [`/api/tokens`] })
      addToast({
        severity: 'success',
        message: `Token successfully ${token.suspended ? 'resumed' : 'suspended'}`,
      })
    } catch (err) {
      addToast({
        severity: 'error',
        message: `Something went wrong while ${
          token.suspended ? 'resuming' : 'suspending'
        } the token, please try again later`,
        timeout: 60000,
      })
      console.error(err)
    }
  }, [token])

  return (
    <AriaTr css={{ height: '64px' }}>
      <AriaTd>
        <Text css={{ color: token.suspended ? '$blackA9' : '$blackA12', fontWeight: 600 }}>{token.name}</Text>
      </AriaTd>

      <AriaTd css={{ textAlign: 'right' }}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button ghost css={{ borderRadius: 0 }}>
              <BiDotsVerticalRounded color={COLORS.primary} size={24} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent align="end" css={{ borderRadius: 0 }}>
              <DropdownMenuGroup>
                <DropdownMenuItem css={{ cursor: 'pointer' }} onClick={onSuspendClick}>
                  <Flex align="center" gap={2}>
                    {token.suspended ? <FaPlayCircle size={16} /> : <FaPauseCircle size={16} />}
                    <Text>{token.suspended ? 'Resume' : 'Suspend'}</Text>
                  </Flex>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem css={{ color: '$textRed', cursor: 'pointer' }} onClick={onDeleteClick}>
                  <Flex align="center" gap={2}>
                    <FaTrash size={16} />
                    <Text>Delete token</Text>
                  </Flex>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
      </AriaTd>
    </AriaTr>
  )
}

export const TokensListHead = ({
  onCreateTokenClick,
}: {
  onCreateTokenClick?: React.MouseEventHandler<HTMLButtonElement>
}) => {
  return (
    <AriaThead>
      <AriaTr>
        <AriaTh>
          <Text size={4} css={{ color: '$blackA12', flexGrow: 1, fontWeight: '600' }}>
            Tokens
          </Text>
        </AriaTh>
        <AriaTh css={{ textAlign: 'right' }}>
          <Box css={{ pt: '$2', pb: '$2' }}>
            <Button onClick={onCreateTokenClick} css={{ borderRadius: 0, backgroundColor: COLORS.primary }}>
              <Flex align="center" justify="between" gap={1}>
                <FaPlus size={16} />
                <Text css={{ color: 'currentColor' }}>Create token</Text>
              </Flex>
            </Button>
          </Box>
        </AriaTh>
      </AriaTr>
    </AriaThead>
  )
}

export const TokensListBody = ({ tokens }: { tokens: Settings.Token[] }) => (
  <AriaTbody>
    {tokens?.map((token, idx) => (
      <TokenRow key={`token-${idx}`} token={token} />
    ))}
  </AriaTbody>
)

export const TokensListError = () => (
  <AriaTbody>
    <AriaTr css={{ position: 'relative' }}>
      <AriaTd fullColSpan>
        <SomethingWentWrong variant="ghost" />
      </AriaTd>
    </AriaTr>
  </AriaTbody>
)

export const TokensListEmptyState = () => (
  <AriaTbody>
    <AriaTr css={{ height: '81px' }}>
      <AriaTd>
        <Text css={{ color: '$blackA12' }}>No tokens</Text>
      </AriaTd>
    </AriaTr>
  </AriaTbody>
)

export const TokensListSkeleton = () => (
  <AriaTbody>
    {[...Array(3)].map((_, i) => (
      <AriaTr key={i} css={{ height: '81px' }}>
        <AriaTdSkeleton css={{ width: '50%' }} />
        <AriaTd />
      </AriaTr>
    ))}
  </AriaTbody>
)

export const TokensListWithData = () => {
  const fetchUrl = `/api/tokens`
  const {
    isLoading,
    error,
    data: tokens,
  } = useQuery<Settings.Token[]>({
    queryKey: [fetchUrl],

    queryFn: () =>
      axios
        .get(fetchUrl)
        .catch((err) => {
          throw err
        })
        .then(({ data }) => data),
  })

  const queryClient = useQueryClient()

  const [isNewTokenModalOpen, setIsNewTokenModalOpen] = useState(false)

  const onNewTokenModalComplete = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [`/api/tokens`] })
    setIsNewTokenModalOpen(false)
  }, [setIsNewTokenModalOpen])

  return (
    <>
      <AriaTable
        css={{ tableLayout: 'auto', borderRadius: 0, boxShadow: 'none', border: `1px solid ${COLORS.border}` }}
      >
        <TokensListHead onCreateTokenClick={() => setIsNewTokenModalOpen(true)} />
        {!!isLoading && <TokensListSkeleton />}
        {!!error && <TokensListError />}
        {!!tokens && (tokens.length ? <TokensListBody tokens={tokens} /> : <TokensListEmptyState />)}
      </AriaTable>
      {isNewTokenModalOpen && (
        <NewTokenModal
          isOpen={isNewTokenModalOpen}
          onComplete={onNewTokenModalComplete}
          onOpenChange={() => onNewTokenModalComplete()}
        />
      )}
    </>
  )
}

export default TokensListWithData
