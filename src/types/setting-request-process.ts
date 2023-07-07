export interface TargetProps {
  targetKey: string
  onDrop: (item: DropItem, targetKey: string) => void
  dropItem: DropItem[]
  canDropItem: any
}

export interface DropItem {
  id: string
  name: string
}
