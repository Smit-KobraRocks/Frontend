import { ConnectionLineType } from '../enums/connectionLineType';

export const ReactFlowConstants = Object.freeze({
  GRID_SIZE: 20,
  PRO_OPTIONS: Object.freeze({ hideAttribution: true }),
  BACKGROUND_COLOR: 'rgba(148, 163, 184, 0.35)',
  MINIMAP_MASK_COLOR: 'rgba(15, 23, 42, 0.75)',
  DEFAULT_CONNECTION_LINE_TYPE: ConnectionLineType.SMOOTH_STEP,
});
