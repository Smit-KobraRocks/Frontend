// submit.js

import { useCallback } from 'react';
import { shallow } from 'zustand/shallow';

import { useStore } from './store';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);

  const handleSubmit = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/pipelines/parse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nodes, edges }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const result = await response.json();

      window.alert(
        `Pipeline summary:\n` +
          `• Nodes: ${result.num_nodes}\n` +
          `• Edges: ${result.num_edges}\n` +
          `• Forms DAG: ${result.is_dag ? 'Yes' : 'No'}`
      );
    } catch (error) {
      console.error('Failed to submit pipeline:', error);
      window.alert('Unable to submit pipeline. Please try again.');
    }
  }, [nodes, edges]);

  return (
    <div className="submit">
      <button type="button" className="submit__button" onClick={handleSubmit}>
        <span>Launch pipeline</span>
        <svg className="submit__icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M3.25 8h7.69L7.22 4.28a.75.75 0 011.06-1.06l4.75 4.75a.75.75 0 010 1.06l-4.75 4.75a.75.75 0 11-1.06-1.06L10.94 9.5H3.25a.75.75 0 010-1.5z"
            fill="currentColor"
          />
        </svg>
      </button>
      <p className="submit__hint">Your configuration is saved automatically while you design.</p>
    </div>
  );
};
