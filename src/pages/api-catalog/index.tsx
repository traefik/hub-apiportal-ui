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
import React from 'react'

import OasPage from 'components/api/OasPage'
import ErrorSuspenseWrapper from 'components/layouts/ErrorSuspenseWrapper'
import PageLayout from 'components/layouts/PageLayout'
import SideNavbar from 'components/layouts/side-nav/SideNavbar'

export default function API() {
  return (
    <PageLayout containerSize={4} fixedHeight hideBackLink noGutter sideNavbar={<SideNavbar />}>
      <ErrorSuspenseWrapper>
        <OasPage />
      </ErrorSuspenseWrapper>
    </PageLayout>
  )
}
