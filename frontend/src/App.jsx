import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Evaluate from './pages/Evaluate';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-1 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/evaluate" element={<Evaluate />} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-slate-200 py-6 text-center text-sm text-slate-500">
          <div className="container">
            © {new Date().getFullYear()} Smart Resume Evaluator. All rights reserved.
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
