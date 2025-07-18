import React, { createContext, useContext, useState, useEffect } from 'react';
import { Stock, ETF } from '../types';
import { mockStocks, mockETFs } from '../data/mockData';

interface StockContextType {
  stocks: Stock[];
  etfs: ETF[];
  favorites: Set<string>;
  loading: boolean;
  error: string | null;
  addToFavorites: (stockId: string) => void;
  removeFromFavorites: (stockId: string) => void;
  toggleFavorite: (stockId: string) => void;
  searchStocks: (query: string) => Stock[];
  getStockById: (id: string) => Stock | undefined;
  getETFById: (id: string) => ETF | undefined;
  refreshData: () => Promise<void>;
}

const StockContext = createContext<StockContextType | undefined>(undefined);

export const useStock = () => {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error('useStock must be used within a StockProvider');
  }
  return context;
};

export const StockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stocks, setStocks] = useState<Stock[]>(mockStocks);
  const [etfs, setETFs] = useState<ETF[]>(mockETFs);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify([...favorites]));
  }, [favorites]);

  // This function will be replaced with actual database calls
  const refreshData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Example:
      // const stocksData = await fetchStocksFromDatabase();
      // const etfsData = await fetchETFsFromDatabase();
      // setStocks(stocksData);
      // setETFs(etfsData);
      
      // For now, we'll simulate a delay and use mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStocks(mockStocks);
      setETFs(mockETFs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = (stockId: string) => {
    setFavorites(prev => new Set(prev).add(stockId));
  };

  const removeFromFavorites = (stockId: string) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      newSet.delete(stockId);
      return newSet;
    });
  };

  const toggleFavorite = (stockId: string) => {
    if (favorites.has(stockId)) {
      removeFromFavorites(stockId);
    } else {
      addToFavorites(stockId);
    }
  };

  const searchStocks = (query: string): Stock[] => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return stocks.filter(stock => 
      stock.ticker.toLowerCase().includes(lowerQuery) ||
      stock.name.toLowerCase().includes(lowerQuery)
    );
  };

  const getStockById = (id: string): Stock | undefined => {
    return stocks.find(stock => stock.id === id);
  };

  const getETFById = (id: string): ETF | undefined => {
    return etfs.find(etf => etf.id === id);
  };

  return (
    <StockContext.Provider value={{
      stocks,
      etfs,
      favorites,
      loading,
      error,
      addToFavorites,
      removeFromFavorites,
      toggleFavorite,
      searchStocks,
      getStockById,
      getETFById,
      refreshData
    }}>
      {children}
    </StockContext.Provider>
  );
};