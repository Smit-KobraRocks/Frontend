import { Position } from 'reactflow';

import { BranchEvaluationMode } from '../../enums/branchEvaluationMode';
import { DelayUnit } from '../../enums/delayUnit';
import { HandleType } from '../../enums/handleType';
import { HttpMethod } from '../../enums/httpMethod';
import { NodeType } from '../../enums/nodeTypes';
import { calculateTextTemplateLayout, extractTemplateVariables } from './textTemplateUtils';
import { createNodeComponent, buildInitialDataFromDefinition } from './nodeFactory';

const createSelectOptions = (values) => values.map((value) => ({ label: value, value }));

const delayUnitOptions = createSelectOptions([
  DelayUnit.SECONDS,
  DelayUnit.MINUTES,
  DelayUnit.HOURS,
]);

const httpMethodOptions = createSelectOptions([
  HttpMethod.GET,
  HttpMethod.POST,
  HttpMethod.PUT,
  HttpMethod.PATCH,
  HttpMethod.DELETE,
]);

const branchEvaluationModeOptions = [
  { label: 'Text match', value: BranchEvaluationMode.TEXT_MATCH },
  { label: 'Numeric threshold', value: BranchEvaluationMode.NUMERIC_THRESHOLD },
  { label: 'Custom script', value: BranchEvaluationMode.CUSTOM_SCRIPT },
];

const nodeDefinitions = {
  [NodeType.CUSTOM_INPUT]: {
    type: NodeType.CUSTOM_INPUT,
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
        getInitialValue: ({ id }) => (id ? id.replace(`${NodeType.CUSTOM_INPUT}-`, 'input_') : 'input'),
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
        type: HandleType.SOURCE,
        position: Position.Right,
        id: ({ id }) => `${id}-value`,
        label: 'Value',
      },
    ],
  },
  [NodeType.CUSTOM_OUTPUT]: {
    type: NodeType.CUSTOM_OUTPUT,
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
        getInitialValue: ({ id }) => (id ? id.replace(`${NodeType.CUSTOM_OUTPUT}-`, 'output_') : 'output'),
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
        type: HandleType.TARGET,
        position: Position.Left,
        id: ({ id }) => `${id}-value`,
        label: 'Value',
      },
    ],
  },
  [NodeType.TEXT]: {
    type: NodeType.TEXT,
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
        getRows: ({ values }) => calculateTextTemplateLayout(values?.text ?? '').rows,
        getInputStyle: ({ values }) => ({
          minHeight: calculateTextTemplateLayout(values?.text ?? '').minHeight,
        }),
      },
    ],
    handles: ({ id, values }) => {
      const variables = extractTemplateVariables(values?.text ?? '');
      const variableHandles = variables.map((variable, index) => {
        const verticalPosition = ((index + 1) / (variables.length + 1)) * 100;
        return {
          type: HandleType.TARGET,
          position: Position.Left,
          id: `${id}-variable-${variable}`,
          label: variable,
          style: { top: `${verticalPosition}%` },
        };
      });

      return [
        ...variableHandles,
        {
          type: HandleType.SOURCE,
          position: Position.Right,
          id: `${id}-output`,
          label: 'Text',
        },
      ];
    },
    getDynamicStyle: ({ values }) => ({ width: calculateTextTemplateLayout(values?.text ?? '').width }),
  },
  [NodeType.LLM]: {
    type: NodeType.LLM,
    label: 'LLM',
    title: 'LLM',
    subtitle: 'Call a language model',
    description: 'Combine instructions, prompts, and context to request a completion.',
    accentColor: '#A855F7',
    tag: 'AI',
    toolbarDescription: 'Generate text',
    handles: [
      {
        type: HandleType.TARGET,
        position: Position.Left,
        id: ({ id }) => `${id}-system`,
        label: 'System',
        style: { top: '38%' },
      },
      {
        type: HandleType.TARGET,
        position: Position.Left,
        id: ({ id }) => `${id}-prompt`,
        label: 'Prompt',
        style: { top: '62%' },
      },
      {
        type: HandleType.SOURCE,
        position: Position.Right,
        id: ({ id }) => `${id}-response`,
        label: 'Response',
      },
    ],
    footer: 'Supports streaming responses and tool usage.',
  },
  [NodeType.DELAY]: {
    type: NodeType.DELAY,
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
        defaultValue: DelayUnit.SECONDS,
        options: delayUnitOptions,
      },
    ],
    handles: [
      {
        type: HandleType.TARGET,
        position: Position.Left,
        id: ({ id }) => `${id}-input`,
        label: 'Input',
        style: { top: '50%' },
      },
      {
        type: HandleType.SOURCE,
        position: Position.Right,
        id: ({ id }) => `${id}-output`,
        label: 'Output',
      },
    ],
  },
  [NodeType.BRANCH]: {
    type: NodeType.BRANCH,
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
        defaultValue: BranchEvaluationMode.TEXT_MATCH,
        options: branchEvaluationModeOptions,
      },
    ],
    handles: [
      {
        type: HandleType.TARGET,
        position: Position.Left,
        id: ({ id }) => `${id}-input`,
        label: 'Input',
        style: { top: '50%' },
      },
      {
        type: HandleType.SOURCE,
        position: Position.Right,
        id: ({ id }) => `${id}-true`,
        label: 'True',
        style: { top: '42%' },
      },
      {
        type: HandleType.SOURCE,
        position: Position.Right,
        id: ({ id }) => `${id}-false`,
        label: 'False',
        style: { top: '70%' },
      },
    ],
    footer: 'Route based on string, numeric, or scripted logic.',
  },
  [NodeType.PROMPT_TEMPLATE]: {
    type: NodeType.PROMPT_TEMPLATE,
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
        type: HandleType.TARGET,
        position: Position.Left,
        id: ({ id }) => `${id}-data`,
        label: 'Data',
        style: { top: '42%' },
      },
      {
        type: HandleType.TARGET,
        position: Position.Left,
        id: ({ id }) => `${id}-context`,
        label: 'Context',
        style: { top: '68%' },
      },
      {
        type: HandleType.SOURCE,
        position: Position.Right,
        id: ({ id }) => `${id}-prompt`,
        label: 'Prompt',
      },
    ],
    footer: 'Share templates across flows to keep prompts consistent.',
  },
  [NodeType.HTTP_REQUEST]: {
    type: NodeType.HTTP_REQUEST,
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
        defaultValue: HttpMethod.POST,
        options: httpMethodOptions,
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
        type: HandleType.TARGET,
        position: Position.Left,
        id: ({ id }) => `${id}-payload`,
        label: 'Payload',
        style: { top: '55%' },
      },
      {
        type: HandleType.SOURCE,
        position: Position.Right,
        id: ({ id }) => `${id}-response`,
        label: 'Response',
      },
    ],
  },
  [NodeType.EMBEDDINGS]: {
    type: NodeType.EMBEDDINGS,
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
        type: HandleType.TARGET,
        position: Position.Left,
        id: ({ id }) => `${id}-text`,
        label: 'Text',
        style: { top: '55%' },
      },
      {
        type: HandleType.SOURCE,
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

export const toolbarNodes = Object.values(nodeDefinitions).map(
  ({ type, label, toolbarDescription, accentColor }) => ({
    type,
    label,
    description: toolbarDescription,
    accentColor,
  })
);

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
