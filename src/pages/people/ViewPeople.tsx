import { ReactElement, PropsWithChildren } from 'react';

const Container = (props: PropsWithChildren<Record<string, unknown>>) => (
  <main className="mx-auto w-full max-w-[var(--layout-width)]" {...props} />
);

export const ViewPeoplePage = (): ReactElement => {
  return (
    <Container>
      <h1>View a member.</h1>
      <p>
       View Member page coming soon
      </p>
    </Container>
  );
};
