import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '../../../test/utils/A11y';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('shows "No records" when total is 0', () => {
    render(
      <Pagination
        page={1}
        pageSize={10}
        total={0}
        onPageChange={vi.fn()}
        onPageSizeChange={vi.fn()}
      />
    );

    expect(screen.getByText('No records')).toBeInTheDocument();
  });

  it('shows the correct record range for a middle page', () => {
    render(
      <Pagination
        page={2}
        pageSize={10}
        total={25}
        onPageChange={vi.fn()}
        onPageSizeChange={vi.fn()}
      />
    );

    // 11-20 of 25 records
    expect(screen.getByText(/11-20 of 25 records/)).toBeInTheDocument();
  });

  it('caps the end of the range at total on the last page', () => {
    render(
      <Pagination
        page={3}
        pageSize={10}
        total={25}
        onPageChange={vi.fn()}
        onPageSizeChange={vi.fn()}
      />
    );

    expect(screen.getByText(/21-25 of 25 records/)).toBeInTheDocument();
  });

  it('uses singular "record" when total is exactly 1', () => {
    render(
      <Pagination
        page={1}
        pageSize={10}
        total={1}
        onPageChange={vi.fn()}
        onPageSizeChange={vi.fn()}
      />
    );

    expect(screen.getByText(/1-1 of 1 record$/)).toBeInTheDocument();
  });

  it('disables First/Previous on the first page', () => {
    render(
      <Pagination
        page={1}
        pageSize={10}
        total={50}
        onPageChange={vi.fn()}
        onPageSizeChange={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: 'First page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Last page' })).not.toBeDisabled();
  });

  it('disables Next/Last on the last page', () => {
    render(
      <Pagination
        page={5}
        pageSize={10}
        total={50}
        onPageChange={vi.fn()}
        onPageSizeChange={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Last page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'First page' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'Previous page' })).not.toBeDisabled();
  });

  it('disables all navigation when disabled prop is true, even mid-range', () => {
    render(
      <Pagination
        page={2}
        pageSize={10}
        total={50}
        onPageChange={vi.fn()}
        onPageSizeChange={vi.fn()}
        disabled
      />
    );

    expect(screen.getByRole('button', { name: 'First page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Last page' })).toBeDisabled();
  });

  it('calls onPageChange(1) when First page is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <Pagination
        page={3}
        pageSize={10}
        total={50}
        onPageChange={onPageChange}
        onPageSizeChange={vi.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: 'First page' }));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('calls onPageChange(page - 1) when Previous page is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <Pagination
        page={3}
        pageSize={10}
        total={50}
        onPageChange={onPageChange}
        onPageSizeChange={vi.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Previous page' }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange(page + 1) when Next page is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <Pagination
        page={3}
        pageSize={10}
        total={50}
        onPageChange={onPageChange}
        onPageSizeChange={vi.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('calls onPageChange(totalPages) when Last page is clicked', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <Pagination
        page={1}
        pageSize={10}
        total={50}
        onPageChange={onPageChange}
        onPageSizeChange={vi.fn()}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Last page' }));
    expect(onPageChange).toHaveBeenCalledWith(5);
  });

  it('calls onPageChange with the selected value when the page select changes', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <Pagination
        page={1}
        pageSize={10}
        total={50}
        onPageChange={onPageChange}
        onPageSizeChange={vi.fn()}
      />
    );

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Page' }),
      '3'
    );
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('renders exactly totalPages options in the page select', () => {
    render(
      <Pagination
        page={1}
        pageSize={10}
        total={45}
        onPageChange={vi.fn()}
        onPageSizeChange={vi.fn()}
      />
    );

    const select = screen.getByRole('combobox', { name: 'Page' });
    expect(select.querySelectorAll('option')).toHaveLength(5);
  });

  it('calls onPageSizeChange with the selected value when the page size select changes', async () => {
    const user = userEvent.setup();
    const onPageSizeChange = vi.fn();

    render(
      <Pagination
        page={1}
        pageSize={10}
        total={50}
        onPageChange={vi.fn()}
        onPageSizeChange={onPageSizeChange}
      />
    );

    await user.selectOptions(
      screen.getByRole('combobox', { name: 'Rows per page' }),
      '25'
    );
    expect(onPageSizeChange).toHaveBeenCalledWith(25);
  });

  it('treats total below 0 page edge case: totalPages is always at least 1', () => {
    render(
      <Pagination
        page={1}
        pageSize={10}
        total={0}
        onPageChange={vi.fn()}
        onPageSizeChange={vi.fn()}
      />
    );

    const select = screen.getByRole('combobox', { name: 'Page' });
    expect(select.querySelectorAll('option')).toHaveLength(1);
  });

  it('has no detectable accessibility violations', async () => {
    const { container } = render(
      <Pagination
        page={2}
        pageSize={10}
        total={50}
        onPageChange={vi.fn()}
        onPageSizeChange={vi.fn()}
      />
    );
    await expectNoA11yViolations(container);
  });
});