import React from 'react'
import PropTypes from 'prop-types'
import { IPropsIconSVG } from '~/types/common-svg'

const IconBackSVG: React.FC<IPropsIconSVG> = ({ width, height, fill }) => {
  return (
    <svg width={width || 11} height={height || 16} viewBox='0 0 11 16' fill={'none'} xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M5.699 7.99996L10.6497 12.949L8.17525 15.4252L0.75 7.99996L8.17525 0.574707L10.6497 3.05096L5.699 7.99996Z'
        fill={fill || '#09121F'}
      />
    </svg>
  )
}

IconBackSVG.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  fill: PropTypes.string
}

export default IconBackSVG
