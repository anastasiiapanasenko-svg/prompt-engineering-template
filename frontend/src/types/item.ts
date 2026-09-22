export interface Item {
  id: string
  title: string
  description: string
  created_at: string
  updated_at: string
}

export interface ItemCreateInput {
  title: string
  description?: string
}

export interface ItemUpdateInput {
  title?: string
  description?: string
}
