import React, { useState, useMemo } from 'react';
import { useStock } from '../contexts/StockContext';
import { useTheme } from '../contexts/ThemeContext';
import { ETF, ETFHolding } from '../types';
import { Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { PieChart, Globe, Building, MapPin, TrendingUp, Heart, X, List } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const ETFAnalysis: React.FC = () => {
  const { etfs, stocks, favorites } = useStock();
  const { theme } = useTheme();
  const [selectedETF, setSelectedETF] = useState<ETF | null>(etfs[0] || null);
  const [viewMode, setViewMode] = useState<'sector' | 'country' | 'holdings'>('sector');
  const [showHoldingsList, setShowHoldingsList] = useState(false);
  const [filteredHoldings, setFilteredHoldings] = useState<ETFHolding[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterType, setFilterType] = useState<'sector' | 'country'>('sector');

  const isDarkMode = theme === 'dark';

  const chartColors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280'
  ];

  // Create ticker to ID mapping for favorites
  const tickerToIdMap = useMemo(() => {
    const map = new Map<string, string>();
    stocks.forEach(stock => {
      map.set(stock.ticker, stock.id);
    });
    return map;
  }, [stocks]);

  // Count favorite holdings
  const favoriteHoldingsCount = useMemo(() => {
    if (!selectedETF) return 0;
    return selectedETF.holdings.filter(holding => {
      const stockId = tickerToIdMap.get(holding.ticker);
      return stockId && favorites.has(stockId);
    }).length;
  }, [selectedETF, tickerToIdMap, favorites]);

  const sectorData = useMemo(() => {
    if (!selectedETF) return null;

    const sectorMap = new Map<string, number>();
    selectedETF.holdings.forEach(holding => {
      const current = sectorMap.get(holding.sector) || 0;
      sectorMap.set(holding.sector, current + holding.weight);
    });

    const sortedSectors = Array.from(sectorMap.entries())
      .sort((a, b) => b[1] - a[1]);

    return {
      labels: sortedSectors.map(([sector]) => sector),
      datasets: [{
        data: sortedSectors.map(([, weight]) => weight),
        backgroundColor: chartColors.slice(0, sortedSectors.length),
        borderColor: isDarkMode ? '#374151' : '#ffffff',
        borderWidth: 2,
      }]
    };
  }, [selectedETF, isDarkMode]);

  const countryData = useMemo(() => {
    if (!selectedETF) return null;

    const countryMap = new Map<string, number>();
    selectedETF.holdings.forEach(holding => {
      const current = countryMap.get(holding.country) || 0;
      countryMap.set(holding.country, current + holding.weight);
    });

    const sortedCountries = Array.from(countryMap.entries())
      .sort((a, b) => b[1] - a[1]);

    return {
      labels: sortedCountries.map(([country]) => country),
      datasets: [{
        data: sortedCountries.map(([, weight]) => weight),
        backgroundColor: chartColors.slice(0, sortedCountries.length),
        borderColor: isDarkMode ? '#374151' : '#ffffff',
        borderWidth: 2,
      }]
    };
  }, [selectedETF, isDarkMode]);

  const handleChartClick = (event: any, elements: any[], chartType: 'sector' | 'country') => {
    if (elements.length > 0 && selectedETF) {
      const elementIndex = elements[0].index;
      const data = chartType === 'sector' ? sectorData : countryData;
      
      if (data) {
        const category = data.labels[elementIndex];
        const filtered = selectedETF.holdings.filter(holding => 
          chartType === 'sector' ? holding.sector === category : holding.country === category
        );
        
        setFilteredHoldings(filtered);
        setFilterCategory(category);
        setFilterType(chartType);
        setShowHoldingsList(true);
      }
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: isDarkMode ? '#e5e7eb' : '#374151',
          padding: 20,
          usePointStyle: true,
        }
      },
      tooltip: {
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
        titleColor: isDarkMode ? '#e5e7eb' : '#374151',
        bodyColor: isDarkMode ? '#e5e7eb' : '#374151',
        borderColor: isDarkMode ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ${value.toFixed(2)}%`;
          }
        }
      }
    },
    onClick: (event: any, elements: any[]) => {
      if (viewMode === 'sector') {
        handleChartClick(event, elements, 'sector');
      } else if (viewMode === 'country') {
        handleChartClick(event, elements, 'country');
      }
    }
  };

  if (!selectedETF) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              ETF Analysis
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              No ETFs available for analysis
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            ETF Analysis
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Analyze ETF holdings breakdown by sector, country, and individual positions
          </p>
        </div>

        {/* ETF Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Select ETF
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {etfs.map(etf => (
              <button
                key={etf.id}
                onClick={() => setSelectedETF(etf)}
                className={`p-4 rounded-lg text-left transition-colors ${
                  selectedETF?.id === etf.id
                    ? 'bg-blue-100 border-2 border-blue-500 dark:bg-blue-900 dark:border-blue-400'
                    : 'bg-gray-50 border-2 border-gray-200 dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {etf.ticker}
                  </span>
                  <span className={`text-sm ${
                    etf.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {etf.changePercent >= 0 ? '+' : ''}{etf.changePercent.toFixed(2)}%
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {etf.name}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    {etf.totalHoldings} holdings
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {etf.expenseRatio}% expense ratio
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ETF Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedETF.ticker}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {selectedETF.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${selectedETF.price.toFixed(2)}
              </p>
              <p className={`text-sm ${
                selectedETF.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {selectedETF.change >= 0 ? '+' : ''}{selectedETF.change.toFixed(2)} 
                ({selectedETF.changePercent >= 0 ? '+' : ''}{selectedETF.changePercent.toFixed(2)}%)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Building className="h-5 w-5 text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Holdings</span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedETF.totalHoldings}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Expense Ratio</span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedETF.expenseRatio}%
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Globe className="h-5 w-5 text-purple-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Market Cap</span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                ${(selectedETF.marketCap / 1e9).toFixed(1)}B
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <PieChart className="h-5 w-5 text-orange-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Volume</span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {(selectedETF.volume / 1e6).toFixed(1)}M
              </p>
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          {[
            { key: 'sector', label: 'Sector Breakdown', icon: Building },
            { key: 'country', label: 'Country Breakdown', icon: Globe },
            { key: 'holdings', label: 'Top Holdings', icon: PieChart }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setViewMode(key as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                viewMode === key
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Content based on view mode */}
        {viewMode === 'sector' && sectorData && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Sector Allocation
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                (Click on chart segments to view holdings)
              </span>
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-80">
                <Pie data={sectorData} options={chartOptions} />
              </div>
              <div className="space-y-3">
                {sectorData.labels.map((sector, index) => (
                  <div key={sector} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: chartColors[index] }}
                      />
                      <span className="text-gray-900 dark:text-white font-medium">
                        {sector}
                      </span>
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 font-medium">
                      {sectorData.datasets[0].data[index].toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {viewMode === 'country' && countryData && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Geographic Distribution
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                (Click on chart segments to view holdings)
              </span>
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-80">
                <Doughnut data={countryData} options={chartOptions} />
              </div>
              <div className="space-y-3">
                {countryData.labels.map((country, index) => (
                  <div key={country} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: chartColors[index] }}
                      />
                      <span className="text-gray-900 dark:text-white font-medium">
                        {country}
                      </span>
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 font-medium">
                      {countryData.datasets[0].data[index].toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {viewMode === 'holdings' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Top Holdings
              </h3>
              {favoriteHoldingsCount > 0 && (
                <div className="flex items-center space-x-2 bg-red-100 dark:bg-red-900 px-3 py-1 rounded-full">
                  <Heart className="h-4 w-4 text-red-500 fill-current" />
                  <span className="text-sm font-medium text-red-700 dark:text-red-200">
                    {favoriteHoldingsCount} favorite{favoriteHoldingsCount !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
            <div className="space-y-4">
              {selectedETF.holdings.map((holding, index) => {
                const stockId = tickerToIdMap.get(holding.ticker);
                const isFavorite = stockId && favorites.has(stockId);
                
                return (
                  <div key={holding.ticker} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-bold text-gray-400 dark:text-gray-500 w-8">
                        {index + 1}
                      </span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            {holding.ticker}
                          </span>
                          {isFavorite && (
                            <Heart className="h-4 w-4 text-red-500 fill-current" />
                          )}
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {holding.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          <span>{holding.sector}</span>
                          <span>•</span>
                          <span>{holding.country}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {holding.weight.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Holdings List Modal */}
        {showHoldingsList && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {filterCategory} Holdings
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {filteredHoldings.length} holdings in {filterType === 'sector' ? 'sector' : 'country'}
                  </p>
                </div>
                <button
                  onClick={() => setShowHoldingsList(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-3">
                {filteredHoldings.map((holding, index) => {
                  const stockId = tickerToIdMap.get(holding.ticker);
                  const isFavorite = stockId && favorites.has(stockId);
                  
                  return (
                    <div key={holding.ticker} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-6">
                          {index + 1}
                        </span>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-gray-900 dark:text-white">
                              {holding.ticker}
                            </span>
                            {isFavorite && (
                              <Heart className="h-4 w-4 text-red-500 fill-current" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {holding.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-gray-900 dark:text-white">
                          {holding.weight.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ETFAnalysis;