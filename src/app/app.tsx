import { AddEditPeoplePage } from '@/pages/add-edit-people';
import { PeoplePage } from '@/pages/people/page';
import { ReactElement } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppHeader } from './header';

export const App = (): ReactElement => {
  return (
    <BrowserRouter>
      <AppHeader />
      <Routes>
        <Route index element={<PeoplePage />} />
        <Route path="/people/new" element={<AddEditPeoplePage />} />
        <Route path="/people/edit/:id" element={<AddEditPeoplePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
