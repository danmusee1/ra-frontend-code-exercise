import { ReactElement, ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';

// https://testing-library.com/docs/react-testing-library/setup#custom-render
export const TestProviders = (props: { children: ReactNode }): ReactElement => {
  const { children } = props;

  return <BrowserRouter>{children}</BrowserRouter>;
};
