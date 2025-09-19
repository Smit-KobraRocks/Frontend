import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { shallow } from 'zustand/shallow';

import { DragAndDropDataTypes } from '../../constants/dragAndDrop';
import { ReactFlowConstants } from '../../constants/reactFlow';
import { nodeTypes, getInitialNodeData } from '../../domain/nodes';
import { usePipelineStore } from '../../store/pipelineStore';

import 'reactflow/dist/style.css';

const selectPipelineState = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineCanvas = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const {
    nodes,
    edges,
    getNodeID,
    addNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = usePipelineStore(selectPipelineState, shallow);

  // Recreate the node on drop using the metadata captured during drag start.
  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const dragData = event.dataTransfer.getData(DragAndDropDataTypes.REACT_FLOW);

      if (!dragData) {
        return;
      }

      let parsedData;
      try {
        parsedData = JSON.parse(dragData);
      } catch (error) {
        console.warn('Invalid drag data provided to PipelineCanvas.', error);
        return;
      }

      const { nodeType } = parsedData;
      if (!nodeType) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const nodeID = getNodeID(nodeType);
      const newNode = {
        id: nodeID,
        type: nodeType,
        position,
        data: getInitialNodeData(nodeType, nodeID),
      };

      addNode(newNode);
    },
    [addNode, getNodeID, reactFlowInstance]
  );

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div ref={reactFlowWrapper} className="pipeline-ui">
      <ReactFlow
        className="pipeline-ui__reactflow"
        style={{ width: '100%', height: '100%' }}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        proOptions={ReactFlowConstants.PRO_OPTIONS}
        snapGrid={[ReactFlowConstants.GRID_SIZE, ReactFlowConstants.GRID_SIZE]}
        connectionLineType={ReactFlowConstants.DEFAULT_CONNECTION_LINE_TYPE}
        fitView
      >
        <Background color={ReactFlowConstants.BACKGROUND_COLOR} gap={ReactFlowConstants.GRID_SIZE} />
        <Controls position="top-right" />
        <MiniMap pannable zoomable maskColor={ReactFlowConstants.MINIMAP_MASK_COLOR} />
      </ReactFlow>
    </div>
  );
};
