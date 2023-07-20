import React, { FC, memo } from 'react'
import { Handle, Position } from 'reactflow'
import PropTypes from 'prop-types'

interface ICustomNode {
  data: any
  isConnectable: boolean
}

const CustomNode: FC<ICustomNode> = ({ data, isConnectable }) => {
  return (
    <>
      <Handle
        type='target'
        position={Position.Left}
        style={{ background: 'black', width: 10, height: 10 }}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <div className='selector-node-custom-props tw-font-bold'>{data?.label}</div>
      <Handle
        type='source'
        position={Position.Right}
        style={{ background: 'black', width: 10, height: 10 }}
        isConnectable={isConnectable}
      />
    </>
  )
}

CustomNode.propTypes = {
  data: PropTypes.any.isRequired,
  isConnectable: PropTypes.bool.isRequired
}

export default CustomNode
