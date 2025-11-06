import json
import os
import threading
from contextlib import contextmanager
from datetime import datetime
from tempfile import NamedTemporaryFile
from typing import Dict, List, Optional

from models import Todo, TodoCreate, TodoUpdate


DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
DATA_FILE = os.path.join(DATA_DIR, "todos.json")

_lock = threading.RLock()
_todos: Dict[int, Todo] = {}
_next_id: int = 1


def _ensure_data_dir() -> None:
	if not os.path.isdir(DATA_DIR):
		os.makedirs(DATA_DIR, exist_ok=True)


def _read_file() -> None:
	global _todos, _next_id
	if not os.path.isfile(DATA_FILE):
		_todos = {}
		_next_id = 1
		return
	with open(DATA_FILE, "r", encoding="utf-8") as f:
		try:
			data = json.load(f)
		except json.JSONDecodeError:
			data = {"next_id": 1, "items": []}
	items = data.get("items", [])
	_next_id = int(data.get("next_id", 1))
	_todos = {int(item["id"]): Todo(**item) for item in items}


def _atomic_write(payload: dict) -> None:
	_ensure_data_dir()
	with NamedTemporaryFile("w", delete=False, dir=DATA_DIR, encoding="utf-8") as tmp:
		json.dump(payload, tmp, ensure_ascii=False, default=str, indent=2)
		tmp_path = tmp.name
	os.replace(tmp_path, DATA_FILE)


def _persist() -> None:
	items = [todo.model_dump() for todo in _todos.values()]
	payload = {"next_id": _next_id, "items": items}
	_atomic_write(payload)


@contextmanager
def storage_lock():
	with _lock:
		yield


def initialize_storage() -> None:
	with storage_lock():
		_ensure_data_dir()
		_read_file()


def list_todos() -> List[Todo]:
	with storage_lock():
		return sorted(_todos.values(), key=lambda t: t.id)


def get_todo(todo_id: int) -> Optional[Todo]:
	with storage_lock():
		return _todos.get(int(todo_id))


def create_todo(payload: TodoCreate) -> Todo:
	global _next_id
	with storage_lock():
		new_id = _next_id
		_next_id += 1
		now = datetime.utcnow()
		todo = Todo(id=new_id, created_at=now, updated_at=now, **payload.model_dump())
		_todos[new_id] = todo
		_persist()
		return todo


def replace_todo(todo_id: int, payload: TodoCreate) -> Optional[Todo]:
	with storage_lock():
		existing = _todos.get(int(todo_id))
		if existing is None:
			return None
		now = datetime.utcnow()
		updated = Todo(
			id=existing.id,
			created_at=existing.created_at,
			updated_at=now,
			**payload.model_dump(),
		)
		_todos[existing.id] = updated
		_persist()
		return updated


def update_todo(todo_id: int, payload: TodoUpdate) -> Optional[Todo]:
	with storage_lock():
		existing = _todos.get(int(todo_id))
		if existing is None:
			return None
		data = existing.model_dump()
		updates = payload.model_dump(exclude_unset=True)
		data.update({k: v for k, v in updates.items() if v is not None or k == "completed"})
		data["updated_at"] = datetime.utcnow()
		updated = Todo(**data)
		_todos[existing.id] = updated
		_persist()
		return updated


def delete_todo(todo_id: int) -> bool:
	with storage_lock():
		if int(todo_id) in _todos:
			del _todos[int(todo_id)]
			_persist()
			return True
		return False


