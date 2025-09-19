import { useCallback } from 'react';
import { shallow } from 'zustand/shallow';

import { pipelineService } from '../../services/pipelineService';
import { usePipelineStore } from '../../store/pipelineStore';

const selectPipelineSnapshot = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

const buildSubmissionSummary = ({ num_nodes: nodeCount, num_edges: edgeCount, is_dag: isDag }) =>
  `Pipeline summary:\n` +
  `• Nodes: ${nodeCount}\n` +
  `• Edges: ${edgeCount}\n` +
  `• Forms DAG: ${isDag ? 'Yes' : 'No'}`;

export const SubmitButton = () => {
  const { nodes, edges } = usePipelineStore(selectPipelineSnapshot, shallow);

  const handleSubmit = useCallback(async () => {
    try {
      const result = await pipelineService.submitPipeline({ nodes, edges });
      window.alert(buildSubmissionSummary(result));
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
