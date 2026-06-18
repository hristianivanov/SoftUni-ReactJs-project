import styles from './markdownRenderer.module.css';

export default function MarkdownRenderer({ value, placeholder = 'Preview will appear as you write.' }) {
  const blocks = parseBlocks(value);

  if (blocks.length === 0) {
    return <p className={styles.placeholder}>{placeholder}</p>;
  }

  return (
    <div className={styles.renderer}>
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
}

function renderBlock(block, index) {
  const key = `${block.type}-${index}`;

  if (block.type === 'heading') {
    const Heading = `h${block.level}`;
    return <Heading key={key}>{parseInline(block.text)}</Heading>;
  }

  if (block.type === 'quote') {
    return <blockquote key={key}>{block.lines.map((line) => <p key={line}>{parseInline(line)}</p>)}</blockquote>;
  }

  if (block.type === 'code') {
    return <pre key={key}><code>{block.text}</code></pre>;
  }

  if (block.type === 'list') {
    const List = block.ordered ? 'ol' : 'ul';
    return <List key={key}>{block.items.map((item, itemIndex) => <li key={`${key}-${itemIndex}`}>{parseInline(item)}</li>)}</List>;
  }

  return <p key={key}>{parseInline(block.text)}</p>;
}

function parseBlocks(value) {
  const lines = String(value || '').replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      index += 1;
      continue;
    }

    if (line.trim().startsWith('```')) {
      const codeLines = [];
      index += 1;

      while (index < lines.length && !lines[index].trim().startsWith('```')) {
        codeLines.push(lines[index]);
        index += 1;
      }

      blocks.push({ type: 'code', text: codeLines.join('\n') });
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      blocks.push({ type: 'heading', level: heading[1].length + 1, text: heading[2].trim() });
      index += 1;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const linesInQuote = [];
      while (index < lines.length && /^>\s?/.test(lines[index])) {
        linesInQuote.push(lines[index].replace(/^>\s?/, '').trim());
        index += 1;
      }
      blocks.push({ type: 'quote', lines: linesInQuote });
      continue;
    }

    const unordered = line.match(/^[-*]\s+(.+)$/);
    const ordered = line.match(/^\d+\.\s+(.+)$/);
    if (unordered || ordered) {
      const listItems = [];
      const orderedList = Boolean(ordered);
      const pattern = orderedList ? /^\d+\.\s+(.+)$/ : /^[-*]\s+(.+)$/;

      while (index < lines.length) {
        const item = lines[index].match(pattern);
        if (!item) {
          break;
        }
        listItems.push(item[1].trim());
        index += 1;
      }

      blocks.push({ type: 'list', ordered: orderedList, items: listItems });
      continue;
    }

    const paragraph = [line.trim()];
    index += 1;
    while (index < lines.length && lines[index].trim() && !isSpecialBlock(lines[index])) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push({ type: 'paragraph', text: paragraph.join(' ') });
  }

  return blocks;
}

function isSpecialBlock(line) {
  return /^(#{1,3})\s+/.test(line)
    || line.trim().startsWith('```')
    || /^>\s?/.test(line)
    || /^[-*]\s+/.test(line)
    || /^\d+\.\s+/.test(line);
}

function parseInline(text) {
  const parts = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    const key = `${token}-${match.index}`;

    if (token.startsWith('**')) {
      parts.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('*')) {
      parts.push(<em key={key}>{token.slice(1, -1)}</em>);
    } else if (token.startsWith('`')) {
      parts.push(<code key={key}>{token.slice(1, -1)}</code>);
    } else {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link && isSafeLink(link[2])) {
        parts.push(<a key={key} href={link[2]} target="_blank" rel="noreferrer">{link[1]}</a>);
      } else {
        parts.push(token);
      }
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length ? parts : text;
}

function isSafeLink(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
