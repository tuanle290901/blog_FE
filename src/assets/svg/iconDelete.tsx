import React from 'react'
import { IPropsIconSVG } from '~/types/common-svg'
import PropTypes from 'prop-types'

const IconDeleteSVG: React.FC<IPropsIconSVG> = ({ width, height, fill }) => {
  return (
    <svg
      width={width || '22'}
      height={height || '23'}
      viewBox='0 0 22 23'
      fill={'none'}
      xmlns='http://www.w3.org/2000/svg'
    >
      <path
        d='M7.26772 3.44462H7.07129C7.17933 3.44462 7.26772 3.35622 7.26772 3.24819V3.44462H14.732V3.24819C14.732 3.35622 14.8204 3.44462 14.9284 3.44462H14.732V5.21247H16.4999V3.24819C16.4999 2.38145 15.7952 1.67676 14.9284 1.67676H7.07129C6.20455 1.67676 5.49986 2.38145 5.49986 3.24819V5.21247H7.26772V3.44462ZM19.6427 5.21247H2.357C1.92241 5.21247 1.57129 5.56359 1.57129 5.99819V6.7839C1.57129 6.89194 1.65968 6.98033 1.76772 6.98033H3.25075L3.85723 19.8218C3.89651 20.6591 4.58892 21.3196 5.4262 21.3196H16.5735C17.4133 21.3196 18.1032 20.6616 18.1425 19.8218L18.749 6.98033H20.232C20.34 6.98033 20.4284 6.89194 20.4284 6.7839V5.99819C20.4284 5.56359 20.0773 5.21247 19.6427 5.21247ZM16.3845 19.5518H5.61526L5.02107 6.98033H16.9787L16.3845 19.5518Z'
        fill={fill || '#F5222D'}
      />
    </svg>
  )
}

IconDeleteSVG.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  fill: PropTypes.string
}

export default IconDeleteSVG
