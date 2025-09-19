import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges, MarkerType } from 'reactflow';

import { ReactFlowConstants } from '../constants/reactFlow';

const DEFAULT_MARKER_SIZE = 20;

const buildConnectionWithDefaults = (connection) => ({
  ...connection,
  type: ReactFlowConstants.DEFAULT_CONNECTION_LINE_TYPE,
  animated: true,
  markerEnd: {
    type: MarkerType.Arrow,
    height: DEFAULT_MARKER_SIZE,
    width: DEFAULT_MARKER_SIZE,
  },
});

export const usePipelineStore = create((set, get) => ({
  nodes: [],
  edges: [],
  nodeIds: {},
  getNodeID: (type) => {
    const currentCount = get().nodeIds[type] ?? 0;
    const nextCount = currentCount + 1;

    set((state) => ({
      nodeIds: {
        ...state.nodeIds,
        [type]: nextCount,
      },
    }));

    return `${type}-${nextCount}`;
  },
  addNode: (node) => {
    set((state) => ({
      nodes: [...state.nodes, node],
    }));
  },
  onNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes),
    }));
  },
  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    }));
  },
  onConnect: (connection) => {
    set((state) => ({
      edges: addEdge(buildConnectionWithDefaults(connection), state.edges),
    }));
  },
  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                [fieldName]: fieldValue,
              },
            }
          : node
      ),
    }));
  },
}));
