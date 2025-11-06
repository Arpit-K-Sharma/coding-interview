from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# allow running without package context
from routes import router as todos_router
from storage import initialize_storage


def create_app() -> FastAPI:
	app = FastAPI(title="Todo Backend", version="1.0.0")

	app.add_middleware(
		CORSMiddleware,
		allow_origins=["*"],
		allow_credentials=True,
		allow_methods=["*"],
		allow_headers=["*"],
	)

	initialize_storage()
	app.include_router(todos_router)
	return app


app = create_app()


