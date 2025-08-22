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

import { useQueryClient } from '@tanstack/react-query'
import { Flex } from '@traefiklabs/faency'
import { useField } from 'formik'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { FiRefreshCw } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import * as Yup from 'yup'

import IconButton from 'components/buttons/IconButton'
import FormLayout from 'components/forms/FormLayout'
import FormSection from 'components/forms/FormSection'
import SectionCard from 'components/forms/SectionCard'
import TextFieldWithControls from 'components/forms/TextFieldWithControls'
import useLazyFetch from 'hooks/fetcher/use-lazy-fetch'
import { APPLICATIONS_URL, useGetApplicationByAppId } from 'hooks/query/use-applications'
import useToasts from 'hooks/use-toasts'
import { DNSSubdomainCompliantTextSchema } from 'utils/validation'

const schema = Yup.object().shape({
  name: DNSSubdomainCompliantTextSchema.required('Name is required.'),
  appId: Yup.string().trim().required('Application ID is required.'),
  notes: Yup.string(),
})

type ApplicationFormikFormProps = {
  hasAppIdError: boolean
  isEditPage: boolean
  isManaged: boolean
}

const ApplicationFormikForm = ({ hasAppIdError = false, isEditPage, isManaged }: ApplicationFormikFormProps) => {
  const [, , { setError, setValue: setAppIdValue }] = useField<string>('appId')

  useEffect(() => {
    if (hasAppIdError) setError('The application name and ID must be unique. One of them is already in use.')
  }, [hasAppIdError, setError])

  return (
    <Flex direction="column">
      <FormSection
        title="Name"
        description="Name for the application. We recommended using kebab-case (for example, my-application)."
        required
      >
        <SectionCard>
          <TextFieldWithControls name="name" placeholder="e.g. my-application" disabled={isEditPage || isManaged} />
        </SectionCard>
      </FormSection>
      <FormSection
        title="Application ID"
        description="The ID of the application in an external Identity Provider (IdP). If only API keys are used, or there is no IdP involved generating JWTs for gateway access (for example, using a shared signing secret), you can generate the ID here. Just make sure to make it appear in the JWT in the claims."
        required
      >
        <SectionCard>
          <Flex>
            <TextFieldWithControls
              name="appId"
              placeholder="e.g. d35ac098-3c22-41b9-82fd-720e7471a4b7"
              disabled={isEditPage || isManaged}
              css={{ flex: 1 }}
            />
            {!isEditPage ? (
              <IconButton
                type="button"
                icon={<FiRefreshCw size={20} />}
                text="Generate"
                title="Generate"
                onClick={() => setAppIdValue(`hub-${uuidv4()}`)}
                variant="secondary"
                css={{
                  height: '38px',
                  border: '1px solid var(--colors-buttonSecondaryBorder)',
                  borderLeft: 0,
                  boxShadow: 'none',
                }}
              />
            ) : null}
          </Flex>
        </SectionCard>
      </FormSection>
      <FormSection
        title="Notes"
        description="Any relevant notes about the application. This may include additional details, observations, or any specific points you'd like to highlight for future reference."
      >
        <SectionCard>
          <TextFieldWithControls
            name="notes"
            disabled={isManaged}
            placeholder="e.g. This application is used by... for..."
          />
        </SectionCard>
      </FormSection>
    </Flex>
  )
}

type ApplicationFormProps = {
  appId?: string
  initialValues: Forms.Application
  isEditPage: boolean
  isManaged: boolean
}

function ApplicationForm({ appId, initialValues, isEditPage, isManaged }: ApplicationFormProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { addToast } = useToasts()

  const [createApplication, { loading: isCreating }] = useLazyFetch<API.Application>('./api/applications', {
    method: 'POST',
  })

  const [updateApplication, { loading: isUpdating }] = useLazyFetch<API.Application>(`./api/applications/${appId}`, {
    method: 'PUT',
  })

  const [hasAppIdError, setHasAppIdError] = useState(false)

  const handleSubmit = useCallback(
    async (values: Forms.Application) => {
      setHasAppIdError(false)
      const method = isEditPage ? updateApplication : createApplication

      try {
        const payload = {
          name: values.name,
          appId: values.appId,
          notes: values.notes,
        }

        const applicationRes = await method({
          body: JSON.stringify(payload),
        })

        if (applicationRes?.data) {
          queryClient.setQueryData([APPLICATIONS_URL], (oldData: API.Application[]) => {
            return [...oldData.filter((app) => app.appId !== applicationRes.data?.appId), applicationRes.data]
          })
        }

        addToast({
          severity: 'success',
          message: `Application has been successfully ${isEditPage ? 'updated' : 'created'}`,
        })
        navigate(`/applications/${applicationRes?.data?.appId}?returnTo=/applications`)
      } catch (err) {
        console.error(err)
        if ((err as Error).message === '409 Conflict') {
          setHasAppIdError(true)
        } else {
          addToast({
            severity: 'error',
            message: `An error occurred while ${
              isEditPage ? 'updating' : 'creating'
            } your application. Please try again later.`,
            timeout: 60000,
          })
        }
      }
    },
    [addToast, createApplication, isEditPage, navigate, queryClient, updateApplication],
  )

  return (
    <FormLayout
      initialValues={initialValues}
      isEditPage={isEditPage}
      isLoading={isCreating || isUpdating}
      onSubmit={handleSubmit}
      schema={schema}
      onCancelHref={isEditPage ? `/applications/${appId}?returnTo=/applications` : '/applications'}
    >
      <ApplicationFormikForm hasAppIdError={hasAppIdError} isEditPage={isEditPage} isManaged={isManaged} />
    </FormLayout>
  )
}

export default function ApplicationFormWithData({ appId }: { appId?: string }) {
  const { data: application } = useGetApplicationByAppId(appId)

  const initialValues = useMemo(() => {
    if (!application) {
      return {
        name: '',
        appId: '',
        notes: '',
      }
    }
    return {
      name: application.name,
      appId: application.appId,
      notes: application.notes || '',
    }
  }, [application])

  return (
    <>
      {initialValues.name ? (
        <Helmet>
          <title>Edit {initialValues.name}</title>
        </Helmet>
      ) : null}
      <ApplicationForm
        appId={appId}
        initialValues={initialValues}
        isEditPage={!!appId}
        isManaged={application?.isManaged || false}
      />
    </>
  )
}
