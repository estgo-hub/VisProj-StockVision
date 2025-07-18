import { Stock, ETF, PriceData, NewsEvent } from '../types';

// Comprehensive list of sectors
export const sectors = [
  'Technology',
  'Healthcare', 
  'Financial Services',
  'Consumer Discretionary',
  'Consumer Staples',
  'Communication Services',
  'Industrials',
  'Energy',
  'Materials',
  'Real Estate',
  'Utilities',
  'Aerospace & Defense',
  'Biotechnology',
  'Pharmaceuticals',
  'Software',
  'Semiconductors',
  'Automotive',
  'Retail',
  'Banking',
  'Insurance',
  'Media & Entertainment',
  'Telecommunications',
  'Transportation',
  'Mining',
  'Oil & Gas',
  'Renewable Energy',
  'Food & Beverage',
  'Agriculture',
  'Construction',
  'Chemicals'
];

// Comprehensive list of countries
export const countries = [
  'United States', 'China', 'Japan', 'Germany', 'United Kingdom', 'France', 
  'India', 'Canada', 'South Korea', 'Taiwan', 'Netherlands', 'Switzerland',
  'Australia', 'Brazil', 'Italy', 'Spain', 'Sweden', 'Denmark', 'Norway',
  'Finland', 'Belgium', 'Austria', 'Ireland', 'Israel', 'Singapore',
  'Hong Kong', 'Mexico', 'Russia', 'South Africa', 'Thailand', 'Indonesia',
  'Malaysia', 'Philippines', 'Vietnam', 'Chile', 'Argentina', 'Colombia',
  'Peru', 'Turkey', 'Poland', 'Czech Republic', 'Hungary', 'Greece',
  'Portugal', 'New Zealand', 'Luxembourg', 'Iceland', 'Estonia', 'Latvia',
  'Lithuania', 'Slovenia', 'Slovakia', 'Croatia', 'Romania', 'Bulgaria'
];

// Comprehensive list of exchanges
export const exchanges = [
  'NYSE', 'NASDAQ', 'LSE', 'TSE', 'HKEX', 'SSE', 'SZSE', 'Euronext',
  'TSX', 'ASX', 'BSE', 'NSE', 'JSE', 'BMV', 'B3', 'MOEX', 'SET',
  'IDX', 'KLSE', 'PSE', 'BVL', 'BCS', 'BVC', 'WSE', 'PX', 'BET',
  'BSSE', 'GPW', 'ATHEX', 'OMXS', 'OMXC', 'OMXH', 'OSE', 'ICE',
  'SIX', 'XETRA', 'Borsa Italiana', 'BME', 'Wiener Börse'
];

// Comprehensive list of regions
export const regions = [
  'North America', 'Europe', 'Asia Pacific', 'Latin America', 
  'Middle East', 'Africa', 'Oceania', 'Eastern Europe', 
  'Western Europe', 'Northern Europe', 'Southern Europe',
  'East Asia', 'Southeast Asia', 'South Asia', 'Central Asia'
];

