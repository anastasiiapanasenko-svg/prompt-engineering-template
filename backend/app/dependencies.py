from functools import lru_cache

from fastapi import Depends

from app.repositories.item_repository import ItemRepository
from app.services.item_service import ItemService
from app.utils.paths import get_data_dir


@lru_cache
def get_item_repository() -> ItemRepository:
    data_dir = get_data_dir()
    return ItemRepository(data_dir / "items.json")


def get_item_service(
    repository: ItemRepository = Depends(get_item_repository),
) -> ItemService:
    return ItemService(repository=repository)
