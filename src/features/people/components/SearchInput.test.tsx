import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../test/utils/A11y';
import { SearchInput } from './SearchInput';

describe('SearchInput', () => {
  it('renders with the provided value and default placeholder', () => {
    render(<SearchInput value="ada" onChange={vi.fn()} />);

    const input = screen.getByRole('searchbox', { name: 'Search people' });
    expect(input).toHaveValue('ada');
  });

  it('supports a custom placeholder, used as both placeholder and accessible name', () => {
    render(
      <SearchInput value="" onChange={vi.fn()} placeholder="Find a teammate" />
    );

    const input = screen.getByRole('searchbox', { name: 'Find a teammate' });
    expect(input).toHaveAttribute('placeholder', 'Find a teammate');
  });

  it('calls onChange with the new value as the user types', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<SearchInput value="" onChange={onChange} />);

    const input = screen.getByRole('searchbox');
    await user.type(input, 'ada');

    // onChange is called once per keystroke since the component is controlled
    // from outside; verify the final call reflects the last character typed.
    expect(onChange).toHaveBeenCalledTimes(3);
    expect(onChange).toHaveBeenLastCalledWith('a');
  });

  it('clear button is hidden when not focused and value is empty', () => {
    render(<SearchInput value="" onChange={vi.fn()} />);

    const clearButton = screen.getByRole('button', { name: 'Clear search' });
    expect(clearButton.className).toContain('opacity-0');
    expect(clearButton.className).toContain('pointer-events-none');
  });

  it('clear button becomes visible when there is a value', () => {
    render(<SearchInput value="ada" onChange={vi.fn()} />);

    const clearButton = screen.getByRole('button', { name: 'Clear search' });
    expect(clearButton.className).toContain('opacity-100');
  });

  it('clear button becomes visible on focus even with an empty value', async () => {
    const user = userEvent.setup();
    render(<SearchInput value="" onChange={vi.fn()} />);

    await user.click(screen.getByRole('searchbox'));

    const clearButton = screen.getByRole('button', { name: 'Clear search' });
    expect(clearButton.className).toContain('opacity-100');
  });

  it('calls onChange with an empty string when the clear button is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<SearchInput value="ada" onChange={onChange} />);

    await user.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('has no detectable accessibility violations', async () => {
    const { container } = render(<SearchInput value="" onChange={vi.fn()} />);
    await expectNoA11yViolations(container);
  });
});
