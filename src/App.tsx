import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import SignedIn from './pages/SignedIn';
import SignInFail from './pages/SignInFail';
import FormPage from './pages/FormPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/callback" element={<SignedIn />} />
      <Route path="/fail" element={<SignInFail />} />
      <Route path="/form" element={<FormPage />} />
    </Routes>
  );
}

export default App;
