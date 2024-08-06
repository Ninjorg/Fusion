// src/components/Root.js (or src/routes/Routes.js)
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from '../App';  // Adjust the path if needed
import Login from './Login';
import Signup from './Signup';

const Root = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<App />} />
      </Routes>
    </Router>
  );
};

export default Root;
