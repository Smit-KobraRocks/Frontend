import { useCallback } from 'react';

import {
  DragAndDropDataTypes,
  DragCursor,
  createNodeDragPayload,
} from '../../constants/dragAndDrop';

const DEFAULT_ACCENT_COLOR = '#1C2536';

export const DraggableNode = ({ type, label, description, accentColor = DEFAULT_ACCENT_COLOR }) => {
  const handleDragStart = useCallback(
    (event) => {
      event.dataTransfer.setData(
        DragAndDropDataTypes.REACT_FLOW,
        createNodeDragPayload(type)
      );
      event.dataTransfer.effectAllowed = 'move';
      event.currentTarget.style.cursor = DragCursor.GRABBING;
    },
    [type]
  );

  const handleDragEnd = useCallback((event) => {
    event.currentTarget.style.cursor = DragCursor.GRAB;
  }, []);

  return (
    <div
      className={`draggable-node draggable-node--${type}`}
      style={{ '--accent-color': accentColor }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      draggable
    >
      <span className="draggable-node__label">{label}</span>
      {description ? <span className="draggable-node__description">{description}</span> : null}
    </div>
  );
};
