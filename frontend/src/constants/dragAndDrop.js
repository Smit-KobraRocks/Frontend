export const DragAndDropDataTypes = Object.freeze({
  REACT_FLOW: 'application/reactflow',
});

export const DragCursor = Object.freeze({
  GRAB: 'grab',
  GRABBING: 'grabbing',
});

export const createNodeDragPayload = (nodeType) =>
  JSON.stringify({
    nodeType,
  });
