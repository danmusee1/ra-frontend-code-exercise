import { ReactElement, PropsWithChildren } from 'react';
import { useParams } from '@tanstack/react-router';

const Container = (props: PropsWithChildren<Record<string, unknown>>) => (
  <main
    className="mx-auto w-full max-w-[var(--layout-width)]"
    {...props}
  />
);

export const AddEditPeoplePage = (): ReactElement => {
  const { id } = useParams({ strict: false });

  const isEdit = Boolean(id);
  const title = isEdit ? 'Edit member' : 'Add a member';
  const description = isEdit
    ? 'Update member information below.'
    : 'Fill in the details to add a new member.';

  return (
    <Container>
      <h1 className="text-[2.4rem] font-semibold text-[var(--colors-darkBlue)]">
        {title}
      </h1>

      <p className="mt-[0.8rem] text-[1.4rem] text-[var(--colors-gray-600)]">
        {description}
      </p>
    </Container>
  );
};