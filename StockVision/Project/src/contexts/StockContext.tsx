import React, { createContext, useContext, useState, useEffect } from 'react';
import { Stock, ETF, mapTickerAndPriceToStock, TickerRow, StockPriceRow } from '../types';

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

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// API service functions
const apiService = {
  async fetchStocks(): Promise<Stock[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/stocks`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // If the API returns combined ticker and price data
      if (Array.isArray(data) && data.length > 0 && 'ticker' in data[0]) {
        return data as Stock[];
      }

      // If the API returns separate ticker and price data that needs mapping
      if (data.tickers && data.prices) {
        const tickerMap = new Map<string, TickerRow>();
        data.tickers.forEach((ticker: TickerRow) => {
          tickerMap.set(ticker.symbol, ticker);
        });

        return data.prices
          .map((price: StockPriceRow) => {
            const ticker = tickerMap.get(price.symbol);
            if (!ticker) return null;
            return mapTickerAndPriceToStock(ticker, price);
          })
          .filter(Boolean) as Stock[];
      }

      return [];
    } catch (error) {
      console.error('Error fetching stocks:', error);
      throw new Error(`Failed to fetch stocks: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  async fetchETFs(): Promise<ETF[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/etfs`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data as ETF[];
    } catch (error) {
      console.error('Error fetching ETFs:', error);
      throw new Error(`Failed to fetch ETFs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  async searchStocks(query: string): Promise<Stock[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/stocks/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data as Stock[];
    } catch (error) {
      console.error('Error searching stocks:', error);
      // Fallback to client-side search if API search fails
      return [];
    }
  },

  async fetchStockById(id: string): Promise<Stock | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/stocks/${id}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data as Stock;
    } catch (error) {
      console.error('Error fetching stock by ID:', error);
      return null;
    }
  },

  async fetchETFById(id: string): Promise<ETF | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/etfs/${id}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data as ETF;
    } catch (error) {
      console.error('Error fetching ETF by ID:', error);
      return null;
    }
  }
};

export const StockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [etfs, setETFs] = useState<ETF[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify([...favorites]));
  }, [favorites]);

  // Load data on component mount
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch stocks and ETFs in parallel
      const [stocksData, etfsData] = await Promise.all([
        apiService.fetchStocks(),
        apiService.fetchETFs()
      ]);

      setStocks(stocksData);
      setETFs(etfsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(errorMessage);
      console.error('Error refreshing data:', err);

      // Optionally, you could fall back to mock data here
      // setStocks(mockStocks);
      // setETFs(mockETFs);
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

  const searchStocks = async (query: string): Promise<Stock[]> => {
    if (!query.trim()) return [];

    try {
      // Try API search first
      const apiResults = await apiService.searchStocks(query);
      if (apiResults.length > 0) {
        return apiResults;
      }
    } catch (error) {
      console.warn('API search failed, falling back to client-side search:', error);
    }

    // Fallback to client-side search
    const lowerQuery = query.toLowerCase();
    return stocks.filter(stock =>
      stock.ticker.toLowerCase().includes(lowerQuery) ||
      stock.name.toLowerCase().includes(lowerQuery)
    );
  };

  const getStockById = async (id: string): Promise<Stock | undefined> => {
    try {
      // Try API first
      const apiResult = await apiService.fetchStockById(id);
      if (apiResult) {
        return apiResult;
      }
    } catch (error) {
      console.warn('API fetch failed, falling back to local data:', error);
    }

    // Fallback to local data
    return stocks.find(stock => stock.id === id);
  };

  const getETFById = async (id: string): Promise<ETF | undefined> => {
    try {
      // Try API first
      const apiResult = await apiService.fetchETFById(id);
      if (apiResult) {
        return apiResult;
      }
    } catch (error) {
      console.warn('API fetch failed, falling back to local data:', error);
    }

    // Fallback to local data
    return etfs.find(etf => etf.id === id);
  };

  // Synchronous versions for backward compatibility
  const searchStocksSync = (query: string): Stock[] => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return stocks.filter(stock =>
      stock.ticker.toLowerCase().includes(lowerQuery) ||
      stock.name.toLowerCase().includes(lowerQuery)
    );
  };

  const getStockByIdSync = (id: string): Stock | undefined => {
    return stocks.find(stock => stock.id === id);
  };

  const getETFByIdSync = (id: string): ETF | undefined => {
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
      searchStocks: searchStocksSync, // Keep sync version for existing components
      getStockById: getStockByIdSync, // Keep sync version for existing components
      getETFById: getETFByIdSync, // Keep sync version for existing components
      refreshData
    }}>
      {children}
    </StockContext.Provider>
  );
};