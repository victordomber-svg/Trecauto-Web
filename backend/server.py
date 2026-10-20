from fastapi import FastAPI, APIRouter, BackgroundTasks
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import Annotated, Optional
from datetime import datetime, timezone
from bson import ObjectId
from pydantic import BaseModel, Field, ConfigDict, BeforeValidator, EmailStr

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from email_service import notify_part_request
client = AsyncIOMotorClient(os.environ['MONGO_URL'])
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

PyObjectId = Annotated[str, BeforeValidator(lambda v: str(v) if isinstance(v, ObjectId) else v)]


class BaseDocument(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    id: Optional[PyObjectId] = Field(default=None, alias="_id")

    def to_mongo(self) -> dict:
        return self.model_dump(by_alias=True, exclude={"id"})

    @classmethod
    def from_mongo(cls, doc: dict):
        return cls(**doc)


class PartRequestIn(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    phone: str = Field(min_length=6, max_length=25)
    email: Optional[EmailStr] = None
    make: str = Field(min_length=1, max_length=40)
    model: str = Field(default="", max_length=60)
    year: str = Field(default="", max_length=10)
    part: str = Field(min_length=2, max_length=120)
    message: str = Field(default="", max_length=1000)


class PartRequest(BaseDocument, PartRequestIn):
    status: str = "nueva"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


@api_router.get("/")
async def root():
    return {"message": "Trecauto API"}


@api_router.post("/part-requests")
async def create_part_request(data: PartRequestIn, background: BackgroundTasks):
    req = PartRequest(**data.model_dump())
    res = await db.part_requests.insert_one(req.to_mongo())
    saved = PartRequest.from_mongo(await db.part_requests.find_one({"_id": res.inserted_id}))
    background.add_task(notify_part_request, saved.model_dump())
    return {"ok": True, "id": saved.id, "created_at": saved.created_at}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
