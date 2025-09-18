from collections import deque
from typing import Any, Dict, List, Set

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel


class PipelinePayload(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"Ping": "Pong"}


def _is_dag(nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]]) -> bool:
    node_ids: Set[Any] = {node.get("id") for node in nodes if node.get("id") is not None}

    for edge in edges:
        source = edge.get("source")
        target = edge.get("target")
        if source is not None:
            node_ids.add(source)
        if target is not None:
            node_ids.add(target)

    if not node_ids:
        return True

    adjacency: Dict[Any, List[Any]] = {node_id: [] for node_id in node_ids}
    indegree: Dict[Any, int] = {node_id: 0 for node_id in node_ids}

    for edge in edges:
        source = edge.get("source")
        target = edge.get("target")

        if source is None or target is None:
            continue

        adjacency.setdefault(source, [])
        adjacency.setdefault(target, [])
        indegree.setdefault(source, 0)
        indegree[target] = indegree.get(target, 0) + 1
        adjacency[source].append(target)

    zero_indegree = deque([node_id for node_id, degree in indegree.items() if degree == 0])
    visited = 0

    while zero_indegree:
        node_id = zero_indegree.popleft()
        visited += 1
        for neighbor in adjacency.get(node_id, []):
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                zero_indegree.append(neighbor)

    return visited == len(indegree)


@app.post("/pipelines/parse")
def parse_pipeline(payload: PipelinePayload):
    nodes = payload.nodes
    edges = payload.edges
    return {
        "num_nodes": len(nodes),
        "num_edges": len(edges),
        "is_dag": _is_dag(nodes, edges),
    }
