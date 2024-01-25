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

import { Box, Button, Flex, H2, Label, Text, TextField, styled } from '@traefiklabs/faency'
import axios from 'axios'
import { Form, Formik, FormikHelpers } from 'formik'
import React, { useCallback, useState } from 'react'
import { FaInfoCircle } from 'react-icons/fa'

import CopyButton from 'components/settings/CopyButton'
import { tokenFormSchema } from 'components/settings/schema'

import InputField from 'components/TextFieldWithControls'
import LabelText from 'components/LabelText'
import { useToasts } from 'context/toasts'
import COLORS from 'components/styles/colors'

const CodeField = styled(TextField, {
  backgroundColor: '$gray3',
  fontFamily: 'monospace',

  length: undefined,
})

type NewTokenCopyProps = {
  onComplete: () => void
  token: string
}

const NewTokenCopy = ({ onComplete, token }: NewTokenCopyProps) => {
  return (
    <Flex direction="column" gap={4} css={{ p: '$2' }}>
      <H2 css={{ fontSize: '$4' }}>Token key successfully created</H2>

      <Flex gap={2}>
        <Box>
          <FaInfoCircle size={16} />
        </Box>
        <Text variant="subtle">
          Copy the Token key or click download to save it. You won’t be able to see this Token key again, so you can’t
          retrieve it later.
        </Text>
      </Flex>

      <Flex direction="column" gap={3}>
        <Box>
          <Label htmlFor="token">
            <LabelText size="1" variant="subtle">
              Token key
            </LabelText>
          </Label>
          <CodeField name="token" size="large" value={token} readOnly />
        </Box>
        <Box css={{ width: '100%', textAlign: 'right', mb: '$3' }}>
          <CopyButton disabled={false} text={token} />
        </Box>
        <Box css={{ width: '100%', textAlign: 'right' }}>
          <Button onClick={onComplete} type="button" css={{ borderRadius: 0, backgroundColor: COLORS.primary }}>
            Ok, got it
          </Button>
        </Box>
      </Flex>
    </Flex>
  )
}

type NewTokenCreationProps = {
  onCancel: () => void
  onSubmit: (values: Settings.NewTokenForm, actions: FormikHelpers<Settings.NewTokenForm>) => Promise<void>
}

const NewTokenCreation = ({ onCancel, onSubmit }: NewTokenCreationProps) => {
  const initialValues: Settings.NewTokenForm = {
    name: '',
  }

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={tokenFormSchema}>
      {({ dirty, isSubmitting }) => (
        <Form>
          <Flex direction="column" gap={4} css={{ p: '$2' }}>
            <H2 css={{ fontSize: '$4' }}>Create new Token</H2>
            <Box>
              <Label htmlFor="name">
                <LabelText size="1" variant="subtle">
                  Token name
                </LabelText>
              </Label>
              <InputField name="name" placeholder="e.g. token-name-01" />
            </Box>

            <Flex gap={2} css={{ alignSelf: 'flex-end', mt: '$4' }}>
              <Button ghost onClick={onCancel} type="button" css={{ borderRadius: 0 }}>
                Cancel
              </Button>
              <Button
                disabled={!dirty}
                state={isSubmitting ? 'waiting' : undefined}
                css={{ borderRadius: 0 }}
                type="submit"
              >
                Create
              </Button>
            </Flex>
          </Flex>
        </Form>
      )}
    </Formik>
  )
}

type NewTokenFormProps = {
  onCancel: () => void
  onComplete: () => void
}

const NewTokenForm = ({ onCancel, onComplete }: NewTokenFormProps) => {
  const [newToken, setNewToken] = useState<string | undefined>()
  const { addToast } = useToasts()

  const onNewTokenCopyComplete = useCallback(() => {
    onComplete()
  }, [onComplete])

  const onNewTokenCreationSubmit = useCallback(
    async (values: Settings.NewTokenForm, actions: FormikHelpers<Settings.NewTokenForm>) => {
      try {
        const res = await axios.post(`/api/tokens`, {
          name: values.name,
        })

        setNewToken(res.data.token)

        addToast({
          severity: 'success',
          message: 'Token successfully created',
        })
      } catch (e) {
        onCancel()
        addToast({
          severity: 'error',
          message: 'Something went wrong while creating a new token, please try again later',
          timeout: 60000,
        })
        console.error(e)
      } finally {
        actions.setSubmitting(false)
      }
    },
    [setNewToken],
  )

  return newToken ? (
    <NewTokenCopy onComplete={onNewTokenCopyComplete} token={newToken} />
  ) : (
    <NewTokenCreation onCancel={onCancel} onSubmit={onNewTokenCreationSubmit} />
  )
}

export default NewTokenForm
