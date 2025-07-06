import React, { createContext, useContext, useState, useEffect } from 'react';

interface PortfolioHolding {
  symbol: string;
  quantity: number;
  avgPurchasePrice: number;
  currentPrice: number;
  marketValue: number;
  costBasis: number;
  gainLoss: number;
  gainLossPercent: number;
  firstPurchase: string;
}

interface Portfolio {
  balance: number;
  holdings: PortfolioHolding[];
  totalValue: number;
  totalCost: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  totalPortfolioValue: number;
}

interface PortfolioContextType {
  portfolio: Portfolio | null;
  loading: boolean;
  error: string | null;
  buyStock: (symbol: string, quantity: number, price: number) => Promise<boolean>;
  sellStock: (symbol: string, quantity: number, price: number) => Promise<boolean>;
  addBalance: (amount: number) => Promise<boolean>;
  refreshPortfolio: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

const API_BASE_URL = 'http://localhost:3001/api';

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/portfolio`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      
      setPortfolio(data);
    } catch (err) {
      console.error('Error fetching portfolio:', err);
      setError('Failed to fetch portfolio. Please check if the server is running.');
      setPortfolio(null);
    } finally {
      setLoading(false);
    }
  };

  const buyStock = async (symbol: string, quantity: number, price: number): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio/buy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbol, quantity, price }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.error) {
        setError(data.error);
        return false;
      }
      
      // Refresh portfolio after successful purchase
      await fetchPortfolio();
      return true;
    } catch (err) {
      console.error('Error buying stock:', err);
      setError('Failed to buy stock');
      return false;
    }
  };

  const sellStock = async (symbol: string, quantity: number, price: number): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio/sell`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbol, quantity, price }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.error) {
        setError(data.error);
        return false;
      }
      
      // Refresh portfolio after successful sale
      await fetchPortfolio();
      return true;
    } catch (err) {
      console.error('Error selling stock:', err);
      setError('Failed to sell stock');
      return false;
    }
  };

  const addBalance = async (amount: number): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/portfolio/balance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.error) {
        setError(data.error);
        return false;
      }
      
      // Refresh portfolio after adding balance
      await fetchPortfolio();
      return true;
    } catch (err) {
      console.error('Error adding balance:', err);
      setError('Failed to add balance');
      return false;
    }
  };

  const refreshPortfolio = async () => {
    await fetchPortfolio();
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  return (
    <PortfolioContext.Provider value={{
      portfolio,
      loading,
      error,
      buyStock,
      sellStock,
      addBalance,
      refreshPortfolio
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};