import React, { useState, useMemo } from 'react';
import { useStock } from '../contexts/StockContext';
import { useTheme } from '../contexts/ThemeContext';
import SectorHeatmap from './SectorHeatmap';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { BarChart3, TrendingUp, TrendingDown, Building, Globe, ArrowLeft, PieChart, ChevronRight, Grid3x3, Activity } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

type DrillDownLevel = 'sectors' | 'industries' | 'stocks';
type MarketViewMode = 'summary' | 'correlation';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

const MarketOverview: React.FC = () => {
  const { stocks } = useStock();
  const { theme } = useTheme();
  const [marketViewMode, setMarketViewMode] = useState<MarketViewMode>('summary');
  const [drillDownLevel, setDrillDownLevel] = useState<DrillDownLevel>('sectors');
  const [selectedSector, setSelectedSector] = useState<string>('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');

  const isDarkMode = theme === 'dark';

  const chartColors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280',
    '#F472B6', '#A78BFA', '#34D399', '#FBBF24', '#FB7185'
  ];

  // Calculate sector data
  const sectorData = useMemo(() => {
    const sectorMap = new Map<string, { count: number, totalMarketCap: number, avgChange: number, totalChange: number }>();
    
    stocks.forEach(stock => {
      const existing = sectorMap.get(stock.sector) || { count: 0, totalMarketCap: 0, avgChange: 0, totalChange: 0 };
      existing.count += 1;
      existing.totalMarketCap += stock.marketCap;
      existing.totalChange += stock.changePercent;
      sectorMap.set(stock.sector, existing);
    });

    // Calculate average change for each sector
    sectorMap.forEach((data, sector) => {
      data.avgChange = data.totalChange / data.count;
    });

    return Array.from(sectorMap.entries())
      .map(([sector, data]) => ({
        sector,
        ...data
      }))
      .sort((a, b) => b.totalMarketCap - a.totalMarketCap);
  }, [stocks]);

  // Calculate industry data for selected sector
  const industryData = useMemo(() => {
    if (!selectedSector) return [];
    
    const industryMap = new Map<string, { count: number, totalMarketCap: number, avgChange: number, totalChange: number }>();
    
    stocks.filter(stock => stock.sector === selectedSector).forEach(stock => {
      const existing = industryMap.get(stock.industry) || { count: 0, totalMarketCap: 0, avgChange: 0, totalChange: 0 };
      existing.count += 1;
      existing.totalMarketCap += stock.marketCap;
      existing.totalChange += stock.changePercent;
      industryMap.set(stock.industry, existing);
    });

    // Calculate average change for each industry
    industryMap.forEach((data, industry) => {
      data.avgChange = data.totalChange / data.count;
    });

    return Array.from(industryMap.entries())
      .map(([industry, data]) => ({
        industry,
        ...data
      }))
      .sort((a, b) => b.totalMarketCap - a.totalMarketCap);
  }, [stocks, selectedSector]);

  // Get best and worst stocks for selected industry
  const bestAndWorstStocks = useMemo(() => {
    if (!selectedSector || !selectedIndustry) return { best: [], worst: [] };
    
    const industryStocks = stocks.filter(stock => 
      stock.sector === selectedSector && stock.industry === selectedIndustry
    );
    
    const sorted = [...industryStocks].sort((a, b) => b.changePercent - a.changePercent);
    const best = sorted.slice(0, 10);
    const worst = sorted.slice(-10).reverse();
    
    return { best, worst };
  }, [stocks, selectedSector, selectedIndustry]);

  // Create bar chart data based on current view level
  const barChartData: ChartData = useMemo(() => {
    if (drillDownLevel === 'sectors') {
      return {
        labels: sectorData.map(d => d.sector),
        datasets: [{
          label: 'Market Cap (Billions)',
          data: sectorData.map(d => d.totalMarketCap / 1e9),
          backgroundColor: chartColors.slice(0, sectorData.length),
          borderColor: chartColors.slice(0, sectorData.length),
          borderWidth: 1,
        }]
      };
    } else if (drillDownLevel === 'industries' && selectedSector) {
      return {
        labels: industryData.map(d => d.industry),
        datasets: [{
          label: 'Market Cap (Billions)',
          data: industryData.map(d => d.totalMarketCap / 1e9),
          backgroundColor: chartColors.slice(0, industryData.length),
          borderColor: chartColors.slice(0, industryData.length),
          borderWidth: 1,
        }]
      };
    } else if (drillDownLevel === 'stocks' && selectedIndustry) {
      const allStocks = [...bestAndWorstStocks.best, ...bestAndWorstStocks.worst];
      return {
        labels: allStocks.map(s => s.ticker),
        datasets: [{
          label: 'Market Cap (Billions)',
          data: allStocks.map(s => s.marketCap / 1e9),
          backgroundColor: allStocks.map(s => 
            bestAndWorstStocks.best.includes(s) ? '#10B981' : '#EF4444'
          ),
          borderColor: allStocks.map(s => 
            bestAndWorstStocks.best.includes(s) ? '#10B981' : '#EF4444'
          ),
          borderWidth: 1,
        }]
      };
    }
    
    return { labels: [], datasets: [{ label: '', data: [], backgroundColor: [], borderColor: [], borderWidth: 1 }] };
  }, [drillDownLevel, sectorData, industryData, bestAndWorstStocks, selectedSector, selectedIndustry]);

  // Create country distribution data based on current selection
  const countryData = useMemo(() => {
    let relevantStocks = stocks;
    
    if (drillDownLevel === 'industries' && selectedSector) {
      relevantStocks = stocks.filter(stock => stock.sector === selectedSector);
    } else if (drillDownLevel === 'stocks' && selectedSector && selectedIndustry) {
      relevantStocks = stocks.filter(stock => 
        stock.sector === selectedSector && stock.industry === selectedIndustry
      );
    }
    
    const countryMap = new Map<string, number>();
    relevantStocks.forEach(stock => {
      countryMap.set(stock.country, (countryMap.get(stock.country) || 0) + 1);
    });

    const sortedCountries = Array.from(countryMap.entries())
      .sort((a, b) => b[1] - a[1]);

    const total = relevantStocks.length;
    
    return {
      labels: sortedCountries.map(([country]) => country),
      datasets: [{
        label: 'Percentage',
        data: sortedCountries.map(([, count]) => (count / total) * 100),
        backgroundColor: chartColors.slice(0, sortedCountries.length),
        borderColor: isDarkMode ? '#374151' : '#ffffff',
        borderWidth: 2,
      }]
    };
  }, [stocks, drillDownLevel, selectedSector, selectedIndustry, isDarkMode]);

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
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed.y || 0;
            if (drillDownLevel === 'stocks') {
              const stock = [...bestAndWorstStocks.best, ...bestAndWorstStocks.worst][context.dataIndex];
              return [
                `${label}: $${value.toFixed(1)}B`,
                `Performance: ${stock.changePercent >= 0 ? '+' : ''}${stock.changePercent.toFixed(2)}%`,
                `Type: ${bestAndWorstStocks.best.includes(stock) ? 'Top Performer' : 'Worst Performer'}`
              ];
            }
            return `${label}: $${value.toFixed(1)}B`;
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
          maxRotation: 45,
          minRotation: 0
        }
      },
      y: {
        grid: {
          color: isDarkMode ? '#374151' : '#e5e7eb',
          display: true
        },
        ticks: {
          color: isDarkMode ? '#e5e7eb' : '#374151',
          callback: (value: any) => `$${value}B`
        }
      }
    },
    onClick: (event: any, elements: any[]) => {
      if (elements.length > 0) {
        const elementIndex = elements[0].index;
        
        if (drillDownLevel === 'sectors') {
          const sector = sectorData[elementIndex].sector;
          setSelectedSector(sector);
          setDrillDownLevel('industries');
        } else if (drillDownLevel === 'industries') {
          const industry = industryData[elementIndex].industry;
          setSelectedIndustry(industry);
          setDrillDownLevel('stocks');
        } else if (drillDownLevel === 'stocks') {
          const stock = [...bestAndWorstStocks.best, ...bestAndWorstStocks.worst][elementIndex];
          window.location.href = `/stock/${stock.id}`;
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
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ${value.toFixed(1)}%`;
          }
        }
      }
    }
  };

  const handleBackClick = () => {
    if (drillDownLevel === 'stocks') {
      setSelectedIndustry('');
      setDrillDownLevel('industries');
    } else if (drillDownLevel === 'industries') {
      setSelectedSector('');
      setDrillDownLevel('sectors');
    }
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(1)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(1)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(1)}M`;
    return `$${marketCap.toFixed(0)}`;
  };

  const getCurrentStats = () => {
    if (drillDownLevel === 'sectors') {
      const totalMarketCap = sectorData.reduce((sum, d) => sum + d.totalMarketCap, 0);
      const totalStocks = sectorData.reduce((sum, d) => sum + d.count, 0);
      const avgChange = sectorData.reduce((sum, d) => sum + d.avgChange * d.count, 0) / totalStocks;
      
      return {
        title: 'Market Overview - All Sectors',
        totalValue: totalMarketCap,
        totalCount: totalStocks,
        avgChange,
        items: sectorData.length
      };
    } else if (drillDownLevel === 'industries') {
      const totalMarketCap = industryData.reduce((sum, d) => sum + d.totalMarketCap, 0);
      const totalStocks = industryData.reduce((sum, d) => sum + d.count, 0);
      const avgChange = industryData.reduce((sum, d) => sum + d.avgChange * d.count, 0) / totalStocks;
      
      return {
        title: `${selectedSector} - Industries`,
        totalValue: totalMarketCap,
        totalCount: totalStocks,
        avgChange,
        items: industryData.length
      };
    } else {
      const allStocks = [...bestAndWorstStocks.best, ...bestAndWorstStocks.worst];
      const totalMarketCap = allStocks.reduce((sum, s) => sum + s.marketCap, 0);
      const avgChange = allStocks.reduce((sum, s) => sum + s.changePercent, 0) / allStocks.length;
      
      return {
        title: `${selectedIndustry} - Best & Worst Performers`,
        totalValue: totalMarketCap,
        totalCount: allStocks.length,
        avgChange,
        items: allStocks.length
      };
    }
  };

  const stats = getCurrentStats();

  const renderBreadcrumb = () => (
    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
      <button
        onClick={() => {
          setDrillDownLevel('sectors');
          setSelectedSector('');
          setSelectedIndustry('');
        }}
        className={`hover:text-gray-900 dark:hover:text-white ${
          drillDownLevel === 'sectors' ? 'font-semibold text-gray-900 dark:text-white' : ''
        }`}
      >
        All Sectors
      </button>
      {selectedSector && (
        <>
          <ChevronRight className="h-4 w-4" />
          <button
            onClick={() => {
              setDrillDownLevel('industries');
              setSelectedIndustry('');
            }}
            className={`hover:text-gray-900 dark:hover:text-white ${
              drillDownLevel === 'industries' ? 'font-semibold text-gray-900 dark:text-white' : ''
            }`}
          >
            {selectedSector}
          </button>
        </>
      )}
      {selectedIndustry && (
        <>
          <ChevronRight className="h-4 w-4" />
          <span className="font-semibold text-gray-900 dark:text-white">
            {selectedIndustry}
          </span>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Market Overview
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Interactive market analysis with sector breakdown and correlation analysis
              </p>
            </div>
            
            {drillDownLevel !== 'sectors' && marketViewMode === 'summary' && (
              <button
                onClick={handleBackClick}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            )}
          </div>
          
          {renderBreadcrumb()}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          {[
            { key: 'summary', label: 'Market Summary', icon: BarChart3 },
            { key: 'correlation', label: 'Correlation Matrix', icon: Grid3x3 }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setMarketViewMode(key as MarketViewMode)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                marketViewMode === key
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Market Summary View */}
        {marketViewMode === 'summary' && (
          <>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Value</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatMarketCap(stats.totalValue)}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-2">
              <Building className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {drillDownLevel === 'stocks' ? 'Companies' : 'Total Stocks'}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.totalCount}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-2">
              {stats.avgChange >= 0 ? (
                <TrendingUp className="h-5 w-5 text-green-500" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-500" />
              )}
              <span className="text-sm text-gray-600 dark:text-gray-400">Avg Change</span>
            </div>
            <p className={`text-2xl font-bold ${
              stats.avgChange >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {stats.avgChange >= 0 ? '+' : ''}{stats.avgChange.toFixed(2)}%
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-2">
              <PieChart className="h-5 w-5 text-purple-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {drillDownLevel === 'sectors' ? 'Sectors' : drillDownLevel === 'industries' ? 'Industries' : 'Companies'}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.items}
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Market Value Bar Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {drillDownLevel === 'sectors' ? 'Sector Values' : 
                   drillDownLevel === 'industries' ? 'Industry Values' : 
                   'Best & Worst Performers'}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {drillDownLevel === 'stocks' ? 
                    'Green: Top 10 performers, Red: Worst 10 performers' : 
                    'Click bars to drill down'
                  }
                </p>
              </div>
              </div>
              
              {/* Small Back Button for Chart */}
              {drillDownLevel !== 'sectors' && (
                <button
                  onClick={handleBackClick}
                  className="flex items-center space-x-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                >
                  <ArrowLeft className="h-3 w-3" />
                  <span>Back</span>
                </button>
              )}
            </div>
            <div className="h-80">
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </div>

          {/* Country Distribution Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Globe className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Geographic Distribution
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {drillDownLevel === 'sectors' ? 'All sectors' : 
                   drillDownLevel === 'industries' ? `${selectedSector} sector` : 
                   `${selectedIndustry} industry`} by country
                </p>
              </div>
              </div>
              
              {/* Small Back Button for Chart */}
              {drillDownLevel !== 'sectors' && (
                <button
                  onClick={handleBackClick}
                  className="flex items-center space-x-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
                >
                  <ArrowLeft className="h-3 w-3" />
                  <span>Back</span>
                </button>
              )}
            </div>
            <div className="h-80">
              <Doughnut data={countryData} options={doughnutOptions} />
            </div>
          </div>
        </div>

        {/* Performance Summary for Stocks View */}
        {drillDownLevel === 'stocks' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Top Performers */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
                  Top 10 Performers
                </h3>
                <button
                  onClick={handleBackClick}
                  className="flex items-center space-x-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-xs"
                >
                  <ArrowLeft className="h-3 w-3" />
                  <span>Back</span>
                </button>
              </div>
              <div className="space-y-3">
                {bestAndWorstStocks.best.map((stock, index) => (
                  <div
                    key={stock.id}
                    onClick={() => window.location.href = `/stock/${stock.id}`}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-6">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {stock.ticker}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatMarketCap(stock.marketCap)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-600 font-semibold">
                        +{stock.changePercent.toFixed(2)}%
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ${stock.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Worst Performers */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <TrendingDown className="h-5 w-5 text-red-500 mr-2" />
                  Worst 10 Performers
                </h3>
                <button
                  onClick={handleBackClick}
                  className="flex items-center space-x-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-xs"
                >
                  <ArrowLeft className="h-3 w-3" />
                  <span>Back</span>
                </button>
              </div>
              <div className="space-y-3">
                {bestAndWorstStocks.worst.map((stock, index) => (
                  <div
                    key={stock.id}
                    onClick={() => window.location.href = `/stock/${stock.id}`}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-6">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {stock.ticker}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatMarketCap(stock.marketCap)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-red-600 font-semibold">
                        {stock.changePercent.toFixed(2)}%
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ${stock.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Detailed Breakdown
            </h3>
            
            {/* Back Button for Table */}
            {drillDownLevel !== 'sectors' && (
              <button
                onClick={handleBackClick}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to {drillDownLevel === 'stocks' ? 'Industries' : 'Sectors'}</span>
              </button>
            )}
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    {drillDownLevel === 'sectors' ? 'Sector' : drillDownLevel === 'industries' ? 'Industry' : 'Company'}
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Market Cap
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    {drillDownLevel === 'stocks' ? 'Price' : 'Companies'}
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    {drillDownLevel === 'stocks' ? 'Performance' : 'Avg Change'}
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-white">
                    Weight
                  </th>
                </tr>
              </thead>
              <tbody>
                {drillDownLevel === 'sectors' && sectorData.map((sector, index) => (
                  <tr
                    key={sector.sector}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedSector(sector.sector);
                      setDrillDownLevel('industries');
                    }}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: chartColors[index] }}
                        />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {sector.sector}
                        </span>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4 text-gray-900 dark:text-white">
                      {formatMarketCap(sector.totalMarketCap)}
                    </td>
                    <td className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">
                      {sector.count}
                    </td>
                    <td className={`text-right py-3 px-4 font-medium ${
                      sector.avgChange >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {sector.avgChange >= 0 ? '+' : ''}{sector.avgChange.toFixed(2)}%
                    </td>
                    <td className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">
                      {((sector.totalMarketCap / stats.totalValue) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
                
                {drillDownLevel === 'industries' && industryData.map((industry, index) => (
                  <tr
                    key={industry.industry}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    onClick={() => {
                      setSelectedIndustry(industry.industry);
                      setDrillDownLevel('stocks');
                    }}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: chartColors[index] }}
                        />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {industry.industry}
                        </span>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4 text-gray-900 dark:text-white">
                      {formatMarketCap(industry.totalMarketCap)}
                    </td>
                    <td className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">
                      {industry.count}
                    </td>
                    <td className={`text-right py-3 px-4 font-medium ${
                      industry.avgChange >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {industry.avgChange >= 0 ? '+' : ''}{industry.avgChange.toFixed(2)}%
                    </td>
                    <td className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">
                      {((industry.totalMarketCap / stats.totalValue) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
                
                {drillDownLevel === 'stocks' && [...bestAndWorstStocks.best, ...bestAndWorstStocks.worst].map((stock, index) => (
                  <tr
                    key={stock.id}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    onClick={() => window.location.href = `/stock/${stock.id}`}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div 
                          className={`w-4 h-4 rounded-full ${
                            bestAndWorstStocks.best.includes(stock) ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        />
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {stock.ticker}
                          </span>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {stock.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="text-right py-3 px-4 text-gray-900 dark:text-white">
                      {formatMarketCap(stock.marketCap)}
                    </td>
                    <td className="text-right py-3 px-4 text-gray-900 dark:text-white">
                      ${stock.price.toFixed(2)}
                    </td>
                    <td className={`text-right py-3 px-4 font-medium ${
                      stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                    </td>
                    <td className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">
                      {((stock.marketCap / stats.totalValue) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
          </>
        )}

        {/* Correlation Matrix View */}
        {marketViewMode === 'correlation' && (
          <SectorHeatmap />
        )}
      </div>
    </div>
  );
};

export default MarketOverview;