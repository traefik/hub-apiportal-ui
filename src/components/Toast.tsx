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

import { Box, Button, Flex, Text, styled } from '@traefiklabs/faency'
import { AnimatePresence, motion } from 'framer-motion'
import React, { ReactNode, useEffect } from 'react'
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimesCircle } from 'react-icons/fa'

const CloseButton = styled(Button, {
  position: 'absolute',
  top: 0,
  right: 0,
  padding: 0,

  length: undefined,
})

const ToastContainer = styled(Flex, {
  mb: '$3',
  width: ' 100%',
  position: 'relative',
  padding: '$3',
  br: '$3',

  length: undefined,
})

const AnimatedToastContainer = motion(ToastContainer)

const toastVariants = {
  create: {
    opacity: 0,
    y: 100,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
  hidden: {
    opacity: 0,
    x: '100%',
    scale: 0,
  },
}

export type ToastState = {
  severity: 'error' | 'warning' | 'info' | 'success'
  message?: ReactNode
  isVisible?: boolean
  timeout?: number
  key?: number
}

type ToastProps = ToastState & {
  dismiss: () => void
  icon?: string
}

const Toast = ({
  message,
  dismiss,
  severity = 'error',
  icon = undefined,
  isVisible = true,
  timeout = 2000,
}: ToastProps) => {
  useEffect(() => {
    if (timeout) {
      setTimeout(() => dismiss(), timeout)
    }
  }, [timeout, dismiss])

  const propsBySeverity = {
    error: {
      color: '$red10',
      icon: <FaExclamationCircle size={16} color="#fff" />,
    },
    warning: {
      color: '$orange10',
      icon: <FaExclamationCircle size={16} color="#fff" />,
    },
    info: {
      color: '$blue10',
      icon: <FaInfoCircle size={16} color="#fff" />,
    },
    success: {
      color: '$green10',
      icon: <FaCheckCircle size={16} color="#fff" />,
    },
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <AnimatedToastContainer
          css={{ bc: propsBySeverity[severity].color }}
          initial="create"
          animate="visible"
          exit="hidden"
          variants={toastVariants}
        >
          <Flex align="center" css={{ mr: '$2' }}>
            {icon || propsBySeverity[severity].icon}
          </Flex>
          <Text
            as="p"
            css={{ color: 'white', fontWeight: 500, alignSelf: 'center', whiteSpace: 'break-spaces', lineHeight: 1.3 }}
          >
            {message}
          </Text>
          <CloseButton
            ghost
            onClick={dismiss}
            css={{
              p: '$1',
              color: 'white',
              '&:hover': {
                color: 'white',
                opacity: 0.8,
              },
            }}
          >
            <Box css={{ mr: '$1' }}>
              <FaTimesCircle size={16} />
            </Box>
          </CloseButton>
        </AnimatedToastContainer>
      )}
    </AnimatePresence>
  )
}

export default Toast
