import React, { useState, useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import PriceChart from './PriceChart';
import CandlestickChart from './CandlestickChart';
import VolumeChart from './VolumeChart';
import MovingAverageChart from './MovingAverageChart';
import RSIChart from './RSIChart';
import SearchBar from './SearchBar';
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
  MapPin,
  Globe,
  BarChart3,
  ChevronDown,
  LineChart,
  BarChart,
  TrendingUp as TrendingUpIcon,
  Activity,
  X
} from 'lucide-react';
import { useStock } from '../contexts/StockContext';

type ChartType = 'line' | 'candlestick' | 'volume' | 'moving-average' | 'rsi';

interface StockDetailPanelProps {
  stock: Stock;
  onClose: () => void;
  onStockSelect: (stock: Stock) => void;
}

const StockDetailPanel: React.FC<StockDetailPanelProps> = ({ 
  stock, 
  onClose, 
  onStockSelect 
}) => {
  const { favorites, toggleFavorite } = useStock();
  const { theme } = useTheme();
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    end: new Date()
  });
  const [timeframe, setTimeframe] = useState<'1H' | '1D' | '1W' | '1M' | '3M' | '6M' | '1Y'>('1M');
  const [chartType, setChartType] = useState<ChartType>('line');
  const [showChartDropdown, setShowChartDropdown] = useState(false);

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

  const handleTimeframeChange = (newTimeframe: typeof timeframe) => {
    setTimeframe(newTimeframe);
  };

  const handleChartTypeChange = (newChartType: ChartType) => {
    setChartType(newChartType);
    setShowChartDropdown(false);
  };

  const chartTypeOptions = [
    { value: 'line', label: 'Line Chart', icon: LineChart, description: 'Simple price trend' },
    { value: 'candlestick', label: 'OHLC Chart', icon: BarChart, description: 'Open, High, Low, Close' },
    { value: 'volume', label: 'Volume Chart', icon: BarChart3, description: 'Trading volume analysis' },
    { value: 'moving-average', label: 'Moving Averages', icon: TrendingUpIcon, description: 'MA 5, 10, 20 periods' },
    { value: 'rsi', label: 'RSI Indicator', icon: Activity, description: 'Relative Strength Index' }
  ] as const;

  const getCurrentChartOption = () => {
    return chartTypeOptions.find(option => option.value === chartType) || chartTypeOptions[0];
  };

  const renderChart = () => {
    const commonProps = {
      data: priceData,
      height: 400,
      darkMode: theme === 'dark'
    };

    switch (chartType) {
      case 'candlestick':
        return <CandlestickChart {...commonProps} />;
      case 'volume':
        return <VolumeChart {...commonProps} />;
      case 'moving-average':
        return <MovingAverageChart {...commonProps} />;
      case 'rsi':
        return <RSIChart {...commonProps} />;
      default:
        return <PriceChart {...commonProps} newsEvents={newsEvents} />;
    }
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

  const isFavorite = favorites.has(stock.id);

  return (
    <div className="fixed inset-y-0 right-0 w-full lg:w-2/3 xl:w-1/2 bg-gray-50 dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
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
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                {stock.name}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center space-x-1">
                  <Building className="h-4 w-4" />
                  <span>{stock.sector}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Globe className="h-4 w-4" />
                  <span>{stock.exchange}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{stock.region}</span>
                </span>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {formatPrice(stock.price)}
              </p>
              <div className={`flex items-center space-x-2 ${
                stock.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {stock.change >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span className="font-medium">
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                </span>
                <span>
                  ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                </span>
              </div>
              {stock.lastUpdated && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Updated: {new Date(stock.lastUpdated).toLocaleString()}
                </p>
              )}
            </div>
          </div>
          
          <div className="max-w-md">
            <SearchBar 
              onSelect={onStockSelect}
              placeholder="Search for another stock..."
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-6">
          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
              <div className="flex items-center space-x-3 mb-2">
                <DollarSign className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Market Cap</span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {formatMarketCap(stock.marketCap)}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
              <div className="flex items-center space-x-3 mb-2">
                <Volume2 className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Volume</span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {formatVolume(stock.volume)}
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
              <div className="flex items-center space-x-3 mb-2">
                <Building className="h-4 w-4 text-purple-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Industry</span>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {stock.industry}
              </p>
            </div>

            {stock.peRatio && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                <div className="flex items-center space-x-3 mb-2">
                  <BarChart3 className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">P/E Ratio</span>
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {stock.peRatio.toFixed(1)}
                </p>
              </div>
            )}
          </div>

          {/* Chart Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {getCurrentChartOption().label}
                </h2>
                
                {/* Chart Type Dropdown */}
                <div className="relative">
                  {(() => {
                    const IconComponent = getCurrentChartOption().icon;
                    return (
                  <button
                    onClick={() => setShowChartDropdown(!showChartDropdown)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                      <IconComponent className="h-4 w-4" />
                    <span className="text-sm font-medium">Chart Type</span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${showChartDropdown ? 'rotate-180' : ''}`} />
                  </button>
                    );
                  })()}
                  
                  {showChartDropdown && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50">
                      {chartTypeOptions.map((option) => (
                        (() => {
                          const OptionIcon = option.icon;
                          return (
                        <button
                          key={option.value}
                          onClick={() => handleChartTypeChange(option.value)}
                          className={`w-full flex items-start space-x-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                            chartType === option.value ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-500' : ''
                          }`}
                        >
                            <OptionIcon className={`h-5 w-5 mt-0.5 ${
                            chartType === option.value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                          }`} />
                          <div>
                            <p className={`font-medium ${
                              chartType === option.value ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'
                            }`}>
                              {option.label}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {option.description}
                            </p>
                          </div>
                        </button>
                          );
                        })()
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Timeframe Controls */}
              <div className="flex items-center space-x-2 flex-wrap">
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
            
            {/* Chart Description */}
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium text-gray-900 dark:text-white">
                  {getCurrentChartOption().label}:
                </span>{' '}
                {getCurrentChartOption().description}
                {chartType === 'rsi' && ' - Values above 70 indicate overbought conditions, below 30 indicate oversold conditions.'}
                {chartType === 'moving-average' && ' - Helps identify trend direction and potential support/resistance levels.'}
                {chartType === 'volume' && ' - Green bars indicate price increase, red bars indicate price decrease.'}
                {chartType === 'candlestick' && ' - Shows opening, closing, high, and low prices for each period.'}
              </p>
            </div>
            
            {renderChart()}
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
    </div>
  );
};

export default StockDetailPanel;