import { useEffect, useState, type FormEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  useCreateItemMutation,
  useListItemsQuery,
  useUpdateItemMutation,
} from '@/store/api/itemsApi'
import { closeItemDialog } from '@/store/slices/appSlice'
import type { RootState } from '@/store/store'

export function ItemFormDialog() {
  const dispatch = useDispatch()
  const { itemDialogMode, editingItemId } = useSelector(
    (state: RootState) => state.app,
  )
  const { data: items } = useListItemsQuery()
  const [createItem, createState] = useCreateItemMutation()
  const [updateItem, updateState] = useUpdateItemMutation()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)

  const open = itemDialogMode !== null
  const editingItem =
    itemDialogMode === 'edit' && editingItemId
      ? items?.find((item) => item.id === editingItemId)
      : undefined

  useEffect(() => {
    if (itemDialogMode === 'create') {
      setTitle('')
      setDescription('')
      setError(null)
      return
    }
    if (itemDialogMode === 'edit' && editingItem) {
      setTitle(editingItem.title)
      setDescription(editingItem.description)
      setError(null)
    }
  }, [itemDialogMode, editingItem])

  const handleClose = () => {
    dispatch(closeItemDialog())
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const trimmedTitle = title.trim()
    if (!trimmedTitle) {
      setError('Title is required.')
      return
    }

    try {
      if (itemDialogMode === 'create') {
        await createItem({
          title: trimmedTitle,
          description: description.trim(),
        }).unwrap()
      } else if (itemDialogMode === 'edit' && editingItemId) {
        await updateItem({
          id: editingItemId,
          body: {
            title: trimmedTitle,
            description: description.trim(),
          },
        }).unwrap()
      }
      handleClose()
    } catch {
      setError('Could not save the item. Check validation and try again.')
    }
  }

  const isSaving = createState.isLoading || updateState.isLoading

  return (
    <Dialog open={open} onOpenChange={(next) => !next && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {itemDialogMode === 'edit' ? 'Edit item' : 'Create item'}
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="item-title">Title</Label>
            <Input
              id="item-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={200}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="item-description">Description</Label>
            <Textarea
              id="item-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={2000}
              rows={4}
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