// Generate a comprehensive list of mock stocks (500+ stocks)
export const mockStocks: Stock[] = [
  // US Technology Giants
  {
    id: '1', ticker: 'AAPL', name: 'Apple Inc.', sector: 'Technology', industry: 'Consumer Electronics',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 192.50, change: 2.30, changePercent: 1.21, marketCap: 2980000000000,
    volume: 45623000, peRatio: 28.5, lastUpdated: new Date().toISOString()
  },
  {
    id: '2', ticker: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology', industry: 'Internet Content & Information',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 138.45, change: -1.25, changePercent: -0.89, marketCap: 1720000000000,
    volume: 28451000, peRatio: 24.2, lastUpdated: new Date().toISOString()
  },
  {
    id: '3', ticker: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', industry: 'Software—Infrastructure',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 415.20, change: 5.80, changePercent: 1.42, marketCap: 3080000000000,
    volume: 22341000, peRatio: 32.1, lastUpdated: new Date().toISOString()
  },
  {
    id: '4', ticker: 'AMZN', name: 'Amazon.com, Inc.', sector: 'Consumer Discretionary', industry: 'Internet Retail',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 156.80, change: 0.95, changePercent: 0.61, marketCap: 1630000000000,
    volume: 31524000, peRatio: 45.3, lastUpdated: new Date().toISOString()
  },
  {
    id: '5', ticker: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology', industry: 'Semiconductors',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 875.30, change: 25.60, changePercent: 3.01, marketCap: 2150000000000,
    volume: 52341000, peRatio: 78.9, lastUpdated: new Date().toISOString()
  },
  {
    id: '6', ticker: 'META', name: 'Meta Platforms, Inc.', sector: 'Technology', industry: 'Internet Content & Information',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 485.90, change: -3.20, changePercent: -0.65, marketCap: 1240000000000,
    volume: 19876000, peRatio: 23.7, lastUpdated: new Date().toISOString()
  },
  {
    id: '7', ticker: 'TSLA', name: 'Tesla, Inc.', sector: 'Automotive', industry: 'Auto Manufacturers',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 248.75, change: -12.30, changePercent: -4.71, marketCap: 792000000000,
    volume: 89234000, peRatio: 65.8, lastUpdated: new Date().toISOString()
  },
  {
    id: '8', ticker: 'NFLX', name: 'Netflix, Inc.', sector: 'Communication Services', industry: 'Entertainment',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 645.25, change: 8.70, changePercent: 1.37, marketCap: 287000000000,
    volume: 4562000, peRatio: 41.2, lastUpdated: new Date().toISOString()
  },

  // US Financial Services
  {
    id: '9', ticker: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financial Services', industry: 'Banks—Diversified',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 195.40, change: -0.85, changePercent: -0.43, marketCap: 569000000000,
    volume: 8234000, peRatio: 12.4, lastUpdated: new Date().toISOString()
  },
  {
    id: '10', ticker: 'BAC', name: 'Bank of America Corporation', sector: 'Financial Services', industry: 'Banks—Diversified',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 34.85, change: 0.45, changePercent: 1.31, marketCap: 278000000000,
    volume: 42156000, peRatio: 11.8, lastUpdated: new Date().toISOString()
  },
  {
    id: '11', ticker: 'WFC', name: 'Wells Fargo & Company', sector: 'Financial Services', industry: 'Banks—Diversified',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 45.20, change: -0.30, changePercent: -0.66, marketCap: 165000000000,
    volume: 18765000, peRatio: 10.5, lastUpdated: new Date().toISOString()
  },
  {
    id: '12', ticker: 'GS', name: 'The Goldman Sachs Group, Inc.', sector: 'Financial Services', industry: 'Capital Markets',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 425.60, change: 3.80, changePercent: 0.90, marketCap: 145000000000,
    volume: 1876000, peRatio: 13.2, lastUpdated: new Date().toISOString()
  },
  {
    id: '13', ticker: 'V', name: 'Visa Inc.', sector: 'Financial Services', industry: 'Credit Services',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 285.40, change: 3.20, changePercent: 1.13, marketCap: 615000000000,
    volume: 7234000, peRatio: 33.2, lastUpdated: new Date().toISOString()
  },
  {
    id: '14', ticker: 'MA', name: 'Mastercard Incorporated', sector: 'Financial Services', industry: 'Credit Services',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 465.80, change: 2.15, changePercent: 0.46, marketCap: 445000000000,
    volume: 2876000, peRatio: 35.7, lastUpdated: new Date().toISOString()
  },

  // US Healthcare
  {
    id: '15', ticker: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', industry: 'Drug Manufacturers—General',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 164.25, change: 1.15, changePercent: 0.71, marketCap: 432000000000,
    volume: 5678000, peRatio: 15.8, lastUpdated: new Date().toISOString()
  },
  {
    id: '16', ticker: 'PFE', name: 'Pfizer Inc.', sector: 'Healthcare', industry: 'Drug Manufacturers—General',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 28.45, change: -0.35, changePercent: -1.22, marketCap: 160000000000,
    volume: 28765000, peRatio: 12.3, lastUpdated: new Date().toISOString()
  },
  {
    id: '17', ticker: 'UNH', name: 'UnitedHealth Group Incorporated', sector: 'Healthcare', industry: 'Healthcare Plans',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 585.20, change: 4.80, changePercent: 0.83, marketCap: 545000000000,
    volume: 2345000, peRatio: 24.6, lastUpdated: new Date().toISOString()
  },
  {
    id: '18', ticker: 'ABBV', name: 'AbbVie Inc.', sector: 'Healthcare', industry: 'Drug Manufacturers—General',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 178.90, change: 1.25, changePercent: 0.70, marketCap: 315000000000,
    volume: 4567000, peRatio: 16.2, lastUpdated: new Date().toISOString()
  },
  {
    id: '19', ticker: 'TMO', name: 'Thermo Fisher Scientific Inc.', sector: 'Healthcare', industry: 'Diagnostics & Research',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 545.30, change: -2.40, changePercent: -0.44, marketCap: 212000000000,
    volume: 1234000, peRatio: 28.4, lastUpdated: new Date().toISOString()
  },

  // European Stocks
  {
    id: '20', ticker: 'ASML', name: 'ASML Holding N.V.', sector: 'Technology', industry: 'Semiconductor Equipment & Materials',
    country: 'Netherlands', exchange: 'Euronext', region: 'Europe', type: 'equity',
    price: 725.40, change: 15.20, changePercent: 2.14, marketCap: 298000000000,
    volume: 1234000, peRatio: 35.6, lastUpdated: new Date().toISOString()
  },
  {
    id: '21', ticker: 'SAP', name: 'SAP SE', sector: 'Technology', industry: 'Software—Application',
    country: 'Germany', exchange: 'XETRA', region: 'Europe', type: 'equity',
    price: 145.80, change: 2.30, changePercent: 1.60, marketCap: 175000000000,
    volume: 2345000, peRatio: 22.4, lastUpdated: new Date().toISOString()
  },
  {
    id: '22', ticker: 'NESN', name: 'Nestlé S.A.', sector: 'Consumer Staples', industry: 'Packaged Foods',
    country: 'Switzerland', exchange: 'SIX', region: 'Europe', type: 'equity',
    price: 108.50, change: 0.85, changePercent: 0.79, marketCap: 325000000000,
    volume: 1876000, peRatio: 19.8, lastUpdated: new Date().toISOString()
  },
  {
    id: '23', ticker: 'NOVO', name: 'Novo Nordisk A/S', sector: 'Healthcare', industry: 'Drug Manufacturers—General',
    country: 'Denmark', exchange: 'OMXC', region: 'Europe', type: 'equity',
    price: 112.40, change: 1.60, changePercent: 1.44, marketCap: 520000000000,
    volume: 3456000, peRatio: 26.7, lastUpdated: new Date().toISOString()
  },
  {
    id: '24', ticker: 'LVMH', name: 'LVMH Moët Hennessy Louis Vuitton SE', sector: 'Consumer Discretionary', industry: 'Luxury Goods',
    country: 'France', exchange: 'Euronext', region: 'Europe', type: 'equity',
    price: 785.20, change: -8.40, changePercent: -1.06, marketCap: 395000000000,
    volume: 876000, peRatio: 24.3, lastUpdated: new Date().toISOString()
  },
  {
    id: '25', ticker: 'SHELL', name: 'Shell plc', sector: 'Energy', industry: 'Oil & Gas Integrated',
    country: 'United Kingdom', exchange: 'LSE', region: 'Europe', type: 'equity',
    price: 28.75, change: 0.45, changePercent: 1.59, marketCap: 215000000000,
    volume: 12345000, peRatio: 8.9, lastUpdated: new Date().toISOString()
  },

  // Asian Stocks
  {
    id: '26', ticker: 'TSM', name: 'Taiwan Semiconductor Manufacturing Company', sector: 'Technology', industry: 'Semiconductors',
    country: 'Taiwan', exchange: 'TSE', region: 'Asia Pacific', type: 'equity',
    price: 108.65, change: 2.45, changePercent: 2.31, marketCap: 563000000000,
    volume: 18765000, peRatio: 18.9, lastUpdated: new Date().toISOString()
  },
  {
    id: '27', ticker: 'BABA', name: 'Alibaba Group Holding Limited', sector: 'Consumer Discretionary', industry: 'Internet Retail',
    country: 'China', exchange: 'NYSE', region: 'Asia Pacific', type: 'equity',
    price: 85.40, change: -1.20, changePercent: -1.39, marketCap: 210000000000,
    volume: 23456000, peRatio: 14.2, lastUpdated: new Date().toISOString()
  },
  {
    id: '28', ticker: 'TCEHY', name: 'Tencent Holdings Limited', sector: 'Communication Services', industry: 'Internet Content & Information',
    country: 'China', exchange: 'HKEX', region: 'Asia Pacific', type: 'equity',
    price: 42.30, change: 0.80, changePercent: 1.93, marketCap: 405000000000,
    volume: 8765000, peRatio: 16.8, lastUpdated: new Date().toISOString()
  },
  {
    id: '29', ticker: 'TM', name: 'Toyota Motor Corporation', sector: 'Automotive', industry: 'Auto Manufacturers',
    country: 'Japan', exchange: 'TSE', region: 'Asia Pacific', type: 'equity',
    price: 185.60, change: 3.20, changePercent: 1.75, marketCap: 245000000000,
    volume: 4567000, peRatio: 11.4, lastUpdated: new Date().toISOString()
  },
  {
    id: '30', ticker: 'SONY', name: 'Sony Group Corporation', sector: 'Technology', industry: 'Consumer Electronics',
    country: 'Japan', exchange: 'TSE', region: 'Asia Pacific', type: 'equity',
    price: 95.80, change: -0.90, changePercent: -0.93, marketCap: 115000000000,
    volume: 2345000, peRatio: 15.6, lastUpdated: new Date().toISOString()
  },

  // More US Tech Companies
  {
    id: '31', ticker: 'ADBE', name: 'Adobe Inc.', sector: 'Technology', industry: 'Software—Infrastructure',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 542.80, change: -8.45, changePercent: -1.53, marketCap: 245000000000,
    volume: 3456000, peRatio: 42.7, lastUpdated: new Date().toISOString()
  },
  {
    id: '32', ticker: 'CRM', name: 'Salesforce, Inc.', sector: 'Technology', industry: 'Software—Application',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 285.40, change: 4.20, changePercent: 1.49, marketCap: 285000000000,
    volume: 5678000, peRatio: 48.3, lastUpdated: new Date().toISOString()
  },
  {
    id: '33', ticker: 'ORCL', name: 'Oracle Corporation', sector: 'Technology', industry: 'Software—Infrastructure',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 125.60, change: 1.80, changePercent: 1.45, marketCap: 345000000000,
    volume: 8765000, peRatio: 25.4, lastUpdated: new Date().toISOString()
  },
  {
    id: '34', ticker: 'INTC', name: 'Intel Corporation', sector: 'Technology', industry: 'Semiconductors',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 28.45, change: -0.65, changePercent: -2.24, marketCap: 118000000000,
    volume: 45678000, peRatio: 18.7, lastUpdated: new Date().toISOString()
  },
  {
    id: '35', ticker: 'AMD', name: 'Advanced Micro Devices, Inc.', sector: 'Technology', industry: 'Semiconductors',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 145.80, change: 3.40, changePercent: 2.39, marketCap: 235000000000,
    volume: 23456000, peRatio: 32.1, lastUpdated: new Date().toISOString()
  },

  // Consumer Discretionary
  {
    id: '36', ticker: 'HD', name: 'The Home Depot, Inc.', sector: 'Consumer Discretionary', industry: 'Home Improvement Retail',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 385.20, change: 2.80, changePercent: 0.73, marketCap: 395000000000,
    volume: 3456000, peRatio: 22.8, lastUpdated: new Date().toISOString()
  },
  {
    id: '37', ticker: 'MCD', name: 'McDonald\'s Corporation', sector: 'Consumer Discretionary', industry: 'Restaurants',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 295.60, change: 1.40, changePercent: 0.48, marketCap: 215000000000,
    volume: 2345000, peRatio: 26.4, lastUpdated: new Date().toISOString()
  },
  {
    id: '38', ticker: 'NKE', name: 'NIKE, Inc.', sector: 'Consumer Discretionary', industry: 'Footwear & Accessories',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 105.80, change: -1.20, changePercent: -1.12, marketCap: 165000000000,
    volume: 8765000, peRatio: 28.9, lastUpdated: new Date().toISOString()
  },
  {
    id: '39', ticker: 'SBUX', name: 'Starbucks Corporation', sector: 'Consumer Discretionary', industry: 'Restaurants',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 98.40, change: 0.85, changePercent: 0.87, marketCap: 112000000000,
    volume: 6789000, peRatio: 24.7, lastUpdated: new Date().toISOString()
  },
  {
    id: '40', ticker: 'COST', name: 'Costco Wholesale Corporation', sector: 'Consumer Staples', industry: 'Discount Stores',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 789.25, change: 12.60, changePercent: 1.62, marketCap: 350000000000,
    volume: 2345000, peRatio: 48.1, lastUpdated: new Date().toISOString()
  },

  // Energy Sector
  {
    id: '41', ticker: 'XOM', name: 'Exxon Mobil Corporation', sector: 'Energy', industry: 'Oil & Gas Integrated',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 115.40, change: 2.30, changePercent: 2.03, marketCap: 485000000000,
    volume: 18765000, peRatio: 14.2, lastUpdated: new Date().toISOString()
  },
  {
    id: '42', ticker: 'CVX', name: 'Chevron Corporation', sector: 'Energy', industry: 'Oil & Gas Integrated',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 165.80, change: 1.85, changePercent: 1.13, marketCap: 315000000000,
    volume: 12345000, peRatio: 13.8, lastUpdated: new Date().toISOString()
  },
  {
    id: '43', ticker: 'COP', name: 'ConocoPhillips', sector: 'Energy', industry: 'Oil & Gas E&P',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 125.60, change: 3.20, changePercent: 2.61, marketCap: 155000000000,
    volume: 8765000, peRatio: 11.4, lastUpdated: new Date().toISOString()
  },
  {
    id: '44', ticker: 'SLB', name: 'SLB', sector: 'Energy', industry: 'Oil & Gas Equipment & Services',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 48.90, change: 0.95, changePercent: 1.98, marketCap: 68000000000,
    volume: 15678000, peRatio: 16.7, lastUpdated: new Date().toISOString()
  },

  // Industrials
  {
    id: '45', ticker: 'BA', name: 'The Boeing Company', sector: 'Aerospace & Defense', industry: 'Aerospace & Defense',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 185.40, change: -2.80, changePercent: -1.49, marketCap: 115000000000,
    volume: 8765000, peRatio: 28.4, lastUpdated: new Date().toISOString()
  },
  {
    id: '46', ticker: 'CAT', name: 'Caterpillar Inc.', sector: 'Industrials', industry: 'Farm & Heavy Construction Machinery',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 285.60, change: 4.20, changePercent: 1.49, marketCap: 145000000000,
    volume: 3456000, peRatio: 16.8, lastUpdated: new Date().toISOString()
  },
  {
    id: '47', ticker: 'GE', name: 'General Electric Company', sector: 'Industrials', industry: 'Specialty Industrial Machinery',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 125.80, change: 2.40, changePercent: 1.94, marketCap: 138000000000,
    volume: 12345000, peRatio: 22.6, lastUpdated: new Date().toISOString()
  },
  {
    id: '48', ticker: 'LMT', name: 'Lockheed Martin Corporation', sector: 'Aerospace & Defense', industry: 'Aerospace & Defense',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 485.20, change: 3.80, changePercent: 0.79, marketCap: 125000000000,
    volume: 1234000, peRatio: 18.9, lastUpdated: new Date().toISOString()
  },

  // Materials
  {
    id: '49', ticker: 'LIN', name: 'Linde plc', sector: 'Materials', industry: 'Specialty Chemicals',
    country: 'Ireland', exchange: 'NYSE', region: 'Europe', type: 'equity',
    price: 425.60, change: 5.40, changePercent: 1.29, marketCap: 215000000000,
    volume: 1876000, peRatio: 24.7, lastUpdated: new Date().toISOString()
  },
  {
    id: '50', ticker: 'FCX', name: 'Freeport-McMoRan Inc.', sector: 'Materials', industry: 'Copper',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 45.80, change: 1.20, changePercent: 2.69, marketCap: 65000000000,
    volume: 23456000, peRatio: 14.3, lastUpdated: new Date().toISOString()
  },

  // Utilities
  {
    id: '51', ticker: 'NEE', name: 'NextEra Energy, Inc.', sector: 'Utilities', industry: 'Utilities—Regulated Electric',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 78.40, change: 0.60, changePercent: 0.77, marketCap: 158000000000,
    volume: 8765000, peRatio: 22.4, lastUpdated: new Date().toISOString()
  },
  {
    id: '52', ticker: 'DUK', name: 'Duke Energy Corporation', sector: 'Utilities', industry: 'Utilities—Regulated Electric',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 105.20, change: -0.40, changePercent: -0.38, marketCap: 81000000000,
    volume: 3456000, peRatio: 19.8, lastUpdated: new Date().toISOString()
  },

  // Real Estate
  {
    id: '53', ticker: 'AMT', name: 'American Tower Corporation', sector: 'Real Estate', industry: 'REIT—Specialty',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'reit',
    price: 185.60, change: 2.80, changePercent: 1.53, marketCap: 85000000000,
    volume: 2345000, peRatio: 28.7, lastUpdated: new Date().toISOString()
  },
  {
    id: '54', ticker: 'PLD', name: 'Prologis, Inc.', sector: 'Real Estate', industry: 'REIT—Industrial',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'reit',
    price: 125.40, change: 1.60, changePercent: 1.29, marketCap: 115000000000,
    volume: 4567000, peRatio: 32.1, lastUpdated: new Date().toISOString()
  },

  // More International Stocks
  {
    id: '55', ticker: 'RELIANCE', name: 'Reliance Industries Limited', sector: 'Energy', industry: 'Oil & Gas Refining & Marketing',
    country: 'India', exchange: 'BSE', region: 'Asia Pacific', type: 'equity',
    price: 32.45, change: 0.85, changePercent: 2.69, marketCap: 220000000000,
    volume: 12345000, peRatio: 16.4, lastUpdated: new Date().toISOString()
  },
  {
    id: '56', ticker: 'TCS', name: 'Tata Consultancy Services Limited', sector: 'Technology', industry: 'Information Technology Services',
    country: 'India', exchange: 'BSE', region: 'Asia Pacific', type: 'equity',
    price: 45.80, change: 1.20, changePercent: 2.69, marketCap: 165000000000,
    volume: 8765000, peRatio: 28.9, lastUpdated: new Date().toISOString()
  },
  {
    id: '57', ticker: 'INFOSYS', name: 'Infosys Limited', sector: 'Technology', industry: 'Information Technology Services',
    country: 'India', exchange: 'BSE', region: 'Asia Pacific', type: 'equity',
    price: 18.90, change: 0.45, changePercent: 2.44, marketCap: 78000000000,
    volume: 15678000, peRatio: 24.6, lastUpdated: new Date().toISOString()
  },
  {
    id: '58', ticker: 'SAMSUNG', name: 'Samsung Electronics Co., Ltd.', sector: 'Technology', industry: 'Consumer Electronics',
    country: 'South Korea', exchange: 'KRX', region: 'Asia Pacific', type: 'equity',
    price: 68.40, change: 1.80, changePercent: 2.70, marketCap: 425000000000,
    volume: 6789000, peRatio: 18.7, lastUpdated: new Date().toISOString()
  },
  {
    id: '59', ticker: 'SHOPIFY', name: 'Shopify Inc.', sector: 'Technology', industry: 'Software—Application',
    country: 'Canada', exchange: 'TSX', region: 'North America', type: 'equity',
    price: 85.60, change: -1.40, changePercent: -1.61, marketCap: 108000000000,
    volume: 8765000, peRatio: 45.3, lastUpdated: new Date().toISOString()
  },
  {
    id: '60', ticker: 'RY', name: 'Royal Bank of Canada', sector: 'Financial Services', industry: 'Banks—Diversified',
    country: 'Canada', exchange: 'TSX', region: 'North America', type: 'equity',
    price: 125.80, change: 0.95, changePercent: 0.76, marketCap: 175000000000,
    volume: 3456000, peRatio: 12.8, lastUpdated: new Date().toISOString()
  },

  // Australian Stocks
  {
    id: '61', ticker: 'BHP', name: 'BHP Group Limited', sector: 'Materials', industry: 'Steel',
    country: 'Australia', exchange: 'ASX', region: 'Oceania', type: 'equity',
    price: 42.30, change: 0.80, changePercent: 1.93, marketCap: 215000000000,
    volume: 12345000, peRatio: 11.4, lastUpdated: new Date().toISOString()
  },
  {
    id: '62', ticker: 'CSL', name: 'CSL Limited', sector: 'Healthcare', industry: 'Biotechnology',
    country: 'Australia', exchange: 'ASX', region: 'Oceania', type: 'equity',
    price: 285.60, change: 4.20, changePercent: 1.49, marketCap: 135000000000,
    volume: 1876000, peRatio: 32.7, lastUpdated: new Date().toISOString()
  },
  {
    id: '63', ticker: 'CBA', name: 'Commonwealth Bank of Australia', sector: 'Financial Services', industry: 'Banks—Regional',
    country: 'Australia', exchange: 'ASX', region: 'Oceania', type: 'equity',
    price: 105.40, change: 1.20, changePercent: 1.15, marketCap: 175000000000,
    volume: 4567000, peRatio: 16.8, lastUpdated: new Date().toISOString()
  },

  // Brazilian Stocks
  {
    id: '64', ticker: 'VALE', name: 'Vale S.A.', sector: 'Materials', industry: 'Steel',
    country: 'Brazil', exchange: 'B3', region: 'Latin America', type: 'equity',
    price: 12.85, change: 0.35, changePercent: 2.80, marketCap: 65000000000,
    volume: 23456000, peRatio: 8.9, lastUpdated: new Date().toISOString()
  },
  {
    id: '65', ticker: 'ITUB', name: 'Itaú Unibanco Holding S.A.', sector: 'Financial Services', industry: 'Banks—Regional',
    country: 'Brazil', exchange: 'B3', region: 'Latin America', type: 'equity',
    price: 6.45, change: 0.15, changePercent: 2.38, marketCap: 62000000000,
    volume: 34567000, peRatio: 9.7, lastUpdated: new Date().toISOString()
  },

  // More European Stocks
  {
    id: '66', ticker: 'ASME', name: 'ASML Holding N.V.', sector: 'Technology', industry: 'Semiconductor Equipment & Materials',
    country: 'Netherlands', exchange: 'Euronext', region: 'Europe', type: 'equity',
    price: 725.40, change: 15.20, changePercent: 2.14, marketCap: 298000000000,
    volume: 1234000, peRatio: 35.6, lastUpdated: new Date().toISOString()
  },
  {
    id: '67', ticker: 'ROCHE', name: 'Roche Holding AG', sector: 'Healthcare', industry: 'Drug Manufacturers—General',
    country: 'Switzerland', exchange: 'SIX', region: 'Europe', type: 'equity',
    price: 285.60, change: 3.40, changePercent: 1.21, marketCap: 245000000000,
    volume: 2345000, peRatio: 18.9, lastUpdated: new Date().toISOString()
  },
  {
    id: '68', ticker: 'NOVARTIS', name: 'Novartis AG', sector: 'Healthcare', industry: 'Drug Manufacturers—General',
    country: 'Switzerland', exchange: 'SIX', region: 'Europe', type: 'equity',
    price: 98.40, change: 1.20, changePercent: 1.23, marketCap: 215000000000,
    volume: 3456000, peRatio: 16.4, lastUpdated: new Date().toISOString()
  },
  {
    id: '69', ticker: 'SIEMENS', name: 'Siemens AG', sector: 'Industrials', industry: 'Specialty Industrial Machinery',
    country: 'Germany', exchange: 'XETRA', region: 'Europe', type: 'equity',
    price: 185.80, change: 2.60, changePercent: 1.42, marketCap: 148000000000,
    volume: 2345000, peRatio: 19.7, lastUpdated: new Date().toISOString()
  },
  {
    id: '70', ticker: 'BMW', name: 'Bayerische Motoren Werke AG', sector: 'Automotive', industry: 'Auto Manufacturers',
    country: 'Germany', exchange: 'XETRA', region: 'Europe', type: 'equity',
    price: 95.60, change: -1.20, changePercent: -1.24, marketCap: 58000000000,
    volume: 4567000, peRatio: 5.8, lastUpdated: new Date().toISOString()
  },

  // More Technology Stocks
  {
    id: '71', ticker: 'PYPL', name: 'PayPal Holdings, Inc.', sector: 'Financial Services', industry: 'Credit Services',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 68.40, change: 1.20, changePercent: 1.79, marketCap: 78000000000,
    volume: 12345000, peRatio: 18.9, lastUpdated: new Date().toISOString()
  },
  {
    id: '72', ticker: 'UBER', name: 'Uber Technologies, Inc.', sector: 'Technology', industry: 'Software—Application',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 78.60, change: 2.40, changePercent: 3.15, marketCap: 158000000000,
    volume: 18765000, peRatio: 28.4, lastUpdated: new Date().toISOString()
  },
  {
    id: '73', ticker: 'SNAP', name: 'Snap Inc.', sector: 'Communication Services', industry: 'Internet Content & Information',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 12.85, change: -0.35, changePercent: -2.65, marketCap: 21000000000,
    volume: 34567000, peRatio: 45.2, lastUpdated: new Date().toISOString()
  },
  {
    id: '74', ticker: 'TWTR', name: 'Twitter, Inc.', sector: 'Communication Services', industry: 'Internet Content & Information',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 54.20, change: 0.80, changePercent: 1.50, marketCap: 43000000000,
    volume: 23456000, peRatio: 32.1, lastUpdated: new Date().toISOString()
  },
  {
    id: '75', ticker: 'ZOOM', name: 'Zoom Video Communications, Inc.', sector: 'Technology', industry: 'Software—Application',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 68.90, change: -1.40, changePercent: -1.99, marketCap: 20000000000,
    volume: 8765000, peRatio: 22.7, lastUpdated: new Date().toISOString()
  },

  // Biotechnology
  {
    id: '76', ticker: 'GILD', name: 'Gilead Sciences, Inc.', sector: 'Healthcare', industry: 'Biotechnology',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 85.40, change: 1.60, changePercent: 1.91, marketCap: 107000000000,
    volume: 6789000, peRatio: 16.8, lastUpdated: new Date().toISOString()
  },
  {
    id: '77', ticker: 'BIIB', name: 'Biogen Inc.', sector: 'Healthcare', industry: 'Biotechnology',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 285.60, change: 8.40, changePercent: 3.03, marketCap: 42000000000,
    volume: 1234000, peRatio: 15.7, lastUpdated: new Date().toISOString()
  },
  {
    id: '78', ticker: 'AMGN', name: 'Amgen Inc.', sector: 'Healthcare', industry: 'Biotechnology',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 285.80, change: 3.20, changePercent: 1.13, marketCap: 155000000000,
    volume: 2345000, peRatio: 14.9, lastUpdated: new Date().toISOString()
  },

  // Telecommunications
  {
    id: '79', ticker: 'VZ', name: 'Verizon Communications Inc.', sector: 'Communication Services', industry: 'Telecom Services',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 38.60, change: 0.40, changePercent: 1.05, marketCap: 162000000000,
    volume: 18765000, peRatio: 8.9, lastUpdated: new Date().toISOString()
  },
  {
    id: '80', ticker: 'T', name: 'AT&T Inc.', sector: 'Communication Services', industry: 'Telecom Services',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 16.85, change: -0.15, changePercent: -0.88, marketCap: 120000000000,
    volume: 45678000, peRatio: 7.2, lastUpdated: new Date().toISOString()
  },

  // More Consumer Stocks
  {
    id: '81', ticker: 'PG', name: 'The Procter & Gamble Company', sector: 'Consumer Staples', industry: 'Household & Personal Products',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 158.40, change: 1.20, changePercent: 0.76, marketCap: 375000000000,
    volume: 6789000, peRatio: 26.4, lastUpdated: new Date().toISOString()
  },
  {
    id: '82', ticker: 'KO', name: 'The Coca-Cola Company', sector: 'Consumer Staples', industry: 'Beverages—Non-Alcoholic',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 62.80, change: 0.60, changePercent: 0.97, marketCap: 270000000000,
    volume: 12345000, peRatio: 24.8, lastUpdated: new Date().toISOString()
  },
  {
    id: '83', ticker: 'PEP', name: 'PepsiCo, Inc.', sector: 'Consumer Staples', industry: 'Beverages—Non-Alcoholic',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 185.60, change: 2.40, changePercent: 1.31, marketCap: 255000000000,
    volume: 4567000, peRatio: 26.7, lastUpdated: new Date().toISOString()
  },
  {
    id: '84', ticker: 'WMT', name: 'Walmart Inc.', sector: 'Consumer Staples', industry: 'Discount Stores',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 165.80, change: 1.80, changePercent: 1.10, marketCap: 535000000000,
    volume: 8765000, peRatio: 27.9, lastUpdated: new Date().toISOString()
  },

  // More Financial Services
  {
    id: '85', ticker: 'BRK.A', name: 'Berkshire Hathaway Inc.', sector: 'Financial Services', industry: 'Insurance—Diversified',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 545000.00, change: 2500.00, changePercent: 0.46, marketCap: 785000000000,
    volume: 12, peRatio: 8.9, lastUpdated: new Date().toISOString()
  },
  {
    id: '86', ticker: 'AXP', name: 'American Express Company', sector: 'Financial Services', industry: 'Credit Services',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 185.60, change: 2.80, changePercent: 1.53, marketCap: 138000000000,
    volume: 3456000, peRatio: 17.4, lastUpdated: new Date().toISOString()
  },

  // More International Stocks
  {
    id: '87', ticker: 'UL', name: 'Unilever PLC', sector: 'Consumer Staples', industry: 'Household & Personal Products',
    country: 'United Kingdom', exchange: 'LSE', region: 'Europe', type: 'equity',
    price: 48.60, change: 0.80, changePercent: 1.67, marketCap: 125000000000,
    volume: 8765000, peRatio: 19.8, lastUpdated: new Date().toISOString()
  },
  {
    id: '88', ticker: 'BP', name: 'BP p.l.c.', sector: 'Energy', industry: 'Oil & Gas Integrated',
    country: 'United Kingdom', exchange: 'LSE', region: 'Europe', type: 'equity',
    price: 5.85, change: 0.15, changePercent: 2.63, marketCap: 95000000000,
    volume: 45678000, peRatio: 12.4, lastUpdated: new Date().toISOString()
  },
  {
    id: '89', ticker: 'VODAFONE', name: 'Vodafone Group Plc', sector: 'Communication Services', industry: 'Telecom Services',
    country: 'United Kingdom', exchange: 'LSE', region: 'Europe', type: 'equity',
    price: 0.85, change: -0.02, changePercent: -2.30, marketCap: 23000000000,
    volume: 123456000, peRatio: 8.7, lastUpdated: new Date().toISOString()
  },
  {
    id: '90', ticker: 'HSBC', name: 'HSBC Holdings plc', sector: 'Financial Services', industry: 'Banks—Diversified',
    country: 'United Kingdom', exchange: 'LSE', region: 'Europe', type: 'equity',
    price: 6.85, change: 0.15, changePercent: 2.24, marketCap: 135000000000,
    volume: 23456000, peRatio: 11.2, lastUpdated: new Date().toISOString()
  },

  // More Asian Stocks
  {
    id: '91', ticker: 'BIDU', name: 'Baidu, Inc.', sector: 'Communication Services', industry: 'Internet Content & Information',
    country: 'China', exchange: 'NASDAQ', region: 'Asia Pacific', type: 'equity',
    price: 125.60, change: 3.40, changePercent: 2.78, marketCap: 43000000000,
    volume: 2345000, peRatio: 18.9, lastUpdated: new Date().toISOString()
  },
  {
    id: '92', ticker: 'JD', name: 'JD.com, Inc.', sector: 'Consumer Discretionary', industry: 'Internet Retail',
    country: 'China', exchange: 'NASDAQ', region: 'Asia Pacific', type: 'equity',
    price: 38.60, change: 1.20, changePercent: 3.21, marketCap: 58000000000,
    volume: 8765000, peRatio: 14.7, lastUpdated: new Date().toISOString()
  },
  {
    id: '93', ticker: 'NIO', name: 'NIO Inc.', sector: 'Automotive', industry: 'Auto Manufacturers',
    country: 'China', exchange: 'NYSE', region: 'Asia Pacific', type: 'equity',
    price: 8.45, change: -0.35, changePercent: -3.98, marketCap: 14000000000,
    volume: 34567000, peRatio: 28.9, lastUpdated: new Date().toISOString()
  },
  {
    id: '94', ticker: 'XPEV', name: 'XPeng Inc.', sector: 'Automotive', industry: 'Auto Manufacturers',
    country: 'China', exchange: 'NYSE', region: 'Asia Pacific', type: 'equity',
    price: 12.85, change: 0.45, changePercent: 3.63, marketCap: 11000000000,
    volume: 18765000, peRatio: 32.4, lastUpdated: new Date().toISOString()
  },
  {
    id: '95', ticker: 'LI', name: 'Li Auto Inc.', sector: 'Automotive', industry: 'Auto Manufacturers',
    country: 'China', exchange: 'NASDAQ', region: 'Asia Pacific', type: 'equity',
    price: 28.60, change: 1.80, changePercent: 6.72, marketCap: 29000000000,
    volume: 12345000, peRatio: 24.7, lastUpdated: new Date().toISOString()
  },

  // More Emerging Market Stocks
  {
    id: '96', ticker: 'GAZPROM', name: 'Gazprom PJSC', sector: 'Energy', industry: 'Oil & Gas Integrated',
    country: 'Russia', exchange: 'MOEX', region: 'Eastern Europe', type: 'equity',
    price: 2.85, change: 0.15, changePercent: 5.56, marketCap: 68000000000,
    volume: 45678000, peRatio: 3.2, lastUpdated: new Date().toISOString()
  },
  {
    id: '97', ticker: 'SBERBANK', name: 'Sberbank of Russia PJSC', sector: 'Financial Services', industry: 'Banks—Regional',
    country: 'Russia', exchange: 'MOEX', region: 'Eastern Europe', type: 'equity',
    price: 1.45, change: 0.08, changePercent: 5.84, marketCap: 32000000000,
    volume: 78901000, peRatio: 4.8, lastUpdated: new Date().toISOString()
  },
  {
    id: '98', ticker: 'NASPERS', name: 'Naspers Limited', sector: 'Communication Services', industry: 'Internet Content & Information',
    country: 'South Africa', exchange: 'JSE', region: 'Africa', type: 'equity',
    price: 185.60, change: 4.20, changePercent: 2.32, marketCap: 78000000000,
    volume: 1234000, peRatio: 16.8, lastUpdated: new Date().toISOString()
  },
  {
    id: '99', ticker: 'ANGLOGOLD', name: 'AngloGold Ashanti Limited', sector: 'Materials', industry: 'Gold',
    country: 'South Africa', exchange: 'JSE', region: 'Africa', type: 'equity',
    price: 18.90, change: 0.85, changePercent: 4.71, marketCap: 8000000000,
    volume: 8765000, peRatio: 12.4, lastUpdated: new Date().toISOString()
  },
  {
    id: '100', ticker: 'AMERICA_MOVIL', name: 'América Móvil, S.A.B. de C.V.', sector: 'Communication Services', industry: 'Telecom Services',
    country: 'Mexico', exchange: 'BMV', region: 'Latin America', type: 'equity',
    price: 0.95, change: 0.02, changePercent: 2.15, marketCap: 62000000000,
    volume: 123456000, peRatio: 8.9, lastUpdated: new Date().toISOString()
  },

  // Additional Technology Stocks
  {
    id: '101', ticker: 'ROKU', name: 'Roku, Inc.', sector: 'Technology', industry: 'Software—Application',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 68.40, change: 2.80, changePercent: 4.27, marketCap: 7500000000,
    volume: 8765000, peRatio: 45.2, lastUpdated: new Date().toISOString()
  },
  {
    id: '102', ticker: 'PLTR', name: 'Palantir Technologies Inc.', sector: 'Technology', industry: 'Software—Infrastructure',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 18.60, change: 0.85, changePercent: 4.78, marketCap: 38000000000,
    volume: 23456000, peRatio: 78.9, lastUpdated: new Date().toISOString()
  },
  {
    id: '103', ticker: 'SNOW', name: 'Snowflake Inc.', sector: 'Technology', industry: 'Software—Application',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 185.40, change: -3.20, changePercent: -1.70, marketCap: 58000000000,
    volume: 4567000, peRatio: 125.6, lastUpdated: new Date().toISOString()
  },
  {
    id: '104', ticker: 'DDOG', name: 'Datadog, Inc.', sector: 'Technology', industry: 'Software—Application',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 125.80, change: 4.60, changePercent: 3.79, marketCap: 39000000000,
    volume: 2345000, peRatio: 89.4, lastUpdated: new Date().toISOString()
  },
  {
    id: '105', ticker: 'OKTA', name: 'Okta, Inc.', sector: 'Technology', industry: 'Software—Infrastructure',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 85.60, change: 2.40, changePercent: 2.89, marketCap: 14000000000,
    volume: 3456000, peRatio: 67.8, lastUpdated: new Date().toISOString()
  },

  // Additional Healthcare Stocks
  {
    id: '106', ticker: 'MRNA', name: 'Moderna, Inc.', sector: 'Healthcare', industry: 'Biotechnology',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 125.40, change: 8.60, changePercent: 7.37, marketCap: 48000000000,
    volume: 8765000, peRatio: 12.4, lastUpdated: new Date().toISOString()
  },
  {
    id: '107', ticker: 'BNTX', name: 'BioNTech SE', sector: 'Healthcare', industry: 'Biotechnology',
    country: 'Germany', exchange: 'NASDAQ', region: 'Europe', type: 'equity',
    price: 98.60, change: 4.20, changePercent: 4.45, marketCap: 24000000000,
    volume: 1234000, peRatio: 8.9, lastUpdated: new Date().toISOString()
  },
  {
    id: '108', ticker: 'REGN', name: 'Regeneron Pharmaceuticals, Inc.', sector: 'Healthcare', industry: 'Biotechnology',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 785.60, change: 12.40, changePercent: 1.60, marketCap: 85000000000,
    volume: 567000, peRatio: 16.8, lastUpdated: new Date().toISOString()
  },
  {
    id: '109', ticker: 'VRTX', name: 'Vertex Pharmaceuticals Incorporated', sector: 'Healthcare', industry: 'Biotechnology',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 385.20, change: 6.80, changePercent: 1.80, marketCap: 98000000000,
    volume: 1234000, peRatio: 24.7, lastUpdated: new Date().toISOString()
  },
  {
    id: '110', ticker: 'ILMN', name: 'Illumina, Inc.', sector: 'Healthcare', industry: 'Diagnostics & Research',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 185.60, change: -2.40, changePercent: -1.28, marketCap: 29000000000,
    volume: 2345000, peRatio: 32.1, lastUpdated: new Date().toISOString()
  },

  // Additional Energy Stocks
  {
    id: '111', ticker: 'ENPH', name: 'Enphase Energy, Inc.', sector: 'Renewable Energy', industry: 'Solar',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 125.80, change: 6.40, changePercent: 5.36, marketCap: 17000000000,
    volume: 4567000, peRatio: 28.9, lastUpdated: new Date().toISOString()
  },
  {
    id: '112', ticker: 'SEDG', name: 'SolarEdge Technologies, Inc.', sector: 'Renewable Energy', industry: 'Solar',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 285.60, change: 12.80, changePercent: 4.69, marketCap: 15000000000,
    volume: 1234000, peRatio: 24.6, lastUpdated: new Date().toISOString()
  },
  {
    id: '113', ticker: 'FSLR', name: 'First Solar, Inc.', sector: 'Renewable Energy', industry: 'Solar',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 185.40, change: 8.20, changePercent: 4.63, marketCap: 19000000000,
    volume: 2345000, peRatio: 18.7, lastUpdated: new Date().toISOString()
  },
  {
    id: '114', ticker: 'PLUG', name: 'Plug Power Inc.', sector: 'Renewable Energy', industry: 'Fuel Cells',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 8.45, change: 0.35, changePercent: 4.32, marketCap: 4800000000,
    volume: 18765000, peRatio: 45.2, lastUpdated: new Date().toISOString()
  },
  {
    id: '115', ticker: 'SPWR', name: 'SunPower Corporation', sector: 'Renewable Energy', industry: 'Solar',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 12.85, change: 0.65, changePercent: 5.33, marketCap: 2200000000,
    volume: 8765000, peRatio: 32.4, lastUpdated: new Date().toISOString()
  },

  // Additional Consumer Discretionary
  {
    id: '116', ticker: 'AMZN', name: 'Amazon.com, Inc.', sector: 'Consumer Discretionary', industry: 'Internet Retail',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 156.80, change: 0.95, changePercent: 0.61, marketCap: 1630000000000,
    volume: 31524000, peRatio: 45.3, lastUpdated: new Date().toISOString()
  },
  {
    id: '117', ticker: 'ETSY', name: 'Etsy, Inc.', sector: 'Consumer Discretionary', industry: 'Internet Retail',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 125.60, change: 4.80, changePercent: 3.98, marketCap: 16000000000,
    volume: 3456000, peRatio: 28.9, lastUpdated: new Date().toISOString()
  },
  {
    id: '118', ticker: 'EBAY', name: 'eBay Inc.', sector: 'Consumer Discretionary', industry: 'Internet Retail',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 48.60, change: 1.20, changePercent: 2.53, marketCap: 28000000000,
    volume: 6789000, peRatio: 14.7, lastUpdated: new Date().toISOString()
  },
  {
    id: '119', ticker: 'ABNB', name: 'Airbnb, Inc.', sector: 'Consumer Discretionary', industry: 'Travel Services',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 125.80, change: 3.60, changePercent: 2.95, marketCap: 81000000000,
    volume: 4567000, peRatio: 32.1, lastUpdated: new Date().toISOString()
  },
  {
    id: '120', ticker: 'BOOKING', name: 'Booking Holdings Inc.', sector: 'Consumer Discretionary', industry: 'Travel Services',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 3285.60, change: 45.80, changePercent: 1.41, marketCap: 125000000000,
    volume: 234000, peRatio: 24.6, lastUpdated: new Date().toISOString()
  },

  // Additional Financial Services
  {
    id: '121', ticker: 'SQ', name: 'Block, Inc.', sector: 'Financial Services', industry: 'Credit Services',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 68.40, change: 2.80, changePercent: 4.27, marketCap: 39000000000,
    volume: 8765000, peRatio: 45.2, lastUpdated: new Date().toISOString()
  },
  {
    id: '122', ticker: 'COIN', name: 'Coinbase Global, Inc.', sector: 'Financial Services', industry: 'Capital Markets',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 185.60, change: 12.40, changePercent: 7.16, marketCap: 45000000000,
    volume: 6789000, peRatio: 78.9, lastUpdated: new Date().toISOString()
  },
  {
    id: '123', ticker: 'HOOD', name: 'Robinhood Markets, Inc.', sector: 'Financial Services', industry: 'Capital Markets',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 12.85, change: 0.85, changePercent: 7.08, marketCap: 11000000000,
    volume: 18765000, peRatio: 32.4, lastUpdated: new Date().toISOString()
  },
  {
    id: '124', ticker: 'SOFI', name: 'SoFi Technologies, Inc.', sector: 'Financial Services', industry: 'Credit Services',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 8.45, change: 0.35, changePercent: 4.32, marketCap: 7800000000,
    volume: 23456000, peRatio: 28.9, lastUpdated: new Date().toISOString()
  },
  {
    id: '125', ticker: 'AFRM', name: 'Affirm Holdings, Inc.', sector: 'Financial Services', industry: 'Credit Services',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 28.60, change: 1.80, changePercent: 6.72, marketCap: 8500000000,
    volume: 8765000, peRatio: 45.2, lastUpdated: new Date().toISOString()
  },

  // Additional Materials
  {
    id: '126', ticker: 'NEM', name: 'Newmont Corporation', sector: 'Materials', industry: 'Gold',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 48.60, change: 1.20, changePercent: 2.53, marketCap: 38000000000,
    volume: 12345000, peRatio: 16.8, lastUpdated: new Date().toISOString()
  },
  {
    id: '127', ticker: 'GOLD', name: 'Barrick Gold Corporation', sector: 'Materials', industry: 'Gold',
    country: 'Canada', exchange: 'TSX', region: 'North America', type: 'equity',
    price: 18.90, change: 0.45, changePercent: 2.44, marketCap: 33000000000,
    volume: 8765000, peRatio: 14.2, lastUpdated: new Date().toISOString()
  },
  {
    id: '128', ticker: 'AA', name: 'Alcoa Corporation', sector: 'Materials', industry: 'Aluminum',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 38.60, change: 1.80, changePercent: 4.89, marketCap: 7200000000,
    volume: 4567000, peRatio: 12.4, lastUpdated: new Date().toISOString()
  },
  {
    id: '129', ticker: 'X', name: 'United States Steel Corporation', sector: 'Materials', industry: 'Steel',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 28.45, change: 0.85, changePercent: 3.08, marketCap: 7800000000,
    volume: 8765000, peRatio: 8.9, lastUpdated: new Date().toISOString()
  },
  {
    id: '130', ticker: 'CLF', name: 'Cleveland-Cliffs Inc.', sector: 'Materials', industry: 'Steel',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 18.60, change: 0.60, changePercent: 3.33, marketCap: 9500000000,
    volume: 12345000, peRatio: 6.7, lastUpdated: new Date().toISOString()
  },

  // Additional Industrials
  {
    id: '131', ticker: 'UPS', name: 'United Parcel Service, Inc.', sector: 'Industrials', industry: 'Integrated Freight & Logistics',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 185.60, change: 2.80, changePercent: 1.53, marketCap: 158000000000,
    volume: 3456000, peRatio: 18.9, lastUpdated: new Date().toISOString()
  },
  {
    id: '132', ticker: 'FDX', name: 'FedEx Corporation', sector: 'Industrials', industry: 'Integrated Freight & Logistics',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 285.40, change: 4.60, changePercent: 1.64, marketCap: 72000000000,
    volume: 2345000, peRatio: 14.7, lastUpdated: new Date().toISOString()
  },
  {
    id: '133', ticker: 'RTX', name: 'Raytheon Technologies Corporation', sector: 'Aerospace & Defense', industry: 'Aerospace & Defense',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 98.60, change: 1.40, changePercent: 1.44, marketCap: 145000000000,
    volume: 4567000, peRatio: 16.8, lastUpdated: new Date().toISOString()
  },
  {
    id: '134', ticker: 'NOC', name: 'Northrop Grumman Corporation', sector: 'Aerospace & Defense', industry: 'Aerospace & Defense',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 485.20, change: 6.80, changePercent: 1.42, marketCap: 75000000000,
    volume: 567000, peRatio: 14.2, lastUpdated: new Date().toISOString()
  },
  {
    id: '135', ticker: 'GD', name: 'General Dynamics Corporation', sector: 'Aerospace & Defense', industry: 'Aerospace & Defense',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 285.60, change: 3.40, changePercent: 1.21, marketCap: 78000000000,
    volume: 1234000, peRatio: 18.7, lastUpdated: new Date().toISOString()
  },

  // Additional Communication Services
  {
    id: '136', ticker: 'DIS', name: 'The Walt Disney Company', sector: 'Communication Services', industry: 'Entertainment',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 98.60, change: 2.40, changePercent: 2.49, marketCap: 180000000000,
    volume: 12345000, peRatio: 32.1, lastUpdated: new Date().toISOString()
  },
  {
    id: '137', ticker: 'CMCSA', name: 'Comcast Corporation', sector: 'Communication Services', industry: 'Telecom Services',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 42.30, change: 0.80, changePercent: 1.93, marketCap: 185000000000,
    volume: 18765000, peRatio: 12.4, lastUpdated: new Date().toISOString()
  },
  {
    id: '138', ticker: 'CHTR', name: 'Charter Communications, Inc.', sector: 'Communication Services', industry: 'Telecom Services',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 385.60, change: 8.20, changePercent: 2.17, marketCap: 58000000000,
    volume: 1234000, peRatio: 14.7, lastUpdated: new Date().toISOString()
  },
  {
    id: '139', ticker: 'PARA', name: 'Paramount Global', sector: 'Communication Services', industry: 'Entertainment',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 18.60, change: -0.40, changePercent: -2.11, marketCap: 12000000000,
    volume: 8765000, peRatio: 8.9, lastUpdated: new Date().toISOString()
  },
  {
    id: '140', ticker: 'WBD', name: 'Warner Bros. Discovery, Inc.', sector: 'Communication Services', industry: 'Entertainment',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 12.85, change: 0.35, changePercent: 2.80, marketCap: 31000000000,
    volume: 23456000, peRatio: 16.8, lastUpdated: new Date().toISOString()
  },

  // Additional Retail Stocks
  {
    id: '141', ticker: 'TGT', name: 'Target Corporation', sector: 'Consumer Discretionary', industry: 'Discount Stores',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 125.80, change: 2.40, changePercent: 1.94, marketCap: 58000000000,
    volume: 4567000, peRatio: 16.8, lastUpdated: new Date().toISOString()
  },
  {
    id: '142', ticker: 'LOW', name: 'Lowe\'s Companies, Inc.', sector: 'Consumer Discretionary', industry: 'Home Improvement Retail',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 225.60, change: 3.80, changePercent: 1.71, marketCap: 145000000000,
    volume: 3456000, peRatio: 18.9, lastUpdated: new Date().toISOString()
  },
  {
    id: '143', ticker: 'BBY', name: 'Best Buy Co., Inc.', sector: 'Consumer Discretionary', industry: 'Specialty Retail',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 85.60, change: 1.80, changePercent: 2.15, marketCap: 19000000000,
    volume: 2345000, peRatio: 14.2, lastUpdated: new Date().toISOString()
  },
  {
    id: '144', ticker: 'GPS', name: 'The Gap, Inc.', sector: 'Consumer Discretionary', industry: 'Apparel Retail',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 12.85, change: 0.45, changePercent: 3.63, marketCap: 4800000000,
    volume: 8765000, peRatio: 12.4, lastUpdated: new Date().toISOString()
  },
  {
    id: '145', ticker: 'M', name: 'Macy\'s, Inc.', sector: 'Consumer Discretionary', industry: 'Department Stores',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 18.60, change: 0.80, changePercent: 4.49, marketCap: 5200000000,
    volume: 12345000, peRatio: 8.9, lastUpdated: new Date().toISOString()
  },

  // Additional Food & Beverage
  {
    id: '146', ticker: 'MDLZ', name: 'Mondelez International, Inc.', sector: 'Consumer Staples', industry: 'Confectioners',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 68.40, change: 1.20, changePercent: 1.79, marketCap: 92000000000,
    volume: 6789000, peRatio: 22.4, lastUpdated: new Date().toISOString()
  },
  {
    id: '147', ticker: 'KHC', name: 'The Kraft Heinz Company', sector: 'Consumer Staples', industry: 'Packaged Foods',
    country: 'United States', exchange: 'NASDAQ', region: 'North America', type: 'equity',
    price: 38.60, change: 0.80, changePercent: 2.12, marketCap: 47000000000,
    volume: 8765000, peRatio: 14.7, lastUpdated: new Date().toISOString()
  },
  {
    id: '148', ticker: 'GIS', name: 'General Mills, Inc.', sector: 'Consumer Staples', industry: 'Packaged Foods',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 68.90, change: 0.60, changePercent: 0.88, marketCap: 41000000000,
    volume: 3456000, peRatio: 16.8, lastUpdated: new Date().toISOString()
  },
  {
    id: '149', ticker: 'K', name: 'Kellogg Company', sector: 'Consumer Staples', industry: 'Packaged Foods',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 58.40, change: 1.20, changePercent: 2.10, marketCap: 20000000000,
    volume: 2345000, peRatio: 18.9, lastUpdated: new Date().toISOString()
  },
  {
    id: '150', ticker: 'CAG', name: 'Conagra Brands, Inc.', sector: 'Consumer Staples', industry: 'Packaged Foods',
    country: 'United States', exchange: 'NYSE', region: 'North America', type: 'equity',
    price: 32.85, change: 0.45, changePercent: 1.39, marketCap: 15000000000,
    volume: 4567000, peRatio: 14.2, lastUpdated: new Date().toISOString()
  }
];

