import { useEffect, useMemo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

const baseContainerStyle = {
  width: 260,
  background: '#ffffff',
  borderRadius: 14,
  border: '1px solid #E2E8F0',
  boxShadow: '0 12px 24px rgba(15, 23, 42, 0.12)',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  fontFamily: 'Inter, sans-serif',
  color: '#0f172a',
  position: 'relative',
  boxSizing: 'border-box',
};

const titleStyle = {
  fontSize: '16px',
  fontWeight: 600,
  letterSpacing: '0.01em',
};

const subtitleStyle = {
  fontSize: '12px',
  color: '#64748B',
  marginTop: '4px',
};

const descriptionStyle = {
  fontSize: '12px',
  color: '#475569',
  lineHeight: 1.4,
};

const labelStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  fontSize: '12px',
  fontWeight: 500,
  color: '#475569',
};

const helperTextStyle = {
  fontSize: '11px',
  color: '#94A3B8',
};

const inputStyle = {
  padding: '8px 10px',
  borderRadius: 10,
  border: '1px solid #CBD5F5',
  fontSize: '12px',
  color: '#0f172a',
  background: '#F8FAFC',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};

const selectStyle = {
  ...inputStyle,
  appearance: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none',
};

const textareaStyle = {
  ...inputStyle,
  resize: 'vertical',
  minHeight: '60px',
};

const checkboxLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '12px',
  color: '#475569',
};

const tagStyle = {
  fontSize: '11px',
  fontWeight: 600,
  color: '#0f172a',
  background: '#E2E8F0',
  borderRadius: '9999px',
  padding: '4px 8px',
};

const getHandleLabelStyle = (position) => {
  const common = {
    position: 'absolute',
    fontSize: '10px',
    fontWeight: 500,
    color: '#64748B',
    background: 'rgba(255,255,255,0.85)',
    padding: '2px 6px',
    borderRadius: '8px',
    pointerEvents: 'none',
    whiteSpace: 'nowrap',
  };

  switch (position) {
    case Position.Left:
      return { ...common, right: 'calc(100% + 4px)' };
    case Position.Right:
      return { ...common, left: 'calc(100% + 4px)' };
    case Position.Top:
      return { ...common, bottom: 'calc(100% + 4px)' };
    case Position.Bottom:
      return { ...common, top: 'calc(100% + 4px)' };
    default:
      return common;
  }
};

export const resolveFieldInitialValue = (field, context) => {
  const existingValue = context?.data?.[field.name];
  if (existingValue !== undefined) {
    return existingValue;
  }

  if (field.getInitialValue) {
    return field.getInitialValue(context);
  }

  if (field.defaultValue !== undefined) {
    return typeof field.defaultValue === 'function'
      ? field.defaultValue(context)
      : field.defaultValue;
  }

  if (field.type === 'checkbox') {
    return false;
  }

  return '';
};

export const buildInitialDataFromDefinition = (definition, context) => {
  const initial = {};

  if (definition.fields) {
    definition.fields.forEach((field) => {
      const value = resolveFieldInitialValue(field, context);
      if (value !== undefined) {
        initial[field.name] = value;
      }
    });
  }

  if (definition.initialData) {
    Object.assign(initial, definition.initialData(context));
  }

  return initial;
};

const getOptionalLabel = (field) => {
  if (!field.optional) {
    return null;
  }

  return (
    <span style={{ fontSize: '11px', fontWeight: 500, color: '#94A3B8' }}>
      optional
    </span>
  );
};

const mergeStyles = (...styles) => styles.reduce((acc, style) => ({ ...acc, ...(style || {}) }), {});

