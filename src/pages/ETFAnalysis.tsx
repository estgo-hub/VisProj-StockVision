import React, { useState, useMemo } from 'react';
import { useStock } from '../contexts/StockContext';
import { useTheme } from '../contexts/ThemeContext';
import { ETF, ETFHolding } from '../types';
import { Pie, Doughnut, Bar, Line, Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement } from 'chart.js';
import { 
  PieChart, 
  Globe, 
  Building, 
  MapPin, 
  TrendingUp, 
  Heart, 
  X, 
  List, 
  BarChart3,
  Activity,
  Target,
  Zap,
  GitCompare,
  Layers,
  Filter,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import TreemapChart from '../components/TreemapChart';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, LineElement, PointElement);

const ETFAnalysis: React.FC = () => {
  const { etfs, stocks, favorites } = useStock();
  const { theme } = useTheme();
  const [selectedETF, setSelectedETF] = useState<ETF | null>(etfs[0] || null);
  const [viewMode, setViewMode] = useState<'sector' | 'country' | 'holdings' | 'comparison' | 'overlap'>('sector');
  const [showHoldingsList, setShowHoldingsList] = useState(false);
  const [filteredHoldings, setFilteredHoldings] = useState<ETFHolding[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterType, setFilterType] = useState<'sector' | 'country'>('sector');
  const [showTreemap, setShowTreemap] = useState(false);
  const [selectedETFsForComparison, setSelectedETFsForComparison] = useState<ETF[]>([]);
  const [comparisonMetric, setComparisonMetric] = useState<'expense' | 'performance' | 'size' | 'volatility'>('expense');

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

  // ETF Comparison Logic
  const handleETFComparisonToggle = (etf: ETF) => {
    setSelectedETFsForComparison(prev => {
      const exists = prev.find(e => e.id === etf.id);
      if (exists) {
        return prev.filter(e => e.id !== etf.id);
      } else if (prev.length < 4) { // Limit to 4 ETFs for comparison
        return [...prev, etf];
      }
      return prev;
    });
  };

  // Calculate ETF overlap
  const calculateETFOverlap = useMemo(() => {
    if (selectedETFsForComparison.length < 2) return [];
    
    const overlaps: Array<{
      etf1: ETF;
      etf2: ETF;
      commonHoldings: ETFHolding[];
      overlapPercentage: number;
    }> = [];

    for (let i = 0; i < selectedETFsForComparison.length; i++) {
      for (let j = i + 1; j < selectedETFsForComparison.length; j++) {
        const etf1 = selectedETFsForComparison[i];
        const etf2 = selectedETFsForComparison[j];
        
        const etf1Tickers = new Set(etf1.holdings.map(h => h.ticker));
        const commonHoldings = etf2.holdings.filter(h => etf1Tickers.has(h.ticker));
        
        // Calculate overlap percentage based on weight
        const etf1TotalWeight = etf1.holdings.reduce((sum, h) => sum + h.weight, 0);
        const etf2TotalWeight = etf2.holdings.reduce((sum, h) => sum + h.weight, 0);
        const commonWeight = commonHoldings.reduce((sum, h) => {
          const etf1Holding = etf1.holdings.find(h1 => h1.ticker === h.ticker);
          return sum + Math.min(h.weight, etf1Holding?.weight || 0);
        }, 0);
        
        const overlapPercentage = (commonWeight / Math.min(etf1TotalWeight, etf2TotalWeight)) * 100;
        
        overlaps.push({
          etf1,
          etf2,
          commonHoldings,
          overlapPercentage
        });
      }
    }
    
    return overlaps.sort((a, b) => b.overlapPercentage - a.overlapPercentage);
  }, [selectedETFsForComparison]);

  // Comparison chart data
  const comparisonChartData = useMemo(() => {
    if (selectedETFsForComparison.length === 0) return null;

    let data: number[];
    let label: string;
    
    switch (comparisonMetric) {
      case 'expense':
        data = selectedETFsForComparison.map(etf => etf.expenseRatio);
        label = 'Expense Ratio (%)';
        break;
      case 'performance':
        data = selectedETFsForComparison.map(etf => etf.changePercent);
        label = 'Performance (%)';
        break;
      case 'size':
        data = selectedETFsForComparison.map(etf => etf.marketCap / 1e9);
        label = 'Market Cap (Billions)';
        break;
      case 'volatility':
        data = selectedETFsForComparison.map(() => Math.random() * 20 + 5); // Mock volatility data
        label = 'Volatility (%)';
        break;
      default:
        data = selectedETFsForComparison.map(etf => etf.expenseRatio);
        label = 'Expense Ratio (%)';
    }

    return {
      labels: selectedETFsForComparison.map(etf => etf.ticker),
      datasets: [{
        label,
        data,
        backgroundColor: chartColors.slice(0, selectedETFsForComparison.length),
        borderColor: chartColors.slice(0, selectedETFsForComparison.length),
        borderWidth: 2,
      }]
    };
  }, [selectedETFsForComparison, comparisonMetric]);

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

  const barChartOptions = {
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
          callback: (value: any) => {
            if (comparisonMetric === 'size') return `$${value}B`;
            return `${value}${comparisonMetric === 'expense' || comparisonMetric === 'performance' || comparisonMetric === 'volatility' ? '%' : ''}`;
          }
        }
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
            { key: 'holdings', label: 'Top Holdings', icon: PieChart },
            { key: 'comparison', label: 'ETF Comparison', icon: GitCompare },
            { key: 'overlap', label: 'Holdings Overlap', icon: Layers },
            { key: 'treemap', label: 'Treemap View', icon: List }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => {
                if (key === 'treemap') {
                  setShowTreemap(true);
                  setViewMode('sector');
                } else {
                  setViewMode(key as any);
                  setShowTreemap(false);
                }
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                (viewMode === key && !showTreemap) || (key === 'treemap' && showTreemap)
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* ETF Comparison Mode */}
        {viewMode === 'comparison' && (
          <div className="space-y-8">
            {/* ETF Selection for Comparison */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Select ETFs for Comparison
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Choose up to 4 ETFs to compare their key metrics
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <select
                    value={comparisonMetric}
                    onChange={(e) => setComparisonMetric(e.target.value as any)}
                    className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                  >
                    <option value="expense">Expense Ratio</option>
                    <option value="performance">Performance</option>
                    <option value="size">Market Cap</option>
                    <option value="volatility">Volatility</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {etfs.map(etf => (
                  <div
                    key={etf.id}
                    className={`p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                      selectedETFsForComparison.find(e => e.id === etf.id)
                        ? 'bg-blue-100 border-blue-500 dark:bg-blue-900 dark:border-blue-400'
                        : 'bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                    onClick={() => handleETFComparisonToggle(etf)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {etf.ticker}
                      </span>
                      {selectedETFsForComparison.find(e => e.id === etf.id) && (
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {etf.name}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Expense: </span>
                        <span className="font-medium text-gray-900 dark:text-white">{etf.expenseRatio}%</span>
                      </div>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400">Performance: </span>
                        <span className={`font-medium ${etf.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {etf.changePercent >= 0 ? '+' : ''}{etf.changePercent.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedETFsForComparison.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Selected ETFs ({selectedETFsForComparison.length}/4):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedETFsForComparison.map(etf => (
                      <span
                        key={etf.id}
                        className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                      >
                        <span>{etf.ticker}</span>
                        <button
                          onClick={() => handleETFComparisonToggle(etf)}
                          className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Comparison Chart */}
            {selectedETFsForComparison.length > 0 && comparisonChartData && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  ETF Comparison - {comparisonMetric.charAt(0).toUpperCase() + comparisonMetric.slice(1)}
                </h3>
                <div className="h-80">
                  <Bar data={comparisonChartData} options={barChartOptions} />
                </div>
              </div>
            )}

            {/* Comparison Table */}
            {selectedETFsForComparison.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Detailed Comparison
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">ETF</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Price</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Performance</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Expense Ratio</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Market Cap</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">Holdings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedETFsForComparison.map((etf, index) => (
                        <tr key={etf.id} className="border-b border-gray-100 dark:border-gray-700">
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <div 
                                className="w-4 h-4 rounded-full"
                                style={{ backgroundColor: chartColors[index] }}
                              />
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{etf.ticker}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{etf.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="text-right py-3 px-4 text-gray-900 dark:text-white">
                            ${etf.price.toFixed(2)}
                          </td>
                          <td className={`text-right py-3 px-4 font-medium ${
                            etf.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {etf.changePercent >= 0 ? '+' : ''}{etf.changePercent.toFixed(2)}%
                          </td>
                          <td className="text-right py-3 px-4 text-gray-900 dark:text-white">
                            {etf.expenseRatio}%
                          </td>
                          <td className="text-right py-3 px-4 text-gray-900 dark:text-white">
                            ${(etf.marketCap / 1e9).toFixed(1)}B
                          </td>
                          <td className="text-right py-3 px-4 text-gray-900 dark:text-white">
                            {etf.totalHoldings}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Holdings Overlap Mode */}
        {viewMode === 'overlap' && (
          <div className="space-y-8">
            {/* Instructions */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <Info className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    ETF Holdings Overlap Analysis
                  </h3>
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    Select multiple ETFs in the comparison section above to analyze which stocks they have in common. 
                    This helps identify portfolio overlap and diversification opportunities.
                  </p>
                </div>
              </div>
            </div>

            {/* Overlap Results */}
            {calculateETFOverlap.length > 0 ? (
              <div className="space-y-6">
                {calculateETFOverlap.map((overlap, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {overlap.etf1.ticker} vs {overlap.etf2.ticker}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {overlap.commonHoldings.length} common holdings • {overlap.overlapPercentage.toFixed(1)}% overlap
                        </p>
                      </div>
                      
                      <div className="text-right">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          overlap.overlapPercentage > 50 ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                          overlap.overlapPercentage > 25 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {overlap.overlapPercentage > 50 ? 'High Overlap' :
                           overlap.overlapPercentage > 25 ? 'Medium Overlap' : 'Low Overlap'}
                        </div>
                      </div>
                    </div>

                    {/* Common Holdings */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 dark:text-white">Common Holdings:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {overlap.commonHoldings.slice(0, 12).map((holding) => {
                          const etf1Holding = overlap.etf1.holdings.find(h => h.ticker === holding.ticker);
                          const stockId = tickerToIdMap.get(holding.ticker);
                          const isFavorite = stockId && favorites.has(stockId);
                          
                          return (
                            <div key={holding.ticker} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {holding.ticker}
                                </span>
                                {isFavorite && (
                                  <Heart className="h-4 w-4 text-red-500 fill-current" />
                                )}
                              </div>
                              <div className="text-right text-sm">
                                <div className="text-gray-600 dark:text-gray-400">
                                  {overlap.etf1.ticker}: {etf1Holding?.weight.toFixed(1)}%
                                </div>
                                <div className="text-gray-600 dark:text-gray-400">
                                  {overlap.etf2.ticker}: {holding.weight.toFixed(1)}%
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {overlap.commonHoldings.length > 12 && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                          ... and {overlap.commonHoldings.length - 12} more common holdings
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-12 shadow-lg text-center">
                <Layers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No ETFs Selected for Overlap Analysis
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Select at least 2 ETFs in the comparison section to analyze their holdings overlap.
                </p>
                <button
                  onClick={() => setViewMode('comparison')}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <GitCompare className="h-4 w-4" />
                  <span>Go to ETF Comparison</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Content based on view mode */}
        {showTreemap && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Holdings Treemap
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Hierarchical view: Sector → Industry → Individual Holdings
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Size represents weight, color represents simulated performance (-5% to +5%)
                </p>
              </div>
              
              {/* Legend */}
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">Performance:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">-5%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">0%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">+5%</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <TreemapChart
                holdings={selectedETF.holdings}
                width={Math.min(1000, window.innerWidth - 200)}
                height={600}
                darkMode={isDarkMode}
                onHoldingClick={(holding) => {
                  console.log('Clicked holding:', holding);
                  // You could navigate to stock detail or show more info
                }}
              />
            </div>
          </div>
        )}

        {!showTreemap && viewMode === 'sector' && sectorData && (
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

        {!showTreemap && viewMode === 'country' && countryData && (
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

        {!showTreemap && viewMode === 'holdings' && (
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