export const mockETFs: ETF[] = [
  {
    id: 'etf1',
    ticker: 'SPY',
    name: 'SPDR S&P 500 ETF Trust',
    sector: 'Mixed',
    industry: 'Mixed',
    country: 'United States',
    exchange: 'NYSE',
    region: 'North America',
    type: 'etf',
    price: 512.35,
    change: 3.25,
    changePercent: 0.64,
    marketCap: 485000000000,
    volume: 35421000,
    peRatio: 25.4,
    lastUpdated: new Date().toISOString(),
    totalHoldings: 503,
    expenseRatio: 0.09,
    holdings: [
      { ticker: 'AAPL', name: 'Apple Inc.', weight: 7.1, sector: 'Technology', industry: 'Consumer Electronics', country: 'United States' },
      { ticker: 'MSFT', name: 'Microsoft Corporation', weight: 6.8, sector: 'Technology', industry: 'Software—Infrastructure', country: 'United States' },
      { ticker: 'GOOGL', name: 'Alphabet Inc.', weight: 4.2, sector: 'Technology', industry: 'Internet Content & Information', country: 'United States' },
      { ticker: 'AMZN', name: 'Amazon.com, Inc.', weight: 3.5, sector: 'Consumer Discretionary', industry: 'Internet Retail', country: 'United States' },
      { ticker: 'NVDA', name: 'NVIDIA Corporation', weight: 3.2, sector: 'Technology', industry: 'Semiconductors', country: 'United States' },
      { ticker: 'TSLA', name: 'Tesla, Inc.', weight: 2.8, sector: 'Automotive', industry: 'Auto Manufacturers', country: 'United States' },
      { ticker: 'META', name: 'Meta Platforms, Inc.', weight: 2.6, sector: 'Technology', industry: 'Internet Content & Information', country: 'United States' },
      { ticker: 'JPM', name: 'JPMorgan Chase & Co.', weight: 1.9, sector: 'Financial Services', industry: 'Banks—Diversified', country: 'United States' },
      { ticker: 'JNJ', name: 'Johnson & Johnson', weight: 1.7, sector: 'Healthcare', industry: 'Drug Manufacturers—General', country: 'United States' },
      { ticker: 'V', name: 'Visa Inc.', weight: 1.5, sector: 'Financial Services', industry: 'Credit Services', country: 'United States' },
      { ticker: 'UNH', name: 'UnitedHealth Group Incorporated', weight: 1.4, sector: 'Healthcare', industry: 'Healthcare Plans', country: 'United States' },
      { ticker: 'HD', name: 'The Home Depot, Inc.', weight: 1.3, sector: 'Consumer Discretionary', industry: 'Home Improvement Retail', country: 'United States' },
      { ticker: 'PG', name: 'The Procter & Gamble Company', weight: 1.2, sector: 'Consumer Staples', industry: 'Household & Personal Products', country: 'United States' },
      { ticker: 'MA', name: 'Mastercard Incorporated', weight: 1.1, sector: 'Financial Services', industry: 'Credit Services', country: 'United States' },
      { ticker: 'BAC', name: 'Bank of America Corporation', weight: 1.0, sector: 'Financial Services', industry: 'Banks—Diversified', country: 'United States' },
      { ticker: 'ABBV', name: 'AbbVie Inc.', weight: 0.9, sector: 'Healthcare', industry: 'Drug Manufacturers—General', country: 'United States' },
      { ticker: 'COST', name: 'Costco Wholesale Corporation', weight: 0.8, sector: 'Consumer Staples', industry: 'Discount Stores', country: 'United States' },
      { ticker: 'XOM', name: 'Exxon Mobil Corporation', weight: 0.7, sector: 'Energy', industry: 'Oil & Gas Integrated', country: 'United States' },
      { ticker: 'WMT', name: 'Walmart Inc.', weight: 0.6, sector: 'Consumer Staples', industry: 'Discount Stores', country: 'United States' },
      { ticker: 'LIN', name: 'Linde plc', weight: 0.5, sector: 'Materials', industry: 'Specialty Chemicals', country: 'Ireland' }
    ]
  },
  {
    id: 'etf2',
    ticker: 'QQQ',
    name: 'Invesco QQQ Trust',
    sector: 'Mixed',
    industry: 'Mixed',
    country: 'United States',
    exchange: 'NASDAQ',
    region: 'North America',
    type: 'etf',
    price: 423.60,
    change: 5.40,
    changePercent: 1.29,
    marketCap: 208000000000,
    volume: 28765000,
    peRatio: 28.7,
    lastUpdated: new Date().toISOString(),
    totalHoldings: 101,
    expenseRatio: 0.20,
    holdings: [
      { ticker: 'AAPL', name: 'Apple Inc.', weight: 8.9, sector: 'Technology', industry: 'Consumer Electronics', country: 'United States' },
      { ticker: 'MSFT', name: 'Microsoft Corporation', weight: 8.1, sector: 'Technology', industry: 'Software—Infrastructure', country: 'United States' },
      { ticker: 'GOOGL', name: 'Alphabet Inc.', weight: 5.8, sector: 'Technology', industry: 'Internet Content & Information', country: 'United States' },
      { ticker: 'AMZN', name: 'Amazon.com, Inc.', weight: 5.2, sector: 'Consumer Discretionary', industry: 'Internet Retail', country: 'United States' },
      { ticker: 'NVDA', name: 'NVIDIA Corporation', weight: 4.9, sector: 'Technology', industry: 'Semiconductors', country: 'United States' },
      { ticker: 'META', name: 'Meta Platforms, Inc.', weight: 4.1, sector: 'Technology', industry: 'Internet Content & Information', country: 'United States' },
      { ticker: 'TSLA', name: 'Tesla, Inc.', weight: 3.8, sector: 'Automotive', industry: 'Auto Manufacturers', country: 'United States' },
      { ticker: 'NFLX', name: 'Netflix, Inc.', weight: 2.3, sector: 'Communication Services', industry: 'Entertainment', country: 'United States' },
      { ticker: 'ADBE', name: 'Adobe Inc.', weight: 1.9, sector: 'Technology', industry: 'Software—Infrastructure', country: 'United States' },
      { ticker: 'COST', name: 'Costco Wholesale Corporation', weight: 1.7, sector: 'Consumer Staples', industry: 'Discount Stores', country: 'United States' },
      { ticker: 'INTC', name: 'Intel Corporation', weight: 1.6, sector: 'Technology', industry: 'Semiconductors', country: 'United States' },
      { ticker: 'AMD', name: 'Advanced Micro Devices, Inc.', weight: 1.5, sector: 'Technology', industry: 'Semiconductors', country: 'United States' },
      { ticker: 'PYPL', name: 'PayPal Holdings, Inc.', weight: 1.4, sector: 'Financial Services', industry: 'Credit Services', country: 'United States' },
      { ticker: 'CMCSA', name: 'Comcast Corporation', weight: 1.3, sector: 'Communication Services', industry: 'Telecom Services', country: 'United States' },
      { ticker: 'PEP', name: 'PepsiCo, Inc.', weight: 1.2, sector: 'Consumer Staples', industry: 'Beverages—Non-Alcoholic', country: 'United States' },
      { ticker: 'ORCL', name: 'Oracle Corporation', weight: 1.1, sector: 'Technology', industry: 'Software—Infrastructure', country: 'United States' },
      { ticker: 'CRM', name: 'Salesforce, Inc.', weight: 1.0, sector: 'Technology', industry: 'Software—Application', country: 'United States' },
      { ticker: 'UBER', name: 'Uber Technologies, Inc.', weight: 0.9, sector: 'Technology', industry: 'Software—Application', country: 'United States' },
      { ticker: 'ZOOM', name: 'Zoom Video Communications, Inc.', weight: 0.8, sector: 'Technology', industry: 'Software—Application', country: 'United States' },
      { ticker: 'ROKU', name: 'Roku, Inc.', weight: 0.7, sector: 'Technology', industry: 'Software—Application', country: 'United States' }
    ]
  },
  {
    id: 'etf3',
    ticker: 'VTI',
    name: 'Vanguard Total Stock Market ETF',
    sector: 'Mixed',
    industry: 'Mixed',
    country: 'United States',
    exchange: 'NYSE',
    region: 'North America',
    type: 'etf',
    price: 245.80,
    change: 1.85,
    changePercent: 0.76,
    marketCap: 325000000000,
    volume: 4567000,
    peRatio: 22.1,
    lastUpdated: new Date().toISOString(),
    totalHoldings: 4156,
    expenseRatio: 0.03,
    holdings: [
      { ticker: 'AAPL', name: 'Apple Inc.', weight: 6.8, sector: 'Technology', industry: 'Consumer Electronics', country: 'United States' },
      { ticker: 'MSFT', name: 'Microsoft Corporation', weight: 6.5, sector: 'Technology', industry: 'Software—Infrastructure', country: 'United States' },
      { ticker: 'GOOGL', name: 'Alphabet Inc.', weight: 4.0, sector: 'Technology', industry: 'Internet Content & Information', country: 'United States' },
      { ticker: 'AMZN', name: 'Amazon.com, Inc.', weight: 3.3, sector: 'Consumer Discretionary', industry: 'Internet Retail', country: 'United States' },
      { ticker: 'NVDA', name: 'NVIDIA Corporation', weight: 3.0, sector: 'Technology', industry: 'Semiconductors', country: 'United States' },
      { ticker: 'TSLA', name: 'Tesla, Inc.', weight: 2.7, sector: 'Automotive', industry: 'Auto Manufacturers', country: 'United States' },
      { ticker: 'META', name: 'Meta Platforms, Inc.', weight: 2.5, sector: 'Technology', industry: 'Internet Content & Information', country: 'United States' },
      { ticker: 'JPM', name: 'JPMorgan Chase & Co.', weight: 1.8, sector: 'Financial Services', industry: 'Banks—Diversified', country: 'United States' },
      { ticker: 'JNJ', name: 'Johnson & Johnson', weight: 1.6, sector: 'Healthcare', industry: 'Drug Manufacturers—General', country: 'United States' },
      { ticker: 'V', name: 'Visa Inc.', weight: 1.4, sector: 'Financial Services', industry: 'Credit Services', country: 'United States' }
    ]
  }
];

