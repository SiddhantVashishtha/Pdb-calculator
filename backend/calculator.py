import math
from typing import TypedDict

class PDBResult(TypedDict):
    minAvailable: int
    maxUnavailable: int
    yaml: str
    explanation: str

def calculate_pdb(replicas: int, sla_percentage: float, workload_type: str, failure_tolerance: int) -> PDBResult:
    """
    Calculate the optimal Pod Disruption Budget based on given parameters.
    """
    if replicas < 1:
        raise ValueError("Replicas must be at least 1")
    if sla_percentage < 0 or sla_percentage > 100:
        raise ValueError("SLA percentage must be between 0 and 100")

    # minAvailable is calculated directly from the SLA requirement
    # We round up to ensure the SLA is strictly met (ceil)
    min_available = math.ceil(replicas * (sla_percentage / 100.0))
    
    # If SLA is very high, min_available could equal replicas
    # We cap min_available to replicas
    if min_available > replicas:
        min_available = replicas
        
    # Edge case: if minAvailable is 0 but we want some availability, set it to 1
    # unless SLA is exactly 0%
    if min_available == 0 and sla_percentage > 0:
        min_available = 1

    max_unavailable = replicas - min_available

    explanation = []
    explanation.append(f"To maintain an SLA of {sla_percentage}% across {replicas} replicas, you need at least {min_available} pod(s) running at all times.")
    
    if max_unavailable == 0:
        explanation.append("Warning: Your maxUnavailable is 0. This means no voluntary disruptions (like node draining) are allowed! This can block cluster upgrades. Consider lowering your SLA requirement or increasing the number of replicas if you need voluntary disruptions.")
    else:
        explanation.append(f"This allows up to {max_unavailable} pod(s) to be taken down simultaneously for cluster maintenance without violating your SLA.")
        
    if replicas == 1:
        explanation.append("Note: Running a single replica is generally highly discouraged for production workloads because any disruption (voluntary or not) will cause downtime.")

    yaml_template = f"""apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: example-{workload_type.lower()}-pdb
spec:
  minAvailable: {min_available}
  selector:
    matchLabels:
      app: example-app
"""

    return {
        "minAvailable": min_available,
        "maxUnavailable": max_unavailable,
        "yaml": yaml_template,
        "explanation": " ".join(explanation)
    }
