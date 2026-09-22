import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useDispatch } from 'react-redux'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ItemFormDialog } from '@/features/items/ItemFormDialog'
import {
  useDeleteItemMutation,
  useListItemsQuery,
} from '@/store/api/itemsApi'
import {
  openCreateItemDialog,
  openEditItemDialog,
} from '@/store/slices/appSlice'

export function ItemsPage() {
  const dispatch = useDispatch()
  const { data: items = [], isLoading, isError } = useListItemsQuery()
  const [deleteItem] = useDeleteItemMutation()

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Delete this item?')
    if (!confirmed) return
    await deleteItem(id)
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 p-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Items</h1>
          <p className="text-sm text-muted-foreground">
            Manage items stored by the FastAPI backend.
          </p>
        </div>
        <Button onClick={() => dispatch(openCreateItemDialog())}>
          <Plus />
          New item
        </Button>
      </header>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading items…</p>
      ) : null}
      {isError ? (
        <p className="text-sm text-destructive">
          Failed to load items. Is the backend running on port 8001?
        </p>
      ) : null}

      {!isLoading && !isError && items.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No items yet</CardTitle>
            <CardDescription>
              Create your first item to verify the CRUD flow end to end.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      <ul className="grid gap-4">
        {items.map((item) => (
          <li key={item.id}>
            <Card>
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  {item.description ? (
                    <CardDescription className="whitespace-pre-wrap">
                      {item.description}
                    </CardDescription>
                  ) : (
                    <CardDescription>No description</CardDescription>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label={`Edit ${item.title}`}
                    onClick={() => dispatch(openEditItemDialog(item.id))}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    aria-label={`Delete ${item.title}`}
                    onClick={() => void handleDelete(item.id)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Updated {new Date(item.updated_at).toLocaleString()}
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>

      <ItemFormDialog />
    </div>
  )
}
