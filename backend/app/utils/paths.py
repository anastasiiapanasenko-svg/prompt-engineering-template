from pathlib import Path


def get_backend_root() -> Path:
    return Path(__file__).resolve().parent.parent.parent


def get_data_dir() -> Path:
    data_dir = get_backend_root() / "data"
    data_dir.mkdir(parents=True, exist_ok=True)
    return data_dir
