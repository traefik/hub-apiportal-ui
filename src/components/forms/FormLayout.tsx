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

import { Box, Button, Flex } from '@traefiklabs/faency'
import { Form, Formik } from 'formik'
import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'

import RequiredText from 'components/forms/RequiredText'

type FormLayoutProps = {
  additionalButtons?: ReactNode
  additionalContent?: ReactNode
  additionalNote?: ReactNode
  alwaysEnableSubmitButton?: boolean
  children: ReactNode
  ctaLabel?: string
  enableReinitialize?: boolean
  hasPermission?: boolean
  initialValues: any
  isEditPage?: boolean
  isLoading: boolean
  onCancelFn?: () => void
  onCancelHref?: string
  onSubmit: (payload: any) => void
  schema: any
  testId?: string
}

export default function FormLayout({
  additionalButtons,
  additionalContent,
  additionalNote,
  alwaysEnableSubmitButton = false,
  children,
  ctaLabel = 'Create',
  enableReinitialize = false,
  hasPermission = true,
  initialValues,
  isEditPage,
  isLoading,
  onCancelFn = undefined,
  onCancelHref,
  onSubmit,
  schema,
  testId,
}: FormLayoutProps) {
  return (
    <Flex direction="column" css={{ maxWidth: 912, width: '100%' }}>
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={onSubmit}
        enableReinitialize={enableReinitialize}
      >
        {(formik) => (
          <Form data-testid={testId}>
            {children}

            <Box css={{ mb: '$3' }}>
              <RequiredText />
            </Box>

            {additionalNote}

            {hasPermission && (
              <Flex gap={4}>
                <Flex css={{ flexGrow: 1 }}>{additionalButtons}</Flex>
                {onCancelFn ? (
                  <Button type="button" onClick={onCancelFn} ghost size="large" css={{ borderRadius: 0 }}>
                    Cancel
                  </Button>
                ) : (
                  <Link to={onCancelHref || '/'}>
                    <Button type="button" ghost size="large" css={{ borderRadius: 0 }}>
                      Cancel
                    </Button>
                  </Link>
                )}

                <Button
                  type="submit"
                  size="large"
                  disabled={alwaysEnableSubmitButton ? false : !formik.dirty}
                  state={isLoading ? 'waiting' : undefined}
                  css={{ borderRadius: 0 }}
                >
                  {isEditPage ? 'Save' : ctaLabel}
                </Button>
              </Flex>
            )}
            {additionalContent}
          </Form>
        )}
      </Formik>
    </Flex>
  )
}
