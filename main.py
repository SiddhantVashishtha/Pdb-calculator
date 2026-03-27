from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import os

from calculator import calculate_pdb

app = FastAPI(title="PDB Calculator API")

# Setup CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PDBRequest(BaseModel):
    replicas: int
    slaPercentage: float
    workloadType: str
    failureTolerance: int

@app.post("/api/calculate")
def calculate_endpoint(request: PDBRequest):
    try:
        result = calculate_pdb(
            replicas=request.replicas,
            sla_percentage=request.slaPercentage,
            workload_type=request.workloadType,
            failure_tolerance=request.failureTolerance
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")

# Serve static files if 'dist' folder exists (from combined React build)
STATIC_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
if os.path.exists(STATIC_DIR):
    app.mount("/", StaticFiles(directory=STATIC_DIR, html=True), name="static")