export const createNodeComponent = (definition) => {
  const accentColor = definition.accentColor || '#6366F1';

  return ({ id, data }) => {
    const updateNodeField = useStore((state) => state.updateNodeField);

    const initialValues = useMemo(() => {
      const context = { id, data };
      const values = {};
      if (definition.fields) {
        definition.fields.forEach((field) => {
          values[field.name] = resolveFieldInitialValue(field, context);
        });
      }
      return values;
    }, [id, data, definition]);

    const [values, setValues] = useState(initialValues);

    useEffect(() => {
      setValues(initialValues);
    }, [initialValues]);

    useEffect(() => {
      const context = { id, data };
      const initialData = buildInitialDataFromDefinition(definition, context);
      Object.entries(initialData).forEach(([fieldName, fieldValue]) => {
        if (data?.[fieldName] === undefined) {
          updateNodeField(id, fieldName, fieldValue);
        }
      });
    }, [id, data, definition, updateNodeField]);

    const setFieldValue = (fieldName, value) => {
      setValues((prev) => ({ ...prev, [fieldName]: value }));
      updateNodeField(id, fieldName, value);
    };

    const handleInputChange = (field) => (event) => {
      const { value } = event.target;
      if (field.type === 'number') {
        const nextValue = value === '' ? '' : Number(value);
        setFieldValue(field.name, nextValue);
      } else {
        setFieldValue(field.name, value);
      }
    };

    const handleSelectChange = (field) => (event) => {
      setFieldValue(field.name, event.target.value);
    };

    const handleCheckboxChange = (field) => (event) => {
      setFieldValue(field.name, event.target.checked);
    };

    const renderField = (field) => {
      if (field.render) {
        return (
          <div key={field.name}>
            {field.render({
              id,
              data,
              values,
              setValue: (value) => setFieldValue(field.name, value),
            })}
          </div>
        );
      }

      const fieldContext = { id, data, values };
      const value = values[field.name];
      const inputStyleOverrides =
        typeof field.getInputStyle === 'function' ? field.getInputStyle(fieldContext) : undefined;
      const inputProps = typeof field.getInputProps === 'function' ? field.getInputProps(fieldContext) : {};
      const { rows: inputPropsRows, ...restInputProps } = inputProps || {};
      const computedRows = typeof field.getRows === 'function' ? field.getRows(fieldContext) : field.rows;
      const finalRows = inputPropsRows ?? computedRows;

      if (field.type === 'checkbox') {
        return (
          <label key={field.name} style={checkboxLabelStyle}>
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={handleCheckboxChange(field)}
              style={{ width: 14, height: 14 }}
            />
            <span>{field.label}</span>
          </label>
        );
      }

      return (
        <label key={field.name} style={labelStyle}>
          <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{field.label}</span>
            {getOptionalLabel(field)}
          </span>
          {field.type === 'textarea' ? (
            <textarea
              value={value}
              onChange={handleInputChange(field)}
              style={mergeStyles(textareaStyle, field.inputStyle, inputStyleOverrides)}
              placeholder={field.placeholder}
              rows={finalRows}
              {...restInputProps}
            />
          ) : field.type === 'select' ? (
            <select
              value={value}
              onChange={handleSelectChange(field)}
              style={mergeStyles(selectStyle, field.inputStyle, inputStyleOverrides)}
              {...restInputProps}
            >
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label ?? option.value}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.inputType || field.type || 'text'}
              value={value}
              onChange={handleInputChange(field)}
              style={mergeStyles(inputStyle, field.inputStyle, inputStyleOverrides)}
              placeholder={field.placeholder}
              min={field.min}
              max={field.max}
              step={field.step}
              {...restInputProps}
            />
          )}
          {field.helperText ? (
            <span style={helperTextStyle}>{field.helperText}</span>
          ) : null}
        </label>
      );
    };

    const nodeContext = { id, data, values };
    const dynamicStyle =
      typeof definition.getDynamicStyle === 'function' ? definition.getDynamicStyle(nodeContext) : {};
    const resolvedHandles =
      typeof definition.handles === 'function' ? definition.handles(nodeContext) : definition.handles;
    const handlesToRender = Array.isArray(resolvedHandles) ? resolvedHandles : [];
    const baseWidth = definition.width || baseContainerStyle.width;
    const containerWidth = dynamicStyle?.width !== undefined ? dynamicStyle.width : baseWidth;

    return (
      <div
        style={mergeStyles(baseContainerStyle, definition.style, dynamicStyle, {
          width: containerWidth,
          borderTop: `4px solid ${accentColor}`,
        })}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={titleStyle}>{definition.title || definition.label}</div>
            {definition.subtitle ? <div style={subtitleStyle}>{definition.subtitle}</div> : null}
          </div>
          {definition.tag ? <span style={mergeStyles(tagStyle, { background: `${accentColor}20`, color: accentColor })}>{definition.tag}</span> : null}
        </div>

        {definition.description ? (
          Array.isArray(definition.description) ? (
            definition.description.map((paragraph, index) => (
              <div key={index} style={descriptionStyle}>
                {paragraph}
              </div>
            ))
          ) : (
            <div style={descriptionStyle}>{definition.description}</div>
          )
        ) : null}

        {definition.fields?.map((field) => renderField(field))}

        {definition.renderCustomContent
          ? definition.renderCustomContent({ id, data, values, setFieldValue })
          : null}

        {definition.footer ? <div style={{ ...descriptionStyle, fontSize: '11px' }}>{definition.footer}</div> : null}

        {handlesToRender.map((handle, index) => {
          const handleId = typeof handle.id === 'function' ? handle.id({ id, data, values }) : handle.id || `${id}-handle-${index}`;
          const position = handle.position || Position.Right;
          return (
            <div key={`${handleId}-${index}`}>
              {handle.label ? (
                <span style={mergeStyles(getHandleLabelStyle(position), handle.labelStyle, handle.style)}>
                  {handle.label}
                </span>
              ) : null}
              <Handle
                type={handle.type}
                position={position}
                id={handleId}
                style={mergeStyles({ background: accentColor }, handle.style)}
                isConnectable={handle.isConnectable}
              />
            </div>
          );
        })}
      </div>
    );
  };
};
