// draggableNode.js

export const DraggableNode = ({ type, label, description, accentColor = '#1C2536' }) => {
    const onDragStart = (event, nodeType) => {
      const appData = { nodeType }
      event.target.style.cursor = 'grabbing';
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };

    return (
      <div
        className={type}
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={(event) => (event.target.style.cursor = 'grab')}
        style={{
          cursor: 'grab',
          minWidth: '120px',
          minHeight: '64px',
          display: 'flex',
          alignItems: 'center',
          borderRadius: '8px',
          background: '#111827',
          border: `1px solid ${accentColor}`,
          boxShadow: '0 8px 16px rgba(15, 23, 42, 0.4)',
          justifyContent: 'center',
          flexDirection: 'column',
          padding: '8px 12px',
        }}
        draggable
      >
          <span style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem', textAlign: 'center' }}>{label}</span>
          {description ? (
            <span style={{ color: '#CBD5F5', fontSize: '0.72rem', marginTop: '4px', textAlign: 'center' }}>
              {description}
            </span>
          ) : null}
      </div>
    );
  };
  