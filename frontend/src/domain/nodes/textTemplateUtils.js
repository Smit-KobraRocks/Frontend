const TextTemplateConstraints = Object.freeze({
  BASE_WIDTH: 260,
  MAX_WIDTH: 520,
  MIN_ROWS: 3,
  MAX_ROWS: 20,
  CHARACTER_WIDTH: 7,
  HORIZONTAL_PADDING: 120,
  MIN_HEIGHT: 80,
  MAX_HEIGHT: 420,
  LINE_HEIGHT: 22,
});

const VARIABLE_PATTERN = /{{\s*([a-zA-Z_$][0-9a-zA-Z_$]*)\s*}}/g;

const normalizeToString = (value) => {
  if (typeof value === 'string') {
    return value;
  }

  return String(value ?? '');
};

export const calculateTextTemplateLayout = (rawText = '') => {
  const text = normalizeToString(rawText);
  const lines = text.split('\n');
  const normalizedLines = lines.length > 0 ? lines : [''];

  const longestLineLength = normalizedLines.reduce(
    (max, line) => Math.max(max, line.trimEnd().length),
    0
  );

  const widthFromText =
    longestLineLength * TextTemplateConstraints.CHARACTER_WIDTH +
    TextTemplateConstraints.HORIZONTAL_PADDING;
  const width = Math.min(
    TextTemplateConstraints.MAX_WIDTH,
    Math.max(TextTemplateConstraints.BASE_WIDTH, widthFromText)
  );

  const effectiveCharactersPerLine = Math.max(
    20,
    Math.floor(
      (width - TextTemplateConstraints.HORIZONTAL_PADDING) /
        TextTemplateConstraints.CHARACTER_WIDTH
    )
  );

  const approximateRowCount = normalizedLines.reduce((count, line) => {
    const length = line.length || 1;
    return count + Math.max(1, Math.ceil(length / effectiveCharactersPerLine));
  }, 0);

  const rows = Math.min(
    TextTemplateConstraints.MAX_ROWS,
    Math.max(TextTemplateConstraints.MIN_ROWS, approximateRowCount)
  );
  const minHeight = Math.min(
    TextTemplateConstraints.MAX_HEIGHT,
    Math.max(TextTemplateConstraints.MIN_HEIGHT, rows * TextTemplateConstraints.LINE_HEIGHT)
  );

  return { width, rows, minHeight };
};

export const extractTemplateVariables = (rawText = '') => {
  const text = normalizeToString(rawText);
  const variables = [];
  const seen = new Set();

  let match;
  while ((match = VARIABLE_PATTERN.exec(text)) !== null) {
    const variable = match[1];
    if (!seen.has(variable)) {
      seen.add(variable);
      variables.push(variable);
    }
  }

  return variables;
};
