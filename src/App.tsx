import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { StockProvider } from './contexts/StockContext';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import StockAnalysisPage from './pages/StockAnalysisPage';
import MarketOverview from './pages/MarketOverview';
import ETFAnalysis from './pages/ETFAnalysis';
import Portfolio from './pages/Portfolio';

function App() {
  return (
    <ThemeProvider>
      <StockProvider>
        <Router basename="/VisProj-StockVision">
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <Navigation />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/market-overview" element={<MarketOverview />} />
              <Route path="/stock" element={<StockAnalysisPage />} />
              <Route path="/stock/:id" element={<StockAnalysisPage />} />
              <Route path="/explorer" element={<StockAnalysisPage />} />
              <Route path="/etf" element={<ETFAnalysis />} />
              <Route path="/portfolio" element={<Portfolio />} />
            </Routes>
          </div>
        </Router>
      </StockProvider>
    </ThemeProvider>

  );
}

export default App;