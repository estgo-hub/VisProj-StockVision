export interface Stock {
  id: string;
  ticker: string;
  name: string;
  sector: string;
  industry: string;
  country: string;
  type: 'equity' | 'etf' | 'reit';
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  volume: number;
  isFavorite?: boolean;
}

export interface PriceData {
  date: string;
  price: number;
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

export type SortField = 'name' | 'ticker' | 'price' | 'change' | 'changePercent' | 'marketCap' | 'volume';
export type SortOrder = 'asc' | 'desc';