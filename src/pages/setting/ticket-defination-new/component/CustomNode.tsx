import React, { FC, memo } from 'react'
import { Handle, Position } from 'reactflow'
import PropTypes from 'prop-types'
import CustomHandle from './CustomHandle'

interface ICustomNode {
  data: any
  isConnectable: boolean
}

const CustomNode: FC<ICustomNode> = ({ data, isConnectable }) => {
  return (
    <>
      {/* <Handle
        type='target'
        position={Position.Left}
        style={{ background: 'black', width: 10, height: 10 }}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      /> */}

      <CustomHandle
        type='target'
        position={Position.Left}
        isConnectable={1}
        style={{ background: 'black', width: 10, height: 10 }}
      />
      <div className='selector-node-custom-props tw-font-bold'>{data?.label}</div>
      <CustomHandle
        type='source'
        position={Position.Right}
        isConnectable={isConnectable}
        style={{ background: 'black', width: 10, height: 10 }}
      />
    </>
  )
}

CustomNode.propTypes = {
  data: PropTypes.any.isRequired,
  isConnectable: PropTypes.bool.isRequired
}

export default memo(CustomNode)
