import { useMemo, useState, useCallback } from 'react';

import { toolbarNodes } from '../../domain/nodes';
import { DraggableNode } from './DraggableNode';

const normalize = (value = '') => value.trim().toLowerCase();

// Evaluate the search query against key metadata fields.
const filterToolbarNodes = (nodes, query) => {
  if (!query) {
    return nodes;
  }

  return nodes.filter(({ label, description, type }) => {
    const normalizedLabel = normalize(label);
    const normalizedDescription = normalize(description);
    const normalizedType = normalize(type);

    return (
      normalizedLabel.includes(query) ||
      normalizedDescription.includes(query) ||
      normalizedType.includes(query)
    );
  });
};

export const PipelineToolbar = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const normalizedQuery = useMemo(() => normalize(searchTerm), [searchTerm]);

  const filteredToolbarNodes = useMemo(
    () => filterToolbarNodes(toolbarNodes, normalizedQuery),
    [normalizedQuery]
  );

  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  return (
    <div className="toolbar">
      <div className="toolbar__utilities">
        <div className="toolbar__search">
          <svg className="toolbar__search-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M14.742 13.328a6.25 6.25 0 10-1.414 1.414l3.462 3.462a1 1 0 001.414-1.414l-3.462-3.462zM13 8.75a4.25 4.25 0 11-8.5 0 4.25 4.25 0 018.5 0z"
              fill="currentColor"
            />
          </svg>
          <input
            type="search"
            placeholder="Search nodes"
            aria-label="Search nodes"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <span className="toolbar__hint">Drag any block to the canvas to begin building.</span>
      </div>
      <div className="toolbar__grid">
        {filteredToolbarNodes.length === 0 ? (
          <div className="toolbar__empty-state" role="status">
            No nodes match your search.
          </div>
        ) : (
          filteredToolbarNodes.map(({ type, label, description, accentColor }) => (
            <DraggableNode
              key={type}
              type={type}
              label={label}
              description={description}
              accentColor={accentColor}
            />
          ))
        )}
      </div>
    </div>
  );
};
