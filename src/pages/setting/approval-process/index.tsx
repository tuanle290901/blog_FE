import Example from './example'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

function Index() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Example />
    </DndProvider>
  )
}

export default Index
