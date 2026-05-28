import React from 'react';

/**
 * Parses inline markdown (like **bold**) into React nodes.
 */
function parseInlineMarkdown(text: string): React.ReactNode {
  if (!text) return '';
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

/**
 * Parses block-level and inline markdown into React elements.
 */
export function parseMarkdownToReact(text: string): React.ReactNode[] {
  if (!text) return [];
  const lines = text.split('\n');
  
  let inList = false;
  let listItems: React.ReactNode[] = [];
  const elements: React.ReactNode[] = [];

  const flushList = (key: string | number) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${key}`} style={{ paddingLeft: '20px', margin: '8px 0', listStyleType: 'disc' }}>
          {...listItems}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList(idx);
      elements.push(<div key={`empty-${idx}`} style={{ height: '8px' }} />);
      return;
    }

    // Headers
    if (trimmed.startsWith('### ')) {
      flushList(idx);
      elements.push(
        <h4 key={idx} style={{ fontSize: '15px', fontWeight: 600, marginTop: '16px', marginBottom: '8px', color: 'var(--text-primary)' }}>
          {parseInlineMarkdown(trimmed.substring(4))}
        </h4>
      );
      return;
    }
    if (trimmed.startsWith('## ')) {
      flushList(idx);
      elements.push(
        <h3 key={idx} style={{ fontSize: '18px', fontWeight: 600, marginTop: '20px', marginBottom: '10px', color: 'var(--text-primary)' }}>
          {parseInlineMarkdown(trimmed.substring(3))}
        </h3>
      );
      return;
    }
    if (trimmed.startsWith('# ')) {
      flushList(idx);
      elements.push(
        <h2 key={idx} style={{ fontSize: '22px', fontWeight: 600, marginTop: '24px', marginBottom: '12px', color: 'var(--text-primary)' }}>
          {parseInlineMarkdown(trimmed.substring(2))}
        </h2>
      );
      return;
    }

    // Bullet list items
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      inList = true;
      listItems.push(
        <li key={`li-${idx}`} style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '4px 0' }}>
          {parseInlineMarkdown(trimmed.substring(2))}
        </li>
      );
      return;
    }

    // Numbered list items
    const matchNumbered = trimmed.match(/^(\d+)\.\s(.*)/);
    if (matchNumbered) {
      flushList(idx);
      elements.push(
        <div key={idx} style={{ display: 'flex', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '6px 0' }}>
          <strong style={{ color: 'var(--text-primary)', minWidth: '18px' }}>{matchNumbered[1]}.</strong>
          <span>{parseInlineMarkdown(matchNumbered[2])}</span>
        </div>
      );
      return;
    }

    // Regular paragraph
    flushList(idx);
    elements.push(
      <p key={idx} style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '6px 0' }}>
        {parseInlineMarkdown(trimmed)}
      </p>
    );
  });

  flushList('end');
  return elements;
}
