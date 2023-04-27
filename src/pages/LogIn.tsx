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

import React, { useCallback, useEffect, useState } from 'react'
import { Box, Button, Flex, H1, Text } from '@traefiklabs/faency'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { Link, Navigate } from 'react-router-dom'
import TextFieldWithControls from 'components/TextFieldWithControls'
import SubtleLink from 'components/SubtleLink'
import { useAuthDispatch, useAuthState } from 'context/auth'
import { handleLogIn } from 'context/auth/actions'

const SCHEMA = Yup.object().shape({
  username: Yup.string().required('Your username is required'),
  password: Yup.string().required('Your password is required'),
})

const INITIAL_VALUES = {
  username: '',
  password: '',
}

const LogIn = ({ portalTitle }: { portalTitle: string }) => {
  const authDispatch = useAuthDispatch()
  const { error, isLoggedIn } = useAuthState()
  const [errorMsg, setErrorMsg] = useState()

  const handleSubmit = useCallback(async (values) => {
    await handleLogIn(authDispatch, values)
  }, [])

  useEffect(() => {
    if (error) {
      setErrorMsg(error.response?.data?.errorMessage || error.message)
    }
  }, [error])

  if (isLoggedIn) {
    return <Navigate to={'/'} />
  }

  return (
    <Flex id="login" css={{ minHeight: '100vh' }}>
      <Flex css={{ flex: 1, flexDirection: 'column' }}>
        <Flex
          as="main"
          css={{
            mt: '$3',
            mb: '$6',
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box css={{ mt: 40, minWidth: 320 }}>
            <Box as="header" css={{ mb: '$6', textAlign: 'center' }}>
              <H1 css={{ fontSize: '$10', lineHeight: 1.33 }}>{portalTitle}</H1>
            </Box>
            {errorMsg && (
              <Box className="error-wrapper" css={{ my: '$2', maxWidth: 440 }}>
                <Text size="2" css={{ color: '$red9' }}>
                  {errorMsg}
                </Text>
              </Box>
            )}
            <Formik initialValues={INITIAL_VALUES} onSubmit={handleSubmit} validationSchema={SCHEMA}>
              {(formik) => (
                <Form>
                  <TextFieldWithControls
                    label="Username"
                    name="username"
                    placeholder="Enter your username"
                    css={{ mb: '$4' }}
                  />
                  <Box css={{ mb: '$7', position: 'relative' }}>
                    <TextFieldWithControls
                      label="Password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      errorProps={{ css: { position: 'absolute', mt: '$2' } }}
                    />
                    <Flex
                      css={{
                        mt: '$1',
                        alignItems: 'center',
                        justifyContent: 'end',
                        position: 'absolute',
                        right: 0,
                        top: 65,
                      }}
                    >
                      <Link to="/forget-password" style={{ all: 'unset', cursor: 'pointer' }}>
                        <SubtleLink variant="subtle" css={{ textDecoration: 'none', fontSize: '$1' }}>
                          Forgot your password?
                        </SubtleLink>
                      </Link>
                    </Flex>
                  </Box>
                  <Button
                    type="submit"
                    variant="primary"
                    size="large"
                    css={{ mb: '$4', width: '100%', boxSizing: 'border-box' }}
                    state={formik.isSubmitting ? 'waiting' : undefined}
                  >
                    Log In
                  </Button>
                </Form>
              )}
            </Formik>
          </Box>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default LogIn
