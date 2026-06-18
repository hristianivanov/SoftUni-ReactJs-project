import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRef, useState } from 'react';
import { describe, expect, it } from 'vitest';
import MarkdownEditor from './MarkdownEditor.jsx';
import MarkdownRenderer from './MarkdownRenderer.jsx';

describe('MarkdownEditor', () => {
  it('formats selected textarea text from the toolbar', async () => {
    render(<ControlledEditor initialValue="format me" />);

    const textarea = screen.getByRole('textbox');
    textarea.focus();
    textarea.setSelectionRange(0, 6);

    await userEvent.click(screen.getByRole('button', { name: /bold/i }));

    expect(textarea).toHaveValue('**format** me');
    await waitFor(() => expect(textarea).toHaveFocus());
  });

  it('renders safe markdown preview features', () => {
    render(
      <MarkdownRenderer
        value={[
          '## Heading',
          '',
          '- Item',
          '',
          '> Quote',
          '',
          '`code` and **bold** and *italic*',
          '',
          '[Safe](https://example.com) [Unsafe](javascript:alert(1))',
          '',
          '```',
          '<script>alert(1)</script>',
          '```',
        ].join('\n')}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Heading' })).toBeInTheDocument();
    expect(screen.getByText('Item')).toBeInTheDocument();
    expect(screen.getByText('Quote')).toBeInTheDocument();
    expect(screen.getByText('code')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Safe' })).toHaveAttribute('href', 'https://example.com');
    expect(screen.queryByRole('link', { name: 'Unsafe' })).not.toBeInTheDocument();
    expect(screen.getByText('<script>alert(1)</script>')).toBeInTheDocument();
  });
});

function ControlledEditor({ initialValue }) {
  const [value, setValue] = useState(initialValue);
  const textareaRef = useRef(null);

  return (
    <MarkdownEditor
      value={value}
      onChange={setValue}
      textareaRef={textareaRef}
      describedBy="content-counter"
      required
    />
  );
}
