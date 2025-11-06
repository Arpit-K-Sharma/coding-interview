from typing import List

from fastapi import APIRouter, HTTPException, Path, status


from models import Todo, TodoCreate, TodoUpdate
import storage


router = APIRouter(prefix="/todos", tags=["todos"])


@router.get("/", response_model=List[Todo])
def list_all_todos() -> List[Todo]:
	return storage.list_todos()


@router.post("/", response_model=Todo, status_code=status.HTTP_201_CREATED)
def create_new_todo(payload: TodoCreate) -> Todo:
	return storage.create_todo(payload)


@router.get("/{todo_id}", response_model=Todo)
def get_by_id(todo_id: int = Path(..., ge=1)) -> Todo:
	item = storage.get_todo(todo_id)
	if item is None:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
	return item


@router.put("/{todo_id}", response_model=Todo)
def replace_by_id(payload: TodoCreate, todo_id: int = Path(..., ge=1)) -> Todo:
	item = storage.replace_todo(todo_id, payload)
	if item is None:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
	return item


@router.patch("/{todo_id}", response_model=Todo)
def update_by_id(payload: TodoUpdate, todo_id: int = Path(..., ge=1)) -> Todo:
	item = storage.update_todo(todo_id, payload)
	if item is None:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
	return item


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_by_id(todo_id: int = Path(..., ge=1)) -> None:
	success = storage.delete_todo(todo_id)
	if not success:
		raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
	return None


