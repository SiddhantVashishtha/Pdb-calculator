import argparse
import sys
from calculator import calculate_pdb

def main():
    parser = argparse.ArgumentParser(description="PDB Calculator CLI")
    parser.add_argument("--replicas", type=int, required=True, help="Number of replicas")
    parser.add_argument("--sla", type=float, required=True, help="SLA percentage (e.g., 99.9)")
    parser.add_argument("--type", type=str, default="stateless", choices=["stateless", "stateful"], help="Workload type")
    parser.add_argument("--tolerance", type=int, default=1, help="Failure tolerance")
    
    args = parser.parse_args()
    
    try:
        result = calculate_pdb(
            replicas=args.replicas,
            sla_percentage=args.sla,
            workload_type=args.type,
            failure_tolerance=args.tolerance
        )
        
        print(f"\n--- Pod Disruption Budget Recommendation ---\n")
        print(f"minAvailable: {result['minAvailable']}")
        print(f"maxUnavailable: {result['maxUnavailable']}")
        print(f"\nExplanation:\n{result['explanation']}")
        print(f"\nGenerated YAML:\n{result['yaml']}")
        
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
