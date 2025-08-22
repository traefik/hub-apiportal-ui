import { Flex } from '@traefiklabs/faency'
import React from 'react'

import { CustomIconProps } from 'components/icons'

const FilterIcon = ({ color = 'currentColor', css = {}, ...props }: CustomIconProps) => {
  return (
    <Flex css={css}>
      <svg width="24" height="24" viewBox="2 2 20 20" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
          d="M18.711 5.545A1.013 1.013 0 0 0 17.813 5h-10.8a1.013 1.013 0 0 0-.84 1.579l3.877 6.044v5.202a.675.675 0 0 0 .926.627l3.375-1.35a.676.676 0 0 0 .424-.627v-3.852l3.867-6.03a1.013 1.013 0 0 0 .07-1.048zm-5.179 6.516a.675.675 0 0 0-.107.364v3.593l-2.025.81v-4.403a.675.675 0 0 0-.106-.364L7.63 6.35h9.564l-3.663 5.71z"
          fill={color}
          fillRule="nonzero"
        />
      </svg>
    </Flex>
  )
}

export default FilterIcon
