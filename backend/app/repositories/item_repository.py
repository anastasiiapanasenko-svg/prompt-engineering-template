from pathlib import Path

from app.models.item import ItemInDb
from app.utils.json_store import read_list_file, write_list_file


class ItemRepository:
    def __init__(self, file_path: Path) -> None:
        self._file_path = file_path

    def list_all(self) -> list[ItemInDb]:
        return read_list_file(self._file_path, ItemInDb)

    def get_by_id(self, item_id: str) -> ItemInDb | None:
        return next((item for item in self.list_all() if item.id == item_id), None)

    def create(self, item: ItemInDb) -> ItemInDb:
        items = self.list_all()
        items.append(item)
        write_list_file(self._file_path, items)
        return item

    def update(self, item: ItemInDb) -> ItemInDb:
        items = self.list_all()
        for index, existing in enumerate(items):
            if existing.id == item.id:
                items[index] = item
                write_list_file(self._file_path, items)
                return item
        raise KeyError(item.id)

    def delete(self, item_id: str) -> bool:
        items = self.list_all()
        new_items = [item for item in items if item.id != item_id]
        if len(new_items) == len(items):
            return False
        write_list_file(self._file_path, new_items)
        return True
