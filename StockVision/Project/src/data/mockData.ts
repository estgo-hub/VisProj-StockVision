import { Stock, ETF, PriceData, NewsEvent } from '../types';

export const mockStocks: Stock[] = [
  {
    id: '1',
    ticker: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Technology',
    industry: 'Consumer Electronics',
    country: 'United States',
    exchange: 'NASDAQ',
    region: 'United States',
    type: 'equity',
    price: 192.50,
    change: 2.30,
    changePercent: 1.21,
    marketCap: 2980000000000,
    volume: 45623000,
    peRatio: 28.5,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '2',
    ticker: 'GOOGL',
    name: 'Alphabet Inc.',
    sector: 'Technology',
    industry: 'Internet Content & Information',
    country: 'United States',
    exchange: 'NASDAQ',
    region: 'United States',
    type: 'equity',
    price: 138.45,
    change: -1.25,
    changePercent: -0.89,
    marketCap: 1720000000000,
    volume: 28451000,
    peRatio: 24.2,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '3',
    ticker: 'MSFT',
    name: 'Microsoft Corporation',
    sector: 'Technology',
    industry: 'Software—Infrastructure',
    country: 'United States',
    exchange: 'NASDAQ',
    region: 'United States',
    type: 'equity',
    price: 415.20,
    change: 5.80,
    changePercent: 1.42,
    marketCap: 3080000000000,
    volume: 22341000,
    peRatio: 32.1,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '4',
    ticker: 'TSLA',
    name: 'Tesla, Inc.',
    sector: 'Consumer Discretionary',
    industry: 'Auto Manufacturers',
    country: 'United States',
    exchange: 'NASDAQ',
    region: 'United States',
    type: 'equity',
    price: 248.75,
    change: -12.30,
    changePercent: -4.71,
    marketCap: 792000000000,
    volume: 89234000,
    peRatio: 65.8,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '5',
    ticker: 'AMZN',
    name: 'Amazon.com, Inc.',
    sector: 'Consumer Discretionary',
    industry: 'Internet Retail',
    country: 'United States',
    exchange: 'NASDAQ',
    region: 'United States',
    type: 'equity',
    price: 156.80,
    change: 0.95,
    changePercent: 0.61,
    marketCap: 1630000000000,
    volume: 31524000,
    peRatio: 45.3,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '6',
    ticker: 'NVDA',
    name: 'NVIDIA Corporation',
    sector: 'Technology',
    industry: 'Semiconductors',
    country: 'United States',
    exchange: 'NASDAQ',
    region: 'United States',
    type: 'equity',
    price: 875.30,
    change: 25.60,
    changePercent: 3.01,
    marketCap: 2150000000000,
    volume: 52341000,
    peRatio: 78.9,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '7',
    ticker: 'META',
    name: 'Meta Platforms, Inc.',
    sector: 'Technology',
    industry: 'Internet Content & Information',
    country: 'United States',
    exchange: 'NASDAQ',
    region: 'United States',
    type: 'equity',
    price: 485.90,
    change: -3.20,
    changePercent: -0.65,
    marketCap: 1240000000000,
    volume: 19876000,
    peRatio: 23.7,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '8',
    ticker: 'NFLX',
    name: 'Netflix, Inc.',
    sector: 'Communication Services',
    industry: 'Entertainment',
    country: 'United States',
    exchange: 'NASDAQ',
    region: 'United States',
    type: 'equity',
    price: 645.25,
    change: 8.70,
    changePercent: 1.37,
    marketCap: 287000000000,
    volume: 4562000,
    peRatio: 41.2,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '9',
    ticker: 'ASML',
    name: 'ASML Holding N.V.',
    sector: 'Technology',
    industry: 'Semiconductor Equipment & Materials',
    country: 'Netherlands',
    exchange: 'NASDAQ',
    region: 'Europe',
    type: 'equity',
    price: 725.40,
    change: 15.20,
    changePercent: 2.14,
    marketCap: 298000000000,
    volume: 1234000,
    peRatio: 35.6,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '10',
    ticker: 'TSM',
    name: 'Taiwan Semiconductor Manufacturing Company',
    sector: 'Technology',
    industry: 'Semiconductors',
    country: 'Taiwan',
    exchange: 'NYSE',
    region: 'Asia',
    type: 'equity',
    price: 108.65,
    change: 2.45,
    changePercent: 2.31,
    marketCap: 563000000000,
    volume: 18765000,
    peRatio: 18.9,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '11',
    ticker: 'JPM',
    name: 'JPMorgan Chase & Co.',
    sector: 'Financial Services',
    industry: 'Banks—Diversified',
    country: 'United States',
    exchange: 'NYSE',
    region: 'United States',
    type: 'equity',
    price: 195.40,
    change: -0.85,
    changePercent: -0.43,
    marketCap: 569000000000,
    volume: 8234000,
    peRatio: 12.4,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '12',
    ticker: 'JNJ',
    name: 'Johnson & Johnson',
    sector: 'Healthcare',
    industry: 'Drug Manufacturers—General',
    country: 'United States',
    exchange: 'NYSE',
    region: 'United States',
    type: 'equity',
    price: 164.25,
    change: 1.15,
    changePercent: 0.71,
    marketCap: 432000000000,
    volume: 5678000,
    peRatio: 15.8,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '13',
    ticker: 'V',
    name: 'Visa Inc.',
    sector: 'Financial Services',
    industry: 'Credit Services',
    country: 'United States',
    exchange: 'NYSE',
    region: 'United States',
    type: 'equity',
    price: 285.40,
    change: 3.20,
    changePercent: 1.13,
    marketCap: 615000000000,
    volume: 7234000,
    peRatio: 33.2,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '14',
    ticker: 'ADBE',
    name: 'Adobe Inc.',
    sector: 'Technology',
    industry: 'Software—Infrastructure',
    country: 'United States',
    exchange: 'NASDAQ',
    region: 'United States',
    type: 'equity',
    price: 542.80,
    change: -8.45,
    changePercent: -1.53,
    marketCap: 245000000000,
    volume: 3456000,
    peRatio: 42.7,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '15',
    ticker: 'COST',
    name: 'Costco Wholesale Corporation',
    sector: 'Consumer Staples',
    industry: 'Discount Stores',
    country: 'United States',
    exchange: 'NASDAQ',
    region: 'United States',
    type: 'equity',
    price: 789.25,
    change: 12.60,
    changePercent: 1.62,
    marketCap: 350000000000,
    volume: 2345000,
    peRatio: 48.1,
    lastUpdated: new Date().toISOString()
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
    region: 'United States',
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
      { ticker: 'TSLA', name: 'Tesla, Inc.', weight: 2.8, sector: 'Consumer Discretionary', industry: 'Auto Manufacturers', country: 'United States' },
      { ticker: 'META', name: 'Meta Platforms, Inc.', weight: 2.6, sector: 'Technology', industry: 'Internet Content & Information', country: 'United States' },
      { ticker: 'JPM', name: 'JPMorgan Chase & Co.', weight: 1.9, sector: 'Financial Services', industry: 'Banks—Diversified', country: 'United States' },
      { ticker: 'JNJ', name: 'Johnson & Johnson', weight: 1.7, sector: 'Healthcare', industry: 'Drug Manufacturers—General', country: 'United States' },
      { ticker: 'V', name: 'Visa Inc.', weight: 1.5, sector: 'Financial Services', industry: 'Credit Services', country: 'United States' }
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
    region: 'United States',
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
      { ticker: 'TSLA', name: 'Tesla, Inc.', weight: 3.8, sector: 'Consumer Discretionary', industry: 'Auto Manufacturers', country: 'United States' },
      { ticker: 'NFLX', name: 'Netflix, Inc.', weight: 2.3, sector: 'Communication Services', industry: 'Entertainment', country: 'United States' },
      { ticker: 'ADBE', name: 'Adobe Inc.', weight: 1.9, sector: 'Technology', industry: 'Software—Infrastructure', country: 'United States' },
      { ticker: 'COST', name: 'Costco Wholesale Corporation', weight: 1.7, sector: 'Consumer Staples', industry: 'Discount Stores', country: 'United States' }
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
    'Innovation Award Boosts Investor Confidence'
  ];

  for (let i = 0; i < Math.floor(days / 7); i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * days));

    events.push({
      date: date.toISOString().split('T')[0],
      headline: headlines[Math.floor(Math.random() * headlines.length)],
      url: '#',
      sentiment: Math.random() > 0.5 ? 'positive' : Math.random() > 0.5 ? 'negative' : 'neutral'
    });
  }

  return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const sectors = ['Technology', 'Healthcare', 'Financial Services', 'Consumer Discretionary', 'Consumer Staples', 'Communication Services', 'Industrials', 'Energy', 'Materials', 'Real Estate', 'Utilities'];

export const countries = ['United States', 'China', 'Japan', 'Germany', 'United Kingdom', 'France', 'India', 'Canada', 'South Korea', 'Taiwan', 'Netherlands', 'Switzerland'];

export const exchanges = ['NYSE', 'NASDAQ', 'LSE', 'TSE', 'HKEX', 'SSE', 'SZSE', 'Euronext', 'TSX', 'ASX'];

export const regions = ['United States', 'Europe', 'Asia', 'Americas', 'Oceania', 'Africa'];