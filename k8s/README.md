# Kubernetes Deployment — TGSRTC Portal

## Prerequisites
- [minikube](https://minikube.sigs.k8s.io/docs/start/) installed
- [kubectl](https://kubernetes.io/docs/tasks/tools/) installed

## Deploy to Minikube

```bash
# Start minikube
minikube start

# Apply the manifests
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

# Check deployment status
kubectl rollout status deployment/tgsrtc-portal

# Verify pods are running
kubectl get pods -l app=tgsrtc-portal

# Get the service URL
minikube service tgsrtc-portal --url
```

## Verify

```bash
# Check pod health
kubectl describe deployment tgsrtc-portal

# Check readiness/liveness probes
kubectl get pods -l app=tgsrtc-portal -o wide

# Hit the health endpoint
curl $(minikube service tgsrtc-portal --url)/health
```

## Cleanup

```bash
kubectl delete -f k8s/service.yaml
kubectl delete -f k8s/deployment.yaml
minikube stop
```
