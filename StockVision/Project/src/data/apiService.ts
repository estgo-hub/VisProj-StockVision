import { Stock, ETF, PriceData, mapTickerAndPriceToStock, mapPriceDailyToPriceData, mapPriceHourlyToPriceData, TickerRow, StockPriceRow, PriceDailyRow, PriceHourlyRow } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

class ApiService {
  private async fetchWithErrorHandling<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${url}:`, error);
      throw error;
    }
  }

  async fetchStocks(): Promise<Stock[]> {
    try {
      const data = await this.fetchWithErrorHandling<any>(`${API_BASE_URL}/stocks`);

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
      throw new Error(`Failed to fetch stocks: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async fetchETFs(): Promise<ETF[]> {
    try {
      const data = await this.fetchWithErrorHandling<ETF[]>(`${API_BASE_URL}/etfs`);
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch ETFs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async searchStocks(query: string): Promise<Stock[]> {
    try {
      const data = await this.fetchWithErrorHandling<Stock[]>(`${API_BASE_URL}/stocks/search?q=${encodeURIComponent(query)}`);
      return data;
    } catch (error) {
      console.error('Error searching stocks:', error);
      return [];
    }
  }

  async fetchStockById(id: string): Promise<Stock | null> {
    try {
      const data = await this.fetchWithErrorHandling<Stock>(`${API_BASE_URL}/stocks/${id}`);
      return data;
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async fetchETFById(id: string): Promise<ETF | null> {
    try {
      const data = await this.fetchWithErrorHandling<ETF>(`${API_BASE_URL}/etfs/${id}`);
      return data;
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async fetchPriceHistory(symbol: string, timeframe: 'daily' | 'hourly', days?: number): Promise<PriceData[]> {
    try {
      const params = new URLSearchParams({ timeframe });
      if (days) {
        params.append('days', days.toString());
      }

      const data = await this.fetchWithErrorHandling<any[]>(`${API_BASE_URL}/stocks/${symbol}/prices?${params}`);

      if (timeframe === 'daily') {
        return data.map(mapPriceDailyToPriceData);
      } else {
        return data.map(mapPriceHourlyToPriceData);
      }
    } catch (error) {
      throw new Error(`Failed to fetch price history: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async fetchMarketSummary(): Promise<{
    totalStocks: number;
    gainers: number;
    losers: number;
    avgChange: number;
    totalMarketCap: number;
  }> {
    try {
      const data = await this.fetchWithErrorHandling<any>(`${API_BASE_URL}/market/summary`);
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch market summary: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async fetchSectorPerformance(): Promise<Array<{
    sector: string;
    avgChange: number;
    stockCount: number;
    totalMarketCap: number;
  }>> {
    try {
      const data = await this.fetchWithErrorHandling<any[]>(`${API_BASE_URL}/market/sectors`);
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch sector performance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async fetchCountryPerformance(): Promise<Array<{
    country: string;
    avgChange: number;
    stockCount: number;
    totalMarketCap: number;
  }>> {
    try {
      const data = await this.fetchWithErrorHandling<any[]>(`${API_BASE_URL}/market/countries`);
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch country performance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const apiService = new ApiService();
export default apiService;