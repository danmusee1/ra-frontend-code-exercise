import { ReactElement, HTMLAttributes } from 'react';

interface WrapperProps extends HTMLAttributes<HTMLElement> {}

interface InnerProps extends HTMLAttributes<HTMLDivElement> {}

const Wrapper = (props: WrapperProps): ReactElement => (
  <header className="bg-[var(--colors-blank)] w-full" {...props} />
);

const Inner = (props: InnerProps): ReactElement => (
  <div
    className="mx-auto h-[80px]  py-2 px-4 flex items-center justify-end "
    {...props}
  />
);

export const AppHeader = (): ReactElement => {
  return (
    <Wrapper>
  <Inner>
    <section
      aria-label="Current user"
      className="flex items-center gap-3 p-10 lg:p-20"
    >
      <div
        className="text-right"
        aria-labelledby="admin-name"
        aria-describedby="admin-role"
      >
        <p id="admin-name" className="admin-name m-0">
          Julie Howard
        </p>

        <p
          id="admin-role"
          className="admin-meta m-0 text-start"
        >
          Admin
        </p>
      </div>
    </section>
  </Inner>
</Wrapper>
  );
};