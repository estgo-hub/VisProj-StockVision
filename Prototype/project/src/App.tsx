import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { StockProvider } from './contexts/StockContext';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import StockDetail from './pages/StockDetail';
import StockExplorer from './pages/StockExplorer';
import ETFAnalysis from './pages/ETFAnalysis';
import Geography from './pages/Geography';
import SectorHeatmap from './pages/SectorHeatmap';

function App() {
  return (
    <ThemeProvider>
      <StockProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <Navigation />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/stock" element={<StockDetail />} />
              <Route path="/stock/:id" element={<StockDetail />} />
              <Route path="/explorer" element={<StockExplorer />} />
              <Route path="/etf" element={<ETFAnalysis />} />
              <Route path="/geography" element={<Geography />} />
              <Route path="/heatmap" element={<SectorHeatmap />} />
            </Routes>
          </div>
        </Router>
      </StockProvider>
    </ThemeProvider>
  );
}

export default App;