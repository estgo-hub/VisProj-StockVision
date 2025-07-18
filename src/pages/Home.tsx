import React, { useState, useMemo } from 'react';
import { useStock } from '../contexts/StockContext';
import { useTheme } from '../contexts/ThemeContext';
import StockCard from '../components/StockCard';
import SearchBar from '../components/SearchBar';
import { Stock } from '../types';
import { Heart, TrendingUp, Filter, SortAsc, SortDesc, Globe, Building, Award, BarChart3, PieChart, Activity, DollarSign } from 'lucide-react';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Home: React.FC = () => {
  const { stocks, favorites } = useStock();
  const { theme } = useTheme();
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'change'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const isDarkMode = theme === 'dark';

  const chartColors = {
    primary: '#3B82F6',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    purple: '#8B5CF6',
    teal: '#06B6D4',
    lime: '#84CC16',
    orange: '#F97316',
    pink: '#EC4899',
    gray: '#6B7280'
  };

  const favoriteStocks = useMemo(() => {
    return stocks.filter(stock => favorites.has(stock.id));
  }, [stocks, favorites]);

  const displayStocks = useMemo(() => {
    const stocksToShow = showFavoritesOnly ? favoriteStocks : stocks;
    
    return stocksToShow.sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'change':
          aValue = a.changePercent;
          bValue = b.changePercent;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [stocks, favoriteStocks, showFavoritesOnly, sortBy, sortOrder]);

  const marketStats = useMemo(() => {
    const totalStocks = stocks.length;
    const gainers = stocks.filter(s => s.change > 0).length;
    const losers = stocks.filter(s => s.change < 0).length;
    const avgChange = stocks.reduce((sum, s) => sum + s.changePercent, 0) / totalStocks;
    const totalMarketCap = stocks.reduce((sum, s) => sum + s.marketCap, 0);
    
    return { totalStocks, gainers, losers, avgChange, totalMarketCap };
  }, [stocks]);

  const topPerformingCountries = useMemo(() => {
    const countryPerformance = new Map<string, { totalChange: number, count: number, stocks: Stock[], totalMarketCap: number }>();
    
    stocks.forEach(stock => {
      const existing = countryPerformance.get(stock.country) || { totalChange: 0, count: 0, stocks: [], totalMarketCap: 0 };
      existing.totalChange += stock.changePercent;
      existing.count += 1;
      existing.stocks.push(stock);
      existing.totalMarketCap += stock.marketCap;
      countryPerformance.set(stock.country, existing);
    });

    return Array.from(countryPerformance.entries())
      .map(([country, data]) => ({
        country,
        avgChange: data.totalChange / data.count,
        stockCount: data.count,
        totalMarketCap: data.totalMarketCap,
        topStock: data.stocks.reduce((best, stock) => 
          stock.changePercent > best.changePercent ? stock : best
        )
      }))
      .sort((a, b) => b.avgChange - a.avgChange)
      .slice(0, 3);
  }, [stocks]);

  const topPerformingSectors = useMemo(() => {
    const sectorPerformance = new Map<string, { totalChange: number, count: number, stocks: Stock[], totalMarketCap: number }>();
    
    stocks.forEach(stock => {
      const existing = sectorPerformance.get(stock.sector) || { totalChange: 0, count: 0, stocks: [], totalMarketCap: 0 };
      existing.totalChange += stock.changePercent;
      existing.count += 1;
      existing.stocks.push(stock);
      existing.totalMarketCap += stock.marketCap;
      sectorPerformance.set(stock.sector, existing);
    });

    return Array.from(sectorPerformance.entries())
      .map(([sector, data]) => ({
        sector,
        avgChange: data.totalChange / data.count,
        stockCount: data.count,
        totalMarketCap: data.totalMarketCap,
        topStock: data.stocks.reduce((best, stock) => 
          stock.changePercent > best.changePercent ? stock : best
        )
      }))
      .sort((a, b) => b.avgChange - a.avgChange)
      .slice(0, 3);
  }, [stocks]);

  const industryMarketCapData = useMemo(() => {
    const industryMap = new Map<string, number>();
    stocks.forEach(stock => {
      industryMap.set(stock.industry, (industryMap.get(stock.industry) || 0) + stock.marketCap);
    });

    const sortedIndustries = Array.from(industryMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8); // Top 8 industries to keep chart readable

    return {
      labels: sortedIndustries.map(([industry]) => industry.length > 20 ? industry.substring(0, 20) + '...' : industry),
      datasets: [{
        label: 'Market Cap (Billions)',
        data: sortedIndustries.map(([, marketCap]) => marketCap / 1e9),
        backgroundColor: [
          chartColors.primary,
          chartColors.success,
          chartColors.warning,
          chartColors.purple,
          chartColors.teal,
          chartColors.orange,
          chartColors.pink,
          chartColors.gray
        ],
        borderColor: sortedIndustries.map(() => isDarkMode ? '#374151' : '#ffffff'),
        borderWidth: 1,
      }]
    };
  }, [stocks, isDarkMode]);

  // Chart data for sector distribution
  const sectorDistributionData = useMemo(() => {
    const sectorCounts = new Map<string, number>();
    stocks.forEach(stock => {
      sectorCounts.set(stock.sector, (sectorCounts.get(stock.sector) || 0) + 1);
    });

    const sortedSectors = Array.from(sectorCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    return {
      labels: sortedSectors.map(([sector]) => sector),
      datasets: [{
        data: sortedSectors.map(([, count]) => count),
        backgroundColor: [
          chartColors.primary,
          chartColors.success,
          chartColors.warning,
          chartColors.purple,
          chartColors.teal,
          chartColors.orange
        ],
        borderColor: isDarkMode ? '#374151' : '#ffffff',
        borderWidth: 2,
      }]
    };
  }, [stocks, isDarkMode]);

  // Chart data for performance comparison
  const performanceComparisonData = useMemo(() => {
    // Get top 5 gainers and top 5 losers, sorted properly
    const sortedStocks = [...stocks].sort((a, b) => b.changePercent - a.changePercent);
    const topGainers = sortedStocks.slice(0, 5);
    const topLosers = sortedStocks.slice(-5).reverse(); // Get worst 5 and reverse to show worst first
    
    // Combine and sort by performance (best to worst)
    const allStocks = [...topGainers, ...topLosers].sort((a, b) => b.changePercent - a.changePercent);

    return {
      labels: allStocks.map(s => s.ticker),
      datasets: [{
        label: 'Performance %',
        data: allStocks.map(s => s.changePercent),
        backgroundColor: allStocks.map(s => {
          if (s.changePercent >= 3) return chartColors.success;
          if (s.changePercent >= 0) return '#86efac'; // Light green
          if (s.changePercent >= -3) return '#fca5a5'; // Light red
          return chartColors.danger;
        }),
        borderColor: allStocks.map(s => {
          if (s.changePercent >= 0) return chartColors.success;
          return chartColors.danger;
        }),
        borderWidth: 1,
      }]
    };
  }, [stocks]);

  // Chart data for market cap distribution
  const marketCapTrendData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    });

    // Simulate market trend data
    const trendData = last7Days.map((_, index) => {
      const baseValue = marketStats.avgChange;
      const variation = (Math.random() - 0.5) * 2;
      return baseValue + variation + (index * 0.1);
    });

    return {
      labels: last7Days,
      datasets: [{
        label: 'Market Trend %',
        data: trendData,
        borderColor: chartColors.primary,
        backgroundColor: `${chartColors.primary}20`,
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: chartColors.primary,
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
      }]
    };
  }, [marketStats.avgChange]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
        titleColor: isDarkMode ? '#e5e7eb' : '#374151',
        bodyColor: isDarkMode ? '#e5e7eb' : '#374151',
        borderColor: isDarkMode ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y || 0;
            const stock = context.label;
            return `${stock}: ${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: isDarkMode ? '#374151' : '#e5e7eb',
          display: false
        },
        ticks: {
          color: isDarkMode ? '#e5e7eb' : '#374151',
        }
      },
      y: {
        grid: {
          color: isDarkMode ? '#374151' : '#e5e7eb',
          display: true
        },
        ticks: {
          color: isDarkMode ? '#e5e7eb' : '#374151',
          callback: (value: any) => `${value >= 0 ? '+' : ''}${value}%`
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: isDarkMode ? '#e5e7eb' : '#374151',
          padding: 15,
          usePointStyle: true,
        }
      },
      tooltip: {
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
        titleColor: isDarkMode ? '#e5e7eb' : '#374151',
        bodyColor: isDarkMode ? '#e5e7eb' : '#374151',
        borderColor: isDarkMode ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
      }
    }
  };

  // Specific options for Market Trend chart
  const marketTrendOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      y: {
        ...chartOptions.scales.y,
        ticks: {
          ...chartOptions.scales.y.ticks,
          callback: (value: any) => `${value >= 0 ? '+' : ''}${Number(value).toFixed(1)}%`
        }
      }
    },
    plugins: {
      ...chartOptions.plugins,
      tooltip: {
        ...chartOptions.plugins.tooltip,
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y || 0;
            const day = context.label;
            return `${day}: ${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
          }
        }
      }
    }
  };

  // Specific options for Industry Market Cap chart
  const industryMarketCapOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      y: {
        ...chartOptions.scales.y,
        ticks: {
          ...chartOptions.scales.y.ticks,
          callback: (value: any) => `$${Number(value).toFixed(0)}B`
        }
      }
    },
    plugins: {
      ...chartOptions.plugins,
      tooltip: {
        ...chartOptions.plugins.tooltip,
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y || 0;
            const industry = context.label;
            return `${industry}: $${value.toFixed(1)}B market cap`;
          }
        }
      }
    }
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

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock);
    // Navigate to stock detail page
    window.location.href = `/stock/${stock.id}`;
  };

  const toggleSort = (field: 'name' | 'price' | 'change') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Market Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your favorite stocks and monitor market performance
          </p>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Stocks</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {marketStats.totalStocks}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Market Cap</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatMarketCap(marketStats.totalMarketCap)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Gainers</p>
                <p className="text-2xl font-bold text-green-600">
                  {marketStats.gainers}
                </p>
              </div>
              <div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Losers</p>
                <p className="text-2xl font-bold text-red-600">
                  {marketStats.losers}
                </p>
              </div>
              <div className="h-8 w-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-red-600 rotate-180" />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Change</p>
                <p className={`text-2xl font-bold ${
                  marketStats.avgChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {marketStats.avgChange >= 0 ? '+' : ''}{marketStats.avgChange.toFixed(2)}%
                </p>
              </div>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                marketStats.avgChange >= 0 
                  ? 'bg-green-100 dark:bg-green-900' 
                  : 'bg-red-100 dark:bg-red-900'
              }`}>
                <TrendingUp className={`h-5 w-5 ${
                  marketStats.avgChange >= 0 ? 'text-green-600' : 'text-red-600 rotate-180'
                }`} />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8 mb-8">
          {/* Sector Distribution Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <PieChart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Sector Distribution
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Stock count by sector
                </p>
              </div>
            </div>
            <div className="h-64">
              <Doughnut data={sectorDistributionData} options={doughnutOptions} />
            </div>
          </div>

          {/* Performance Comparison Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <BarChart3 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Top Performers
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Best & worst performers
                </p>
              </div>
            </div>
            <div className="h-64">
              <Bar data={performanceComparisonData} options={chartOptions} />
            </div>
          </div>

          {/* Market Trend Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Market Trend
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  7-day performance trend
                </p>
              </div>
            </div>
            <div className="h-64">
              <Line data={marketCapTrendData} options={marketTrendOptions} />
            </div>
          </div>

          {/* Industry Market Cap Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <Building className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Industry Market Cap
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Top industries by value
                </p>
              </div>
            </div>
            <div className="h-64">
              <Bar data={industryMarketCapData} options={industryMarketCapOptions} />
            </div>
          </div>
        </div>

        {/* Top Performers Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Performing Countries */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Top Performing Countries
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Average performance by country
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              {topPerformingCountries.map((country, index) => (
                <div key={country.country} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {country.country}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {country.stockCount} stocks • {formatMarketCap(country.totalMarketCap)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Best: {country.topStock.ticker}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      country.avgChange >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {country.avgChange >= 0 ? '+' : ''}{country.avgChange.toFixed(2)}%
                    </p>
                    <div className="flex items-center space-x-1">
                      {country.avgChange >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
                      )}
                      <span className="text-xs text-gray-500 dark:text-gray-400">avg</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performing Sectors */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Building className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Top Performing Sectors
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Average performance by sector
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              {topPerformingSectors.map((sector, index) => (
                <div key={sector.sector} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-full text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {sector.sector}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {sector.stockCount} stocks • {formatMarketCap(sector.totalMarketCap)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Best: {sector.topStock.ticker}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      sector.avgChange >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {sector.avgChange >= 0 ? '+' : ''}{sector.avgChange.toFixed(2)}%
                    </p>
                    <div className="flex items-center space-x-1">
                      {sector.avgChange >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
                      )}
                      <span className="text-xs text-gray-500 dark:text-gray-400">avg</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <SearchBar 
              onSelect={handleStockSelect}
              placeholder="Search stocks by ticker or name..."
              className="flex-1 max-w-md"
            />
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  showFavoritesOnly
                    ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                }`}
              >
                <Heart className={`h-4 w-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                <span>Favorites Only</span>
              </button>
              
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                >
                  <option value="name">Name</option>
                  <option value="price">Price</option>
                  <option value="change">Change</option>
                </select>
                
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  {sortOrder === 'asc' ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayStocks.map((stock) => (
            <StockCard
              key={stock.id}
              stock={stock}
              onClick={handleStockSelect}
            />
          ))}
        </div>

        {displayStocks.length === 0 && (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {showFavoritesOnly 
                ? "No favorite stocks yet. Add some stocks to your watchlist!" 
                : "No stocks found."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;