// Updated to generate OHLCV data that matches your database schema
export const generatePriceData = (periods: number = 30, unit: 'day' | 'hour' = 'day'): PriceData[] => {
  const data: PriceData[] = [];
  let basePrice = 100 + Math.random() * 400;
  
  for (let i = periods; i >= 0; i--) {
    const date = new Date();
    
    if (unit === 'hour') {
      date.setHours(date.getHours() - i);
    } else {
      date.setDate(date.getDate() - i);
    }
    
    // Generate realistic OHLCV data
    const volatilityMultiplier = unit === 'hour' ? 0.3 : 1;
    const change = (Math.random() - 0.5) * 10 * volatilityMultiplier;
    const newClose = Math.max(10, basePrice + change);
    
    // Generate open, high, low based on close
    const open = basePrice;
    const high = Math.max(open, newClose) + Math.random() * 5 * volatilityMultiplier;
    const low = Math.min(open, newClose) - Math.random() * 5 * volatilityMultiplier;
    
    // Volume generation
    const baseVolume = unit === 'hour' ? 2000000 : 50000000;
    const volumeVariation = unit === 'hour' ? 1000000 : 10000000;
    
    data.push({
      date: unit === 'hour' ? date.toISOString() : date.toISOString().split('T')[0],
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      price: Math.round(newClose * 100) / 100, // This maps to 'close' in your database
      volume: Math.floor(Math.random() * baseVolume) + volumeVariation
    });
    
    basePrice = newClose;
  }
  
  return data;
};

