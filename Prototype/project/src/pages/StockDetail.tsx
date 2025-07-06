import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useStock } from '../contexts/StockContext';
import { useTheme } from '../contexts/ThemeContext';
import PriceChart from '../components/PriceChart';
import SearchBar from '../components/SearchBar';
import { generatePriceData, generateNewsEvents } from '../data/mockData';
import { Stock, DateRange, PriceData, NewsEvent } from '../types';
import { 
  Heart, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  ExternalLink,
  Volume2,
  DollarSign,
  Building,
  MapPin
} from 'lucide-react';

const StockDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getStockById, favorites, toggleFavorite } = useStock();
  const { theme } = useTheme();
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date()
  });
  const [timeframe, setTimeframe] = useState<'1H' | '1D' | '1W' | '1M' | '3M' | '6M' | '1Y'>('1M');

  const stock = useMemo(() => {
    if (id) {
      return getStockById(id);
    }
    return selectedStock;
  }, [id, getStockById, selectedStock]);

  const priceData = useMemo(() => {
    if (!stock) return [];
    
    let periodsOrDays: number;
    let unit: 'day' | 'hour' = 'day';
    
    switch (timeframe) {
      case '1H':
        periodsOrDays = 24;
        unit = 'hour';
        break;
      case '1D':
        periodsOrDays = 1;
        break;
      case '1W':
        periodsOrDays = 7;
        break;
      case '1M':
        periodsOrDays = 30;
        break;
      case '3M':
        periodsOrDays = 90;
        break;
      case '6M':
        periodsOrDays = 180;
        break;
      case '1Y':
        periodsOrDays = 365;
        break;
      default:
        periodsOrDays = 30;
    }
    
    return generatePriceData(periodsOrDays, unit);
  }, [stock, timeframe]);

  const newsEvents = useMemo(() => {
    if (!stock) return [];
    return generateNewsEvents(30);
  }, [stock]);

  const handleStockSelect = (newStock: Stock) => {
    setSelectedStock(newStock);
  };

  const handleTimeframeChange = (newTimeframe: typeof timeframe) => {
    setTimeframe(newTimeframe);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(1)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(1)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(1)}M`;
    }
    return `$${marketCap.toFixed(0)}`;
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1e6) {
      return `${(volume / 1e6).toFixed(1)}M`;
    } else if (volume >= 1e3) {
      return `${(volume / 1e3).toFixed(1)}K`;
    }
    return volume.toString();
  };

  if (!stock) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Stock Analysis
            </h1>
            <div className="max-w-md mx-auto">
              <SearchBar 
                onSelect={handleStockSelect}
                placeholder="Search for a stock to analyze..."
              />
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              Select a stock to view detailed analysis, price charts, and news events
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isFavorite = favorites.has(stock.id);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center space-x-4 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stock.ticker}
                </h1>
                <button
                  onClick={() => toggleFavorite(stock.id)}
                  className={`p-2 rounded-full transition-colors ${
                    isFavorite
                      ? 'text-red-500 hover:text-red-600'
                      : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <Heart className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
                {stock.name}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center space-x-1">
                  <Building className="h-4 w-4" />
                  <span>{stock.sector}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{stock.country}</span>
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {formatPrice(stock.price)}
              </p>
              <div className={`flex items-center space-x-2 ${
                stock.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {stock.change >= 0 ? (
                  <TrendingUp className="h-5 w-5" />
                ) : (
                  <TrendingDown className="h-5 w-5" />
                )}
                <span className="font-medium">
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                </span>
                <span>
                  ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
          
          <div className="max-w-md">
            <SearchBar 
              onSelect={handleStockSelect}
              placeholder="Search for another stock..."
            />
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-2">
              <DollarSign className="h-5 w-5 text-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Market Cap</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatMarketCap(stock.marketCap)}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-2">
              <Volume2 className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Volume</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatVolume(stock.volume)}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-2">
              <Building className="h-5 w-5 text-purple-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Industry</span>
            </div>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {stock.industry}
            </p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 md:mb-0">
              Price Chart
            </h2>
            
            <div className="flex items-center space-x-2">
              {(['1H', '1D', '1W', '1M', '3M', '6M', '1Y'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => handleTimeframeChange(tf)}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    timeframe === tf
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
          
          <PriceChart
            data={priceData}
            newsEvents={newsEvents}
            height={400}
            darkMode={theme === 'dark'}
          />
        </div>

        {/* News Events */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Recent News & Events
          </h2>
          
          <div className="space-y-4">
            {newsEvents.map((event, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className={`w-3 h-3 rounded-full mt-2 ${
                  event.sentiment === 'positive' ? 'bg-green-500' :
                  event.sentiment === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                }`} />
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      event.sentiment === 'positive' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' :
                      event.sentiment === 'negative' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-200'
                    }`}>
                      {event.sentiment}
                    </span>
                  </div>
                  
                  <p className="text-gray-900 dark:text-white font-medium mb-2">
                    {event.headline}
                  </p>
                  
                  <a
                    href={event.url}
                    className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                  >
                    <span>Read more</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetail;