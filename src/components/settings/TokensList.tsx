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
import { useQuery, useQueryClient } from 'react-query'

import SomethingWentWrong from 'components/SomethingWentWrong'
import AriaTdSkeleton from 'components/tables/AriaTdSkeleton'
import { useToasts } from 'context/toasts'

import NewTokenModal from './NewTokenModal'

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
            <Button ghost>
              <BiDotsVerticalRounded size={24} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent align="end">
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
            <Button onClick={onCreateTokenClick}>
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

type TokensListProps = {
  tokens: Settings.Token[]
}

export const TokensList = ({ tokens }: TokensListProps) => {
  const queryClient = useQueryClient()

  const [isNewTokenModalOpen, setIsNewTokenModalOpen] = useState(false)

  const onNewTokenModalComplete = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [`/api/tokens`] })
    setIsNewTokenModalOpen(false)
  }, [setIsNewTokenModalOpen])

  return (
    <>
      <AriaTable css={{ tableLayout: 'auto' }}>
        <TokensListHead onCreateTokenClick={() => setIsNewTokenModalOpen(true)} />
        <AriaTbody>
          {tokens.map((token, idx) => (
            <TokenRow key={`token-${idx}`} token={token} />
          ))}
        </AriaTbody>
      </AriaTable>
      {isNewTokenModalOpen && (
        <NewTokenModal
          isOpen={isNewTokenModalOpen}
          onComplete={onNewTokenModalComplete}
          onOpenChange={setIsNewTokenModalOpen}
        />
      )}
    </>
  )
}

export const TokensListSkeleton = () => {
  return (
    <AriaTable css={{ tableLayout: 'auto' }}>
      <TokensListHead />
      <AriaTbody>
        {[...Array(3)].map((_, i) => (
          <AriaTr key={i}>
            <AriaTdSkeleton css={{ width: '50%' }} />
            <AriaTd />
          </AriaTr>
        ))}
      </AriaTbody>
    </AriaTable>
  )
}

export const TokensListWithData = () => {
  const fetchUrl = `/api/tokens`
  const { isLoading, error, data: tokens } = useQuery(fetchUrl, () => axios.get(fetchUrl).then(({ data }) => data))

  if (isLoading) {
    return <TokensListSkeleton />
  }

  if (error) {
    return <SomethingWentWrong />
  }

  return <TokensList tokens={tokens} />
}

export default TokensListWithData
