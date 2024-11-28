import React from 'react';
import './App.css';
import { HashRouter  as Router, Route, Routes } from 'react-router-dom';
import Events from './events';  // Ensure this is the correct path for your Events component
import Users from './users';  // Ensure this is the correct path for your Events component

function App() {
  return (
    <Router>  {/* Wrapping the app in Router */}
      <Routes>  {/* Define routes inside Routes */}
        <Route path="/" element={<Events />} />  {/* Define your Events route */}
        <Route path="/users" element={<Users />} />  {/* Define your Events route */}
      </Routes>
    </Router>
  );
}

export default App;
