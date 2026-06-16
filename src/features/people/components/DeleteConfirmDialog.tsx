import { ReactElement, useEffect, useRef } from 'react';
import { Button } from '../../../components/ui/Button';
import { Person } from '../types/person';

type DeleteConfirmDialogProps = {
  /** The person pending deletion, or `null` when the dialog should be closed. */
  person: Person | null;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * Uses the native <dialog> element for `showModal`'s built-in focus trap,
 * Escape-to-close, and focus restoration to the triggering element.
 */
export const DeleteConfirmDialog = ({
  person,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteConfirmDialogProps): ReactElement => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (person) {
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [person]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      onClose={onCancel}
      className="
    m-auto
    w-full
    max-w-[40rem]
    rounded-[1.2rem]
    border
    border-[var(--colors-gray-200)]
    p-0
    backdrop:bg-[var(--colors-gray-900)]/40
  "
    >
      {person && (
        <div className="p-[2.4rem]">
          <h2
            id="delete-dialog-title"
            className="text-[1.8rem] font-semibold text-[var(--colors-darkBlue)]"
          >
            Remove team member?
          </h2>

          <p
            id="delete-dialog-description"
            className="mt-[0.8rem] text-[1.4rem] text-[var(--colors-gray-600)]"
          >
            This will permanently remove{' '}
            <strong className="text-[var(--colors-gray-800)]">
              {person.name}
            </strong>{' '}
            from the People list. This action can&apos;t be undone.
          </p>

          <div className="mt-[2.4rem] flex justify-end gap-[1.2rem]">
            <Button
              variant="secondary"
              onClick={onCancel}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={onConfirm} isLoading={isDeleting}>
              Remove
            </Button>
          </div>
        </div>
      )}
    </dialog>
  );
};