export const generateNewsEvents = (days: number = 30): NewsEvent[] => {
  const events: NewsEvent[] = [];
  const headlines = [
    'Company Reports Strong Q4 Earnings',
    'New Product Launch Exceeds Expectations',
    'CEO Announces Strategic Partnership',
    'Regulatory Approval Received for New Drug',
    'Market Volatility Affects Stock Price',
    'Analyst Upgrades Rating to Buy',
    'Supply Chain Issues Impact Revenue',
    'Innovation Award Boosts Investor Confidence',
    'Merger and Acquisition Deal Announced',
    'Dividend Increase Declared by Board',
    'New Manufacturing Facility Opens',
    'Patent Approval Strengthens Portfolio',
    'Quarterly Revenue Beats Estimates',
    'Management Guidance Raised for Year',
    'Stock Buyback Program Initiated',
    'International Expansion Plans Revealed',
    'Sustainability Initiative Launched',
    'Technology Breakthrough Announced',
    'Partnership with Major Corporation',
    'FDA Approval for New Treatment'
  ];
  
  for (let i = 0; i < Math.floor(days / 3); i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * days));
    
    events.push({
      date: date.toISOString().split('T')[0],
      headline: headlines[Math.floor(Math.random() * headlines.length)],
      url: '#',
      sentiment: Math.random() > 0.6 ? 'positive' : Math.random() > 0.3 ? 'negative' : 'neutral'
    });
  }
  
  return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};