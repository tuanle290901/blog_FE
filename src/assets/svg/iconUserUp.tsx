/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react'
import { IPropsIconSVG } from '~/types/common-svg'

const IconUserUpSVG: React.FC<IPropsIconSVG> = ({ width, height }) => {
  return (
    <svg
      width={width || '16'}
      height={height || '16'}
      viewBox='0 0 13 15'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M1 13.4995V12.1662C1 11.4589 1.28095 10.7807 1.78105 10.2806C2.28115 9.78046 2.95942 9.49951 3.66667 9.49951H6.33333M9.66667 14.1662V10.1662M9.66667 10.1662L11.6667 12.1662M9.66667 10.1662L7.66667 12.1662M2.33333 4.16618C2.33333 4.87342 2.61428 5.5517 3.11438 6.0518C3.61448 6.55189 4.29276 6.83285 5 6.83285C5.70724 6.83285 6.38552 6.55189 6.88562 6.0518C7.38572 5.5517 7.66667 4.87342 7.66667 4.16618C7.66667 3.45893 7.38572 2.78066 6.88562 2.28056C6.38552 1.78046 5.70724 1.49951 5 1.49951C4.29276 1.49951 3.61448 1.78046 3.11438 2.28056C2.61428 2.78066 2.33333 3.45893 2.33333 4.16618Z'
        stroke='#52C41A'
        strokeWidth='1.33333'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

export default IconUserUpSVG
