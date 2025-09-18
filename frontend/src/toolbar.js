// toolbar.js

import { DraggableNode } from './draggableNode';
import { toolbarNodes } from './nodes';

export const PipelineToolbar = () => {

    return (
        <div style={{ padding: '10px' }}>
            <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {toolbarNodes.map(({ type, label, description, accentColor }) => (
                    <DraggableNode
                        key={type}
                        type={type}
                        label={label}
                        description={description}
                        accentColor={accentColor}
                    />
                ))}
            </div>
        </div>
    );
};
