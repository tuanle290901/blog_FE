/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from 'antd'
import React from 'react'

import PropTypes from 'prop-types'

export interface ICommonButton {
  classNameProps: string | ''
  icon: any
  title: string
  onClick: () => void
  typeProps: any
  loading: boolean | false
}

const CommonButton: React.FC<ICommonButton> = (props: ICommonButton) => {
  const { classNameProps, icon, title, onClick, typeProps, loading } = props
  return (
    <Button
      {...typeProps}
      className={
        classNameProps
          ? `tw-flex tw-items-center tw-justify-center ${classNameProps}`
          : `tw-flex tw-items-center tw-justify-center`
      }
      onClick={() => onClick()}
      loading={loading || false}
    >
      {icon && icon}
      {title}
    </Button>
  )
}

CommonButton.prototype = {
  classNameProps: PropTypes.string,
  icon: PropTypes.node,
  title: PropTypes.string,
  onClick: PropTypes.func,
  typeProps: PropTypes.object,
  loading: PropTypes.bool
}

export default CommonButton
