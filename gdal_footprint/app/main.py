import tempfile
import os
import concurrent.futures
from typing import List
from fastapi import FastAPI, UploadFile, File, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from osgeo import gdal
from pydantic import BaseModel, BaseSettings
import psycopg2
from psycopg2 import sql
import logging

# تنظیمات لاگ
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class Settings(BaseSettings):
    pg_host: str = "localhost"
    pg_port: int = 5432
    pg_db: str = "gisdb"
    pg_user: str = "postgres"
    pg_password: str = "postgres"
    pg_table: str = "footprints"
    max_workers: int = 4

    class Config:
        env_file = ".env"

settings = Settings()
app = FastAPI(title="Raster Footprint Service")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class FootprintResponse(BaseModel):
    filename: str
    data: str = None
    format: str
    status: str
    error: str = None

class PGConnection:
    def __enter__(self):
        self.conn = psycopg2.connect(
            host=settings.pg_host,
            port=settings.pg_port,
            dbname=settings.pg_db,
            user=settings.pg_user,
            password=settings.pg_password
        )
        return self.conn.cursor()
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.conn.commit()
        self.conn.close()

def process_single_file(file: UploadFile, params: dict) -> dict:
    try:
        with tempfile.TemporaryDirectory() as tmp_dir:
            file_path = os.path.join(tmp_dir, file.filename)
            with open(file_path, "wb") as buffer:
                buffer.write(file.file.read())
            
            src_ds = gdal.Open(file_path)
            if not src_ds:
                raise ValueError("Invalid raster file")
            
            result = gdal.Footprint(
                None,
                src_ds,
                **params
            )
            
            if params.get('save_to_postgres'):
                with PGConnection() as cursor:
                    insert_query = sql.SQL("""
                        INSERT INTO {} (filename, geom)
                        VALUES (%s, ST_GeomFromGeoJSON(%s))
                    """).format(sql.Identifier(settings.pg_table))
                    
                    cursor.execute(insert_query, (file.filename, result))
            
            return {
                "filename": file.filename,
                "data": result,
                "format": params.get('format'),
                "status": "success"
            }
            
    except Exception as e:
        logger.error(f"Error processing {file.filename}: {str(e)}")
        return {
            "filename": file.filename,
            "status": "failed",
            "error": str(e)
        }

@app.post("/footprint/", response_model=FootprintResponse)
async def single_footprint(
    file: UploadFile = File(...),
    format: str = "GeoJSON",
    convex_hull: bool = True,
    band: int = 1,
    simplify: float = None,
    dst_srs: str = "EPSG:4326",
    save_to_postgres: bool = False
):
    params = {
        "format": format,
        "bands": [band],
        "convexHull": convex_hull,
        "simplify": simplify,
        "dstSRS": dst_srs,
        "save_to_postgres": save_to_postgres
    }
    
    result = process_single_file(file, params)
    
    if result["status"] == "success":
        return result
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=result["error"]
        )

@app.post("/batch-footprint/", response_model=List[FootprintResponse])
async def batch_footprint(
    files: List[UploadFile] = File(...),
    format: str = "GeoJSON",
    convex_hull: bool = True,
    band: int = 1,
    simplify: float = None,
    dst_srs: str = "EPSG:4326",
    save_to_postgres: bool = False,
    parallel: bool = True
):
    params = {
        "format": format,
        "bands": [band],
        "convexHull": convex_hull,
        "simplify": simplify,
        "dstSRS": dst_srs,
        "save_to_postgres": save_to_postgres
    }
    
    results = []
    
    if parallel:
        with concurrent.futures.ThreadPoolExecutor(max_workers=settings.max_workers) as executor:
            futures = [executor.submit(process_single_file, file, params) for file in files]
            for future in concurrent.futures.as_completed(futures):
                results.append(future.result())
    else:
        for file in files:
            results.append(process_single_file(file, params))
    
    return results

@app.get("/")
def health_check():
    try:
        with PGConnection() as cursor:
            cursor.execute("SELECT 1")
        db_status = "connected"
    except Exception as e:
        db_status = f"disconnected: {str(e)}"
    
    return {
        "status": "OK",
        "gdal_version": gdal.VersionInfo(),
        "postgres_status": db_status
    }

# ایجاد جدول در صورت عدم وجود
@app.on_event("startup")
def init_db():
    try:
        with PGConnection() as cursor:
            cursor.execute(f"""
                CREATE TABLE IF NOT EXISTS {settings.pg_table} (
                    id SERIAL PRIMARY KEY,
                    filename VARCHAR(255),
                    geom GEOMETRY(Polygon, 4326),
                    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            cursor.execute("CREATE INDEX IF NOT EXISTS footprints_geom_idx ON {settings.pg_table} USING GIST(geom)")
    except Exception as e:
        logger.error(f"Database initialization failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)