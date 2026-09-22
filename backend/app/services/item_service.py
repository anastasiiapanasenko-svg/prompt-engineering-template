from datetime import datetime, timezone

from app.models.item import ItemCreate, ItemInDb, ItemResponse, ItemUpdate
from app.repositories.item_repository import ItemRepository


class ItemNotFoundError(Exception):
    pass


class ItemService:
    def __init__(self, repository: ItemRepository) -> None:
        self._repository = repository

    def list_items(self) -> list[ItemResponse]:
        return [ItemResponse.from_db(item) for item in self._repository.list_all()]

    def get_item(self, item_id: str) -> ItemResponse:
        item = self._repository.get_by_id(item_id)
        if item is None:
            raise ItemNotFoundError(item_id)
        return ItemResponse.from_db(item)

    def create_item(self, payload: ItemCreate) -> ItemResponse:
        created = self._repository.create(ItemInDb(**payload.model_dump()))
        return ItemResponse.from_db(created)

    def update_item(self, item_id: str, payload: ItemUpdate) -> ItemResponse:
        existing = self._repository.get_by_id(item_id)
        if existing is None:
            raise ItemNotFoundError(item_id)

        data = existing.model_dump()
        updates = payload.model_dump(exclude_unset=True)
        data.update(updates)
        data["updated_at"] = datetime.now(timezone.utc)
        updated = ItemInDb.model_validate(data)

        self._repository.update(updated)
        return ItemResponse.from_db(updated)

    def delete_item(self, item_id: str) -> None:
        deleted = self._repository.delete(item_id)
        if not deleted:
            raise ItemNotFoundError(item_id)
