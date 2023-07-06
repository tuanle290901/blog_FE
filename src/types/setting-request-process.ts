export interface DustbinProps {
  dustbinKey: string
  onDrop: (item: DropItem, dustbinKey: string) => void
  dropItem: DropItem[]
}

export interface DropItem {
  id: string
  name: string
}
