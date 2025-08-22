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

import { Box, Button, Flex, Label, Text, TextField, styled } from '@traefiklabs/faency'
import axios, { AxiosError } from 'axios'
import { useField } from 'formik'
import React, { useCallback, useEffect, useState } from 'react'
import { FiInfo } from 'react-icons/fi'
import * as Yup from 'yup'

import CopyButton from 'components/buttons/CopyButton'
import FormLayout from 'components/forms/FormLayout'
import LabelText from 'components/forms/LabelText'
import TextFieldWithControls from 'components/forms/TextFieldWithControls'
import AlertWithIcon from 'components/shared/AlertWithIcon'
import { APPLICATIONS_URL } from 'hooks/query/use-applications'
import useInvalidateQueries from 'hooks/query/use-invalidate-queries'
import useToasts from 'hooks/use-toasts'

const CodeField = styled(TextField, {
  length: undefined,
  width: '100%',
  backgroundColor: '$gray3',
  fontFamily: 'monospace',
})

const APIKeyCreationCopy = ({ apiKeyValue, onComplete }: { apiKeyValue: string; onComplete: () => void }) => {
  return (
    <Flex direction="column" gap={3}>
      <AlertWithIcon align="center" icon={<FiInfo />} variant="info" data-testid="deprecation-alert">
        <Text>Copy the API key now, as it won&apos;t be visible again and cannot be retrieved later.</Text>
      </AlertWithIcon>

      <Box>
        <Label htmlFor="apiKeyValue">
          <LabelText size="1" variant="subtle">
            API key
          </LabelText>
        </Label>
        <Flex
          css={{
            div: {
              width: '100%',
              ':before': { borderRadius: 0 },
              ':after': { borderRadius: 0 },
              input: { borderRadius: 0 },
            },
          }}
        >
          <CodeField name="apiKeyValue" size="large" value={apiKeyValue} readOnly />
          <CopyButton disabled={false} text={apiKeyValue} />
        </Flex>
      </Box>

      <Box css={{ width: '100%', textAlign: 'right' }}>
        <Button
          type="button"
          onClick={onComplete}
          css={{ borderRadius: 0, backgroundColor: 'var(--colors-textPrimary)' }}
        >
          Ok, got it
        </Button>
      </Box>
    </Flex>
  )
}

const APIKeyCreationFormikForm = ({ hasError }: { hasError: boolean }) => {
  const [, , { setError }] = useField<string>('title')

  useEffect(() => {
    if (hasError) setError('The API key title must be unique.')
  }, [hasError, setError])

  return (
    <Box css={{ mb: '$3' }}>
      <Label htmlFor="title">
        <LabelText size="1" variant="subtle">
          <Flex gap={1}>
            <Text>Title</Text>
            <Text css={{ color: '$inputInvalidBorder' }}>*</Text>
          </Flex>
        </LabelText>
      </Label>
      <TextFieldWithControls name="title" placeholder="e.g. my-api-key" />
    </Box>
  )
}

type APIKeyCreationFlowProps = {
  appId: string
  onCancel: () => void
  onComplete: () => void
}

const APIKeyCreationFlow = ({ appId, onCancel, onComplete }: APIKeyCreationFlowProps) => {
  const invalidateQueries = useInvalidateQueries()
  const [apiKeyValue, setAPIKeyValue] = useState<string | undefined>()
  const { addToast } = useToasts()

  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const initialValues: Forms.APIKey = {
    title: '',
  }

  const validationSchema = Yup.object().shape({
    title: Yup.string().trim().required('Title is required.'),
  })

  const onSubmit = useCallback(
    async (values: Forms.APIKey) => {
      setHasError(false)
      setIsLoading(true)
      try {
        const reqBody: API.APIKeyCreateReq = { title: values.title }
        const res = await axios.post<API.APIKeyCreateRes>(`./api/applications/${appId}/api-keys`, reqBody)
        setAPIKeyValue(res.data.token)
        invalidateQueries({ queryKey: [APPLICATIONS_URL] })
        addToast({
          severity: 'success',
          message: 'API key successfully created',
        })
      } catch (err) {
        console.error(err)
        if ((err as AxiosError)?.code === 'ERR_BAD_REQUEST') {
          setHasError(true)
        } else {
          onCancel()
          addToast({
            severity: 'error',
            message: 'Something went wrong while creating the new API key, please try again later',
            timeout: 60000,
          })
        }
      } finally {
        setIsLoading(false)
      }
    },
    [addToast, appId, invalidateQueries, onCancel],
  )

  return apiKeyValue ? (
    <APIKeyCreationCopy apiKeyValue={apiKeyValue} onComplete={onComplete} />
  ) : (
    <FormLayout
      initialValues={initialValues}
      isEditPage={false}
      isLoading={isLoading}
      onSubmit={onSubmit}
      schema={validationSchema}
      onCancelFn={onCancel}
    >
      <APIKeyCreationFormikForm hasError={hasError} />
    </FormLayout>
  )
}

export default APIKeyCreationFlow
