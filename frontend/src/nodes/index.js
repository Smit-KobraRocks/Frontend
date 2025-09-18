import { Position } from 'reactflow';
import { createNodeComponent, buildInitialDataFromDefinition } from './nodeFactory';

const nodeDefinitions = {
  customInput: {
    type: 'customInput',
    label: 'Input',
    title: 'Input',
    subtitle: 'Start of the flow',
    description: 'Collect structured values that downstream nodes can reference.',
    accentColor: '#6366F1',
    tag: 'Entry',
    toolbarDescription: 'Collect values',
    fields: [
      {
        name: 'inputName',
        label: 'Name',
        type: 'text',
        placeholder: 'input_name',
        getInitialValue: ({ id }) => (id ? id.replace('customInput-', 'input_') : 'input'),
        helperText: 'Used to reference this value in later nodes.',
      },
      {
        name: 'inputType',
        label: 'Type',
        type: 'select',
        defaultValue: 'Text',
        options: [
          { label: 'Text', value: 'Text' },
          { label: 'File', value: 'File' },
        ],
      },
    ],
    handles: [
      {
        type: 'source',
        position: Position.Right,
        id: ({ id }) => `${id}-value`,
        label: 'Value',
      },
    ],
  },
  customOutput: {
    type: 'customOutput',
    label: 'Output',
    title: 'Output',
    subtitle: 'End of the flow',
    description: 'Present results to a user or another system.',
    accentColor: '#0EA5E9',
    tag: 'Result',
    toolbarDescription: 'Display results',
    fields: [
      {
        name: 'outputName',
        label: 'Name',
        type: 'text',
        placeholder: 'output_name',
        getInitialValue: ({ id }) => (id ? id.replace('customOutput-', 'output_') : 'output'),
      },
      {
        name: 'outputType',
        label: 'Type',
        type: 'select',
        defaultValue: 'Text',
        options: [
          { label: 'Text', value: 'Text' },
          { label: 'Image', value: 'Image' },
        ],
      },
    ],
    handles: [
      {
        type: 'target',
        position: Position.Left,
        id: ({ id }) => `${id}-value`,
        label: 'Value',
      },
    ],
  },
  text: {
    type: 'text',
    label: 'Text Template',
    title: 'Text Template',
    subtitle: 'Format dynamic strings',
    description: 'Compose rich text using liquid-style variables.',
    accentColor: '#F97316',
    tag: 'Transform',
    toolbarDescription: 'Format text',
    fields: [
      {
        name: 'text',
        label: 'Template',
        type: 'textarea',
        rows: 3,
        placeholder: 'Hello {{name}}',
        defaultValue: '{{input}}',
      },
    ],
    handles: [
      {
        type: 'source',
        position: Position.Right,
        id: ({ id }) => `${id}-output`,
        label: 'Text',
      },
    ],
  },
  llm: {
    type: 'llm',
    label: 'LLM',
    title: 'LLM',
    subtitle: 'Call a language model',
    description: 'Combine instructions, prompts, and context to request a completion.',
    accentColor: '#A855F7',
    tag: 'AI',
    toolbarDescription: 'Generate text',
    handles: [
      {
        type: 'target',
        position: Position.Left,
        id: ({ id }) => `${id}-system`,
        label: 'System',
        style: { top: '38%' },
      },
      {
        type: 'target',
        position: Position.Left,
        id: ({ id }) => `${id}-prompt`,
        label: 'Prompt',
        style: { top: '62%' },
      },
      {
        type: 'source',
        position: Position.Right,
        id: ({ id }) => `${id}-response`,
        label: 'Response',
      },
    ],
    footer: 'Supports streaming responses and tool usage.',
  },
  delay: {
    type: 'delay',
    label: 'Delay',
    title: 'Delay',
    subtitle: 'Pause execution',
    description: 'Pause the flow before continuing to the next step.',
    accentColor: '#0EA5E9',
    tag: 'Control',
    toolbarDescription: 'Wait between steps',
    fields: [
      {
        name: 'delayName',
        label: 'Label',
        type: 'text',
        placeholder: 'e.g. wait_for_review',
        defaultValue: 'delay',
      },
      {
        name: 'duration',
        label: 'Duration',
        type: 'number',
        min: 0,
        step: 1,
        defaultValue: 5,
        helperText: 'Specify how long to wait before resuming.',
      },
      {
        name: 'durationUnit',
        label: 'Unit',
        type: 'select',
        defaultValue: 'seconds',
        options: [
          { label: 'Seconds', value: 'seconds' },
          { label: 'Minutes', value: 'minutes' },
          { label: 'Hours', value: 'hours' },
        ],
      },
    ],
    handles: [
      {
        type: 'target',
        position: Position.Left,
        id: ({ id }) => `${id}-input`,
        label: 'Input',
        style: { top: '50%' },
      },
      {
        type: 'source',
        position: Position.Right,
        id: ({ id }) => `${id}-output`,
        label: 'Output',
      },
    ],
  },
  branch: {
    type: 'branch',
    label: 'Branch',
    title: 'Branch',
    subtitle: 'Conditional routing',
    description: 'Evaluate conditions to route messages to different paths.',
    accentColor: '#F97316',
    tag: 'Logic',
    toolbarDescription: 'Split by rules',
    fields: [
      {
        name: 'condition',
        label: 'Condition',
        type: 'text',
        placeholder: 'e.g. {{score}} > 0.5',
        defaultValue: '{{input}} contains "approved"',
      },
      {
        name: 'evaluationMode',
        label: 'Mode',
        type: 'select',
        defaultValue: 'text-match',
        options: [
          { label: 'Text match', value: 'text-match' },
          { label: 'Numeric threshold', value: 'numeric-threshold' },
          { label: 'Custom script', value: 'custom-script' },
        ],
      },
    ],
    handles: [
      {
        type: 'target',
        position: Position.Left,
        id: ({ id }) => `${id}-input`,
        label: 'Input',
        style: { top: '50%' },
      },
      {
        type: 'source',
        position: Position.Right,
        id: ({ id }) => `${id}-true`,
        label: 'True',
        style: { top: '42%' },
      },
      {
        type: 'source',
        position: Position.Right,
        id: ({ id }) => `${id}-false`,
        label: 'False',
        style: { top: '70%' },
      },
    ],
    footer: 'Route based on string, numeric, or scripted logic.',
  },
  promptTemplate: {
    type: 'promptTemplate',
    label: 'Prompt Template',
    title: 'Prompt Template',
    subtitle: 'Reusable prompt builder',
    description: 'Assemble prompts with variables and optional context.',
    accentColor: '#A855F7',
    tag: 'Prompt',
    toolbarDescription: 'Build prompts',
    fields: [
      {
        name: 'templateName',
        label: 'Template name',
        type: 'text',
        placeholder: 'e.g. onboarding_prompt',
        defaultValue: 'prompt',
      },
      {
        name: 'templateBody',
        label: 'Template body',
        type: 'textarea',
        rows: 4,
        defaultValue: 'You are an assistant. Use {{input}} to craft your response.',
      },
    ],
    handles: [
      {
        type: 'target',
        position: Position.Left,
        id: ({ id }) => `${id}-data`,
        label: 'Data',
        style: { top: '42%' },
      },
      {
        type: 'target',
        position: Position.Left,
        id: ({ id }) => `${id}-context`,
        label: 'Context',
        style: { top: '68%' },
      },
      {
        type: 'source',
        position: Position.Right,
        id: ({ id }) => `${id}-prompt`,
        label: 'Prompt',
      },
    ],
    footer: 'Share templates across flows to keep prompts consistent.',
  },
  httpRequest: {
    type: 'httpRequest',
    label: 'HTTP Request',
    title: 'HTTP Request',
    subtitle: 'Call external APIs',
    description: 'Send a request to any HTTP endpoint with full control over method and headers.',
    accentColor: '#14B8A6',
    tag: 'Integration',
    toolbarDescription: 'Call APIs',
    fields: [
      {
        name: 'httpMethod',
        label: 'Method',
        type: 'select',
        defaultValue: 'POST',
        options: [
          { label: 'GET', value: 'GET' },
          { label: 'POST', value: 'POST' },
          { label: 'PUT', value: 'PUT' },
          { label: 'PATCH', value: 'PATCH' },
          { label: 'DELETE', value: 'DELETE' },
        ],
      },
      {
        name: 'httpUrl',
        label: 'URL',
        type: 'text',
        placeholder: 'https://api.example.com/v1/resource',
        defaultValue: '',
      },
      {
        name: 'httpHeaders',
        label: 'Headers (JSON)',
        type: 'textarea',
        rows: 3,
        placeholder: '{"Authorization": "Bearer ..."}',
        defaultValue: '',
        optional: true,
      },
    ],
    handles: [
      {
        type: 'target',
        position: Position.Left,
        id: ({ id }) => `${id}-payload`,
        label: 'Payload',
        style: { top: '55%' },
      },
      {
        type: 'source',
        position: Position.Right,
        id: ({ id }) => `${id}-response`,
        label: 'Response',
      },
    ],
  },
  embeddings: {
    type: 'embeddings',
    label: 'Embeddings',
    title: 'Embeddings',
    subtitle: 'Vectorize text',
    description: 'Generate embeddings for semantic search, clustering, or retrieval.',
    accentColor: '#3B82F6',
    tag: 'ML',
    toolbarDescription: 'Create vectors',
    fields: [
      {
        name: 'embeddingModel',
        label: 'Model',
        type: 'select',
        defaultValue: 'text-embedding-3-small',
        options: [
          { label: 'text-embedding-3-small', value: 'text-embedding-3-small' },
          { label: 'text-embedding-3-large', value: 'text-embedding-3-large' },
          { label: 'text-embedding-ada-002', value: 'text-embedding-ada-002' },
        ],
      },
      {
        name: 'embeddingDimensions',
        label: 'Dimensions',
        type: 'number',
        min: 64,
        step: 64,
        defaultValue: 1536,
      },
      {
        name: 'normalizeEmbeddings',
        label: 'Normalize output vector',
        type: 'checkbox',
        defaultValue: true,
      },
    ],
    handles: [
      {
        type: 'target',
        position: Position.Left,
        id: ({ id }) => `${id}-text`,
        label: 'Text',
        style: { top: '55%' },
      },
      {
        type: 'source',
        position: Position.Right,
        id: ({ id }) => `${id}-vector`,
        label: 'Vector',
      },
    ],
  },
};

export const NODE_DEFINITIONS = nodeDefinitions;

export const nodeTypes = Object.fromEntries(
  Object.entries(nodeDefinitions).map(([type, definition]) => [type, createNodeComponent(definition)])
);

export const toolbarNodes = Object.values(nodeDefinitions).map(({ type, label, toolbarDescription, accentColor }) => ({
  type,
  label,
  description: toolbarDescription,
  accentColor,
}));

export const getInitialNodeData = (type, nodeId, data = {}) => {
  const definition = nodeDefinitions[type];
  if (!definition) {
    return { id: nodeId, nodeType: type };
  }

  return {
    id: nodeId,
    nodeType: type,
    ...buildInitialDataFromDefinition(definition, { id: nodeId, data }),
  };
};
