import React from 'react'
import { IPropsIconSVG } from '~/types/common-svg'

const IconUserDownSVG: React.FC<IPropsIconSVG> = ({ width, height, className }) => {
  return (
    <svg
      className={className}
      width={width || '16'}
      height={height || '16'}
      viewBox='0 0 16 17'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M4 14.4995V13.1662C4 12.4589 4.28095 11.7807 4.78105 11.2806C5.28115 10.7805 5.95942 10.4995 6.66667 10.4995H9.33333C9.56133 10.4995 9.78267 10.5282 9.99333 10.5822M12.6667 11.1662V15.1662M12.6667 15.1662L14.6667 13.1662M12.6667 15.1662L10.6667 13.1662M5.33333 5.16618C5.33333 5.87342 5.61428 6.5517 6.11438 7.0518C6.61448 7.55189 7.29276 7.83285 8 7.83285C8.70724 7.83285 9.38552 7.55189 9.88562 7.0518C10.3857 6.5517 10.6667 5.87342 10.6667 5.16618C10.6667 4.45893 10.3857 3.78066 9.88562 3.28056C9.38552 2.78046 8.70724 2.49951 8 2.49951C7.29276 2.49951 6.61448 2.78046 6.11438 3.28056C5.61428 3.78066 5.33333 4.45893 5.33333 5.16618Z'
        stroke='#F5222D'
        strokeWidth='1.33333'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

export default IconUserDownSVG
