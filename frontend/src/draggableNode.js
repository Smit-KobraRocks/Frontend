// draggableNode.js

export const DraggableNode = ({ type, label, description, accentColor = '#1C2536' }) => {
    const onDragStart = (event, nodeType) => {
      const appData = { nodeType };
      event.target.style.cursor = 'grabbing';
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };
  
    return (
      <div
        className={`draggable-node draggable-node--${type}`}
        style={{ '--accent-color': accentColor }}
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={(event) => (event.target.style.cursor = 'grab')}
        draggable
      >
          <span className="draggable-node__label">{label}</span>
          {description ? (
            <span className="draggable-node__description">
              {description}
            </span>
          ) : null}
      </div>
    );
  };
  
