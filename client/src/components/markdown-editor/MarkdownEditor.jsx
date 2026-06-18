import MarkdownRenderer from './MarkdownRenderer.jsx';
import styles from './markdownEditor.module.css';

const toolbarActions = [
  { id: 'bold', label: 'Bold', before: '**', after: '**', sample: 'bold text' },
  { id: 'italic', label: 'Italic', before: '*', after: '*', sample: 'italic text' },
  { id: 'heading', label: 'Heading', before: '## ', after: '', sample: 'Section heading', line: true },
  { id: 'bullet', label: 'Bullet list', before: '- ', after: '', sample: 'List item', line: true },
  { id: 'numbered', label: 'Numbered list', before: '1. ', after: '', sample: 'List item', line: true },
  { id: 'quote', label: 'Quote', before: '> ', after: '', sample: 'Important quote', line: true },
  { id: 'code', label: 'Code block', before: '```\n', after: '\n```', sample: 'const value = true;' },
  { id: 'link', label: 'Link', before: '[', after: '](https://example.com)', sample: 'link text' },
  { id: 'divider', label: 'Insert divider', before: '\n---\n', after: '', sample: '' },
];

export default function MarkdownEditor({
  value,
  onChange,
  error,
  required,
  describedBy,
  textareaRef,
}) {
  function applyFormatting(action) {
    const textarea = textareaRef.current;
    const start = textarea?.selectionStart ?? value.length;
    const end = textarea?.selectionEnd ?? value.length;
    const selected = value.slice(start, end);
    const fallback = selected || action.sample;
    const prefix = action.line && start > 0 && value[start - 1] !== '\n' ? '\n' : '';
    const nextText = `${prefix}${action.before}${fallback}${action.after}`;
    const nextValue = `${value.slice(0, start)}${nextText}${value.slice(end)}`;

    onChange(nextValue);
    window.requestAnimationFrame(() => {
      textarea?.focus();
      const cursor = start + nextText.length;
      textarea?.setSelectionRange(cursor, cursor);
    });
  }

  return (
    <div className={styles.editor}>
      <div className={styles.toolbar} aria-label="Markdown toolbar">
        {toolbarActions.map((action) => (
          <button
            key={action.id}
            type="button"
            aria-label={action.label}
            title={action.label}
            onClick={() => applyFormatting(action)}
          >
            {getButtonText(action.id)}
          </button>
        ))}
      </div>
      <div className={styles.workspace}>
        <div className={styles.inputPane}>
          <textarea
            ref={textareaRef}
            id="content"
            name="content"
            rows={14}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            required={required}
            aria-required={required}
            placeholder="Write your article with Markdown"
          />
          <span id="content-counter" className={styles.counter}>{value.length} characters</span>
        </div>
        <div className={styles.previewPane} aria-label="Markdown preview">
          <div className={styles.previewHeader}>Live preview</div>
          <MarkdownRenderer value={value} />
        </div>
      </div>
    </div>
  );
}

function getButtonText(id) {
  const labels = {
    bold: 'B',
    italic: 'I',
    heading: 'H',
    bullet: 'List',
    numbered: '1.',
    quote: '"',
    code: '{}',
    link: 'Link',
    divider: '---',
  };

  return labels[id];
}
