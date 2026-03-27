# Pod Disruption Budget (PDB) Calculator

A professional, full-stack application designed for DevOps engineers and developers to easily calculate optimal Kubernetes Pod Disruption Budget (PDB) configurations based on Replicas, Availability Targets (SLA), and Workload Types.

![PDB Calculator](https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Kubernetes_logo_without_workmark.svg/1024px-Kubernetes_logo_without_workmark.svg.png)

## 🎯 About

**Pod Disruption Budgets (PDB)** are a Kubernetes feature that restricts how many Pods of a replicated application can be taken down simultaneously during voluntary disruptions (like node draining or maintenance). This guarantees that a certain number or percentage of replicas are always up, ensuring your application strictly meets its Service Level Agreement (SLA).

This project includes:
- **React Frontend**: A modern, interactive UI built with Vite and Tailwind CSS. Provides real-time calculations, dynamic charts (Recharts), and a dark/light theme toggle.
- **Python Backend**: Fast and robust API built with FastAPI executing all business logic.
- **CLI Tool**: A built-in Python script for quick local CLI evaluations.
- **Containerization**: A multi-stage Dockerfile combining both backend and frontend into a single, deployable image.
- **Kubernetes Ready**: Pre-built YAML files for seamless deployment into any K8s cluster.

## 🚀 Quick Start (Local Setup)

The application provides a seamless local development experience using `docker-compose`.

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/pdb-calculator.git
cd pdb-calculator

# 2. Run with Docker Compose
docker-compose up --build
```

The application will be available at [http://localhost:8000](http://localhost:8000).

---

## 🛠️ Development Setup (Without Docker)

If you prefer to run the components separately for development:

### 1. Start the FastAPI Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```
The backend API will run on `http://127.0.0.1:8000`.

### 2. Start the React Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:5173` and will proxy API requests to the Python backend automatically.

---

## ⚙️ Core Algorithm Explained

The backend calculates two primary metrics: `minAvailable` and `maxUnavailable`.

1. **`minAvailable = ceil(replicas * SLA)`**
   *Why?* We always round up (`ceil`). If an SLA theoretically demands 2.1 pods to stay online, having only 2 pods online would violate the SLA. Therefore, we require at least 3 pods.
2. **`maxUnavailable = replicas - minAvailable`**
   *Why?* This represents how many pods can be safely evicted at the same time by Kubernetes automation without breaching the `minAvailable` constraint.

*Edge Case Handle*: If your resulting `maxUnavailable` is `0` (e.g. 1 replica, or extremely high SLA on a low replica count), voluntary evictions are blocked. The calculator actively displays warnings when this happens, as it will deadlock Kubernetes node drains!

---

## 💻 CLI Usage

You can also use the calculator directly from the command line:

```bash
cd backend
python cli.py --replicas 5 --sla 99.9 --type stateless --tolerance 1
```

**Example Output:**
```
--- Pod Disruption Budget Recommendation ---

minAvailable: 5
maxUnavailable: 0

Explanation:
To maintain an SLA of 99.9% across 5 replicas, you need at least 5 pod(s) running at all times. Warning: Your maxUnavailable is 0. This means no voluntary disruptions (like node draining) are allowed! This can block cluster upgrades. Consider lowering your SLA requirement or increasing the number of replicas if you need voluntary disruptions.

Generated YAML:
apiVersion: policy/v1
...
```

---

## 🏗️ Deployment (Kubernetes)

To deploy the calculator to your K8s cluster:

1. Build the Docker image:
   ```bash
   docker build -t pdb-calculator:latest .
   ```
2. Apply the K8s manifests:
   ```bash
   kubectl apply -f k8s/
   ```
3. Expose the service using an Ingress or Port-Forwarding:
   ```bash
   kubectl port-forward svc/pdb-calculator-service 8000:80
   ```

                                               
