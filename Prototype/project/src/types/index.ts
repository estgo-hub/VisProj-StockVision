export interface Stock {
  id: string; // Will be converted from INTEGER to string in frontend
  ticker: string; // Maps to 'symbol' in database
  name: string;
  sector: string;
  industry: string;
  country: string; // Maps to 'region' in database
  exchange: string; // New field from database
  region: string; // New field from database
  type: 'equity' | 'etf' | 'reit';
  price: number; // From stock_prices table
  change: number; // From stock_prices table
  changePercent: number; // From stock_prices table (change_percent)
  marketCap: number; // From tickers table (market_cap)
  volume: number; // From stock_prices table
  peRatio?: number; // From tickers table (pe_ratio) - optional as it might be null
  lastUpdated?: string; // From stock_prices table (last_updated)
  isFavorite?: boolean;
}

export interface PriceData {
  date: string; // Maps to 'date' for daily or 'timestamp' for hourly
  open: number; // New field from prices_daily/prices_hourly
  high: number; // New field from prices_daily/prices_hourly
  low: number; // New field from prices_daily/prices_hourly
  price: number; // Maps to 'close' from prices_daily/prices_hourly
  volume: number;
}

export interface NewsEvent {
  date: string;
  headline: string;
  url: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

export interface ETFHolding {
  ticker: string;
  name: string;
  weight: number;
  sector: string;
  industry: string;
  country: string;
}

export interface ETF extends Stock {
  holdings: ETFHolding[];
  totalHoldings: number;
  expenseRatio: number;
}

export interface FilterOptions {
  sectors: string[];
  industries: string[];
  countries: string[];
  types: string[];
}

export interface DateRange {
  start: Date;
  end: Date;
}

export type ThemeMode = 'light' | 'dark';

export type SortField = 'name' | 'ticker' | 'price' | 'change' | 'changePercent' | 'marketCap' | 'volume' | 'peRatio';
export type SortOrder = 'asc' | 'desc';

// Database mapping interfaces for when you fetch data
export interface TickerRow {
  id: number;
  symbol: string;
  name: string;
  exchange: string;
  region: string;
  sector: string;
  industry: string;
  market_cap: number;
  pe_ratio: number | null;
  created_at: string;
}

export interface StockPriceRow {
  id: number;
  symbol: string;
  price: number;
  change: number;
  change_percent: number;
  volume: number;
  last_updated: string;
}

export interface PriceDailyRow {
  symbol: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface PriceHourlyRow {
  symbol: string;
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Helper function to convert database rows to frontend types
export const mapTickerAndPriceToStock = (ticker: TickerRow, price: StockPriceRow): Stock => {
  return {
    id: ticker.id.toString(),
    ticker: ticker.symbol,
    name: ticker.name,
    sector: ticker.sector,
    industry: ticker.industry,
    country: ticker.region, // Map region to country for consistency
    exchange: ticker.exchange,
    region: ticker.region,
    type: 'equity', // You might want to add a type field to your database
    price: price.price,
    change: price.change,
    changePercent: price.change_percent,
    marketCap: ticker.market_cap,
    volume: price.volume,
    peRatio: ticker.pe_ratio || undefined,
    lastUpdated: price.last_updated,
  };
};

export const mapPriceDailyToPriceData = (row: PriceDailyRow): PriceData => {
  return {
    date: row.date,
    open: row.open,
    high: row.high,
    low: row.low,
    price: row.close, // Map close to price for chart compatibility
    volume: row.volume,
  };
};

export const mapPriceHourlyToPriceData = (row: PriceHourlyRow): PriceData => {
  return {
    date: row.timestamp,
    open: row.open,
    high: row.high,
    low: row.low,
    price: row.close, // Map close to price for chart compatibility
    volume: row.volume,
  };
};