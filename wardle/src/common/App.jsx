import { useState } from 'react';
import reactLogo from './../assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import AuthProvider from './auth/AuthProvider'; // Importa AuthProvider
import Navbar from "./NavBar";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Importa los componentes necesarios

import MainPage from './pages/MainPage';
import RulesPage from './pages/RulesPage';
import AboutPage from './pages/AboutPage';
import GamePage from './pages/GamePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      
      <Router>  
        <Navbar />  
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/game" element={<GamePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Router>
      
      <h1>Wardle!</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
