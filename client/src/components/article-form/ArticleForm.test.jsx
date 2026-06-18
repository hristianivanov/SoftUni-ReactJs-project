import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import ArticleForm from './ArticleForm.jsx';

describe('ArticleForm', () => {
  it('submits Markdown content without changing payload shape', async () => {
    const onSubmit = vi.fn().mockResolvedValue();

    render(
      <MemoryRouter>
        <ArticleForm
          mode="create"
          onSubmit={onSubmit}
          cancelTo="/articles"
          isSaving={false}
          author={{ authorName: 'Author', authorAvatar: '/img/author.jpg' }}
        />
      </MemoryRouter>,
    );

    await userEvent.type(screen.getByLabelText(/^title$/i), 'Markdown Article');
    await userEvent.type(screen.getByLabelText(/^summary$/i), 'A summary long enough for article validation.');
    await userEvent.type(
      screen.getByLabelText(/^content$/i),
      '## Heading\n\nThis Markdown content is long enough and has **bold** text.',
    );
    await userEvent.type(screen.getByLabelText(/image url/i), 'https://example.com/image.jpg');
    await userEvent.type(screen.getByLabelText(/category/i), 'React');
    await userEvent.type(screen.getByLabelText(/reading time/i), '6');
    await userEvent.click(screen.getByRole('button', { name: /create article/i }));

    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Markdown Article',
      content: '## Heading\n\nThis Markdown content is long enough and has **bold** text.',
      authorName: 'Author',
    }));
  });
});
