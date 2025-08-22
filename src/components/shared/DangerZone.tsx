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

import { Button, Card, CSS, Flex, H3, Text as FaencyText } from '@traefiklabs/faency'
import { Form, Formik, useFormikContext } from 'formik'
import React, { ComponentProps, FC, ReactNode, MouseEvent, useMemo } from 'react'
import * as Yup from 'yup'

import TextFieldWithControls from 'components/forms/TextFieldWithControls'

const Text = FaencyText as FC<ComponentProps<typeof FaencyText> & { as?: string }>

type DangerZoneCardProps = {
  children?: ReactNode
  css?: CSS
  title?: string
}

export const DangerZoneCard = ({ title = 'Danger Zone', css = {}, children }: DangerZoneCardProps) => (
  <Card css={{ p: '$5', width: '100%', ...css }}>
    <H3 css={{ color: '$red10', mb: '$3' }}>{title}</H3>
    {children}
  </Card>
)

type SubmitButtonProps = {
  buttonType: 'button' | 'submit'
  confirmButtonText: string
  isLoading?: boolean
}

const SubmitButton = ({ buttonType, confirmButtonText, isLoading }: SubmitButtonProps) => {
  const { submitForm } = useFormikContext()

  return (
    <Button
      type={buttonType}
      variant="red"
      state={isLoading ? 'waiting' : undefined}
      onClick={buttonType === 'button' ? () => submitForm() : undefined}
      css={{ borderRadius: 0 }}
    >
      {confirmButtonText}
    </Button>
  )
}

type WrapperProps = {
  asCard?: boolean
  children?: ReactNode
  css?: CSS
}

const Wrapper = ({ css, asCard, children }: WrapperProps) => {
  if (asCard) {
    return <DangerZoneCard css={css}>{children}</DangerZoneCard>
  } else {
    return <>{children}</>
  }
}

type DangerZoneProps = {
  asCard?: boolean
  cancelButtonText?: string
  confirmButtonText: string
  confirmationText: string
  css?: CSS
  description: string | ReactNode
  isLoading?: boolean
  onCancel?: (e?: MouseEvent) => void
  onSubmit: (values) => void
  submitButtonType?: 'button' | 'submit'
}

const DangerZone = ({
  asCard = true,
  cancelButtonText,
  confirmButtonText,
  confirmationText,
  css,
  description,
  isLoading,
  onCancel,
  onSubmit,
  submitButtonType = 'submit',
}: DangerZoneProps) => {
  const schema = useMemo(
    () =>
      Yup.object({
        confirmationText: Yup.string().test(
          'input-match',
          'Confirmation text does not match.',
          (value?: string) => value === confirmationText,
        ),
      }),
    [confirmationText],
  )

  return (
    <Wrapper asCard={asCard} css={css}>
      <Formik initialValues={{ confirmationText: '' }} validationSchema={schema} onSubmit={onSubmit}>
        <Form>
          <Text as="p" size="4" css={{ mb: '$3', width: '100%', lineHeight: '1.5rem' }}>
            {description}
          </Text>
          <Flex direction="column" justify="center">
            <Text as="p" size="4" variant="subtle" css={{ mb: '$2', lineHeight: '1.5rem' }}>
              To confirm, please write &quot;
              <Text size="4" css={{ fontWeight: '400', display: 'contents' }}>
                {confirmationText}
              </Text>
              &quot; in the input text below:
            </Text>
            <TextFieldWithControls name="confirmationText" autoComplete="off" css={{ mb: '$3', width: '100%' }} />
            <Flex gap={3} css={!!cancelButtonText && !!onCancel ? { alignSelf: 'flex-end', pt: '$2' } : {}}>
              {!!cancelButtonText && !!onCancel && (
                <Button type="button" variant="secondary" css={{ borderRadius: 0 }} onClick={onCancel}>
                  {cancelButtonText}
                </Button>
              )}
              <SubmitButton buttonType={submitButtonType} confirmButtonText={confirmButtonText} isLoading={isLoading} />
            </Flex>
          </Flex>
        </Form>
      </Formik>
    </Wrapper>
  )
}

export default DangerZone
