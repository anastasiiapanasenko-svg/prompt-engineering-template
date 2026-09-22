from fastapi import APIRouter, Depends, HTTPException, status

from app.dependencies import get_item_service
from app.models.item import ItemCreate, ItemResponse, ItemUpdate
from app.services.item_service import ItemNotFoundError, ItemService

router = APIRouter(prefix="/items", tags=["items"])


@router.get("", response_model=list[ItemResponse])
def list_items(service: ItemService = Depends(get_item_service)) -> list[ItemResponse]:
    return service.list_items()


@router.get("/{item_id}", response_model=ItemResponse)
def get_item(
    item_id: str,
    service: ItemService = Depends(get_item_service),
) -> ItemResponse:
    try:
        return service.get_item(item_id)
    except ItemNotFoundError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")


@router.post("", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
def create_item(
    payload: ItemCreate,
    service: ItemService = Depends(get_item_service),
) -> ItemResponse:
    return service.create_item(payload)


@router.patch("/{item_id}", response_model=ItemResponse)
def update_item(
    item_id: str,
    payload: ItemUpdate,
    service: ItemService = Depends(get_item_service),
) -> ItemResponse:
    try:
        return service.update_item(item_id, payload)
    except ItemNotFoundError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(
    item_id: str,
    service: ItemService = Depends(get_item_service),
) -> None:
    try:
        service.delete_item(item_id)
    except ItemNotFoundError:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
