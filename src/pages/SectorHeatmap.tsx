import React, { useState, useMemo } from 'react';
import { useStock } from '../contexts/StockContext';
import { Stock } from '../types';
import { TrendingUp, TrendingDown, Filter, Calendar, BarChart3, ArrowLeft, ChevronRight, Plus, X, Search } from 'lucide-react';
import { sectors } from '../data/mockData';
import SearchBar from '../components/SearchBar';

type ViewLevel = 'sectors' | 'industries' | 'stocks' | 'custom';

const SectorHeatmap: React.FC = () => {
  const { stocks } = useStock();
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [diagonalDisplayMode, setDiagonalDisplayMode] = useState<'show_value' | 'hide_black' | 'hide_transparent'>('show_value');
  const [viewLevel, setViewLevel] = useState<ViewLevel>('sectors');
  const [selectedSector, setSelectedSector] = useState<string>('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [selectedStocks, setSelectedStocks] = useState<Stock[]>([]);
  const [showStockSearch, setShowStockSearch] = useState(false);

  // Get unique industries for the selected sector
  const industriesInSector = useMemo(() => {
    if (!selectedSector) return [];
    const sectorStocks = stocks.filter(stock => stock.sector === selectedSector);
    const industries = [...new Set(sectorStocks.map(stock => stock.industry))];
    return industries.sort();
  }, [stocks, selectedSector]);

  // Get stocks for the selected industry
  const stocksInIndustry = useMemo(() => {
    if (!selectedSector || !selectedIndustry) return [];
    return stocks.filter(stock => 
      stock.sector === selectedSector && stock.industry === selectedIndustry
    );
  }, [stocks, selectedSector, selectedIndustry]);

  // Calculate correlation matrix between sectors
  const sectorCorrelationMatrix = useMemo(() => {
    const sectorPerformance = new Map<string, number[]>();
    
    sectors.forEach(sector => {
      sectorPerformance.set(sector, []);
    });

    // Generate 30 days of performance data
    for (let day = 0; day < 30; day++) {
      const dailyPerformance = new Map<string, number[]>();
      
      sectors.forEach(sector => {
        dailyPerformance.set(sector, []);
      });

      stocks.forEach(stock => {
        if (dailyPerformance.has(stock.sector)) {
          const basePerformance = stock.changePercent;
          const dailyVariation = (Math.random() - 0.5) * 4;
          const simulatedPerformance = basePerformance * 0.1 + dailyVariation;
          dailyPerformance.get(stock.sector)!.push(simulatedPerformance);
        }
      });

      dailyPerformance.forEach((performances, sector) => {
        if (performances.length > 0) {
          const avgPerformance = performances.reduce((sum, perf) => sum + perf, 0) / performances.length;
          sectorPerformance.get(sector)!.push(avgPerformance);
        }
      });
    }

    const correlations = new Map<string, Map<string, number>>();
    
    sectors.forEach(sector1 => {
      correlations.set(sector1, new Map());
      const perf1 = sectorPerformance.get(sector1) || [];
      
      sectors.forEach(sector2 => {
        // Skip calculation for self-correlation
        if (sector1 === sector2) {
          correlations.get(sector1)!.set(sector2, 1.0);
          return;
        }

        const perf2 = sectorPerformance.get(sector2) || [];
        
        if (perf1.length === 0 || perf2.length === 0) {
          correlations.get(sector1)!.set(sector2, 0);
          return;
        }

        const n = Math.min(perf1.length, perf2.length);
        const mean1 = perf1.slice(0, n).reduce((sum, val) => sum + val, 0) / n;
        const mean2 = perf2.slice(0, n).reduce((sum, val) => sum + val, 0) / n;
        
        let numerator = 0;
        let sum1Sq = 0;
        let sum2Sq = 0;
        
        for (let i = 0; i < n; i++) {
          const diff1 = perf1[i] - mean1;
          const diff2 = perf2[i] - mean2;
          numerator += diff1 * diff2;
          sum1Sq += diff1 * diff1;
          sum2Sq += diff2 * diff2;
        }
        
        const denominator = Math.sqrt(sum1Sq * sum2Sq);
        const correlation = denominator === 0 ? 0 : numerator / denominator;
        
        correlations.get(sector1)!.set(sector2, correlation);
      });
    });

    return correlations;
  }, [stocks, timeframe]);

  // Calculate industry correlation matrix for selected sector
  const industryCorrelationMatrix = useMemo(() => {
    if (!selectedSector || industriesInSector.length === 0) return new Map();

    const industryPerformance = new Map<string, number[]>();
    
    industriesInSector.forEach(industry => {
      industryPerformance.set(industry, []);
    });

    // Generate performance data for industries
    for (let day = 0; day < 30; day++) {
      const dailyPerformance = new Map<string, number[]>();
      
      industriesInSector.forEach(industry => {
        dailyPerformance.set(industry, []);
      });

      stocks.filter(stock => stock.sector === selectedSector).forEach(stock => {
        if (dailyPerformance.has(stock.industry)) {
          const basePerformance = stock.changePercent;
          const dailyVariation = (Math.random() - 0.5) * 4;
          const simulatedPerformance = basePerformance * 0.1 + dailyVariation;
          dailyPerformance.get(stock.industry)!.push(simulatedPerformance);
        }
      });

      dailyPerformance.forEach((performances, industry) => {
        if (performances.length > 0) {
          const avgPerformance = performances.reduce((sum, perf) => sum + perf, 0) / performances.length;
          industryPerformance.get(industry)!.push(avgPerformance);
        }
      });
    }

    const correlations = new Map<string, Map<string, number>>();
    
    industriesInSector.forEach(industry1 => {
      correlations.set(industry1, new Map());
      const perf1 = industryPerformance.get(industry1) || [];
      
      industriesInSector.forEach(industry2 => {
        // Skip calculation for self-correlation
        if (industry1 === industry2) {
          correlations.get(industry1)!.set(industry2, 1.0);
          return;
        }

        const perf2 = industryPerformance.get(industry2) || [];
        
        if (perf1.length === 0 || perf2.length === 0) {
          correlations.get(industry1)!.set(industry2, 0);
          return;
        }

        const n = Math.min(perf1.length, perf2.length);
        const mean1 = perf1.slice(0, n).reduce((sum, val) => sum + val, 0) / n;
        const mean2 = perf2.slice(0, n).reduce((sum, val) => sum + val, 0) / n;
        
        let numerator = 0;
        let sum1Sq = 0;
        let sum2Sq = 0;
        
        for (let i = 0; i < n; i++) {
          const diff1 = perf1[i] - mean1;
          const diff2 = perf2[i] - mean2;
          numerator += diff1 * diff2;
          sum1Sq += diff1 * diff1;
          sum2Sq += diff2 * diff2;
        }
        
        const denominator = Math.sqrt(sum1Sq * sum2Sq);
        const correlation = denominator === 0 ? 0 : numerator / denominator;
        
        correlations.get(industry1)!.set(industry2, correlation);
      });
    });

    return correlations;
  }, [selectedSector, industriesInSector, stocks, timeframe]);

  // Get top and worst performers for selected industry
  const topAndWorstPerformers = useMemo(() => {
    if (stocksInIndustry.length === 0) return { top: [], worst: [] };
    
    const sorted = [...stocksInIndustry].sort((a, b) => b.changePercent - a.changePercent);
    const top = sorted.slice(0, 10);
    const worst = sorted.slice(-10).reverse();
    
    return { top, worst };
  }, [stocksInIndustry]);

  // Calculate correlation matrix for selected stocks
  const customStockCorrelationMatrix = useMemo(() => {
    if (selectedStocks.length < 2) return new Map();

    const stockPerformance = new Map<string, number[]>();
    
    selectedStocks.forEach(stock => {
      stockPerformance.set(stock.id, []);
    });

    // Generate 30 days of performance data for selected stocks
    for (let day = 0; day < 30; day++) {
      selectedStocks.forEach(stock => {
        const basePerformance = stock.changePercent;
        const dailyVariation = (Math.random() - 0.5) * 6;
        const simulatedPerformance = basePerformance * 0.15 + dailyVariation;
        stockPerformance.get(stock.id)!.push(simulatedPerformance);
      });
    }

    const correlations = new Map<string, Map<string, number>>();
    
    selectedStocks.forEach(stock1 => {
      correlations.set(stock1.id, new Map());
      const perf1 = stockPerformance.get(stock1.id) || [];
      
      selectedStocks.forEach(stock2 => {
        // Skip calculation for self-correlation
        if (stock1.id === stock2.id) {
          correlations.get(stock1.id)!.set(stock2.id, 1.0);
          return;
        }

        const perf2 = stockPerformance.get(stock2.id) || [];
        
        if (perf1.length === 0 || perf2.length === 0) {
          correlations.get(stock1.id)!.set(stock2.id, 0);
          return;
        }

        const n = Math.min(perf1.length, perf2.length);
        const mean1 = perf1.slice(0, n).reduce((sum, val) => sum + val, 0) / n;
        const mean2 = perf2.slice(0, n).reduce((sum, val) => sum + val, 0) / n;
        
        let numerator = 0;
        let sum1Sq = 0;
        let sum2Sq = 0;
        
        for (let i = 0; i < n; i++) {
          const diff1 = perf1[i] - mean1;
          const diff2 = perf2[i] - mean2;
          numerator += diff1 * diff2;
          sum1Sq += diff1 * diff1;
          sum2Sq += diff2 * diff2;
        }
        
        const denominator = Math.sqrt(sum1Sq * sum2Sq);
        const correlation = denominator === 0 ? 0 : numerator / denominator;
        
        correlations.get(stock1.id)!.set(stock2.id, correlation);
      });
    });

    return correlations;
  }, [selectedStocks, timeframe]);

  const getCorrelationColor = (correlation: number) => {
    if (correlation > 0.7) return 'bg-green-600';
    if (correlation > 0.4) return 'bg-green-400';
    if (correlation > 0.1) return 'bg-green-200';
    if (correlation > -0.1) return 'bg-gray-200 dark:bg-gray-600';
    if (correlation > -0.4) return 'bg-red-200';
    if (correlation > -0.7) return 'bg-red-400';
    return 'bg-red-600';
  };

  const getTextColor = (correlation: number) => {
    const absCorrelation = Math.abs(correlation);
    
    // For strong correlations (dark backgrounds), use white text
    if (absCorrelation > 0.4) return 'text-white';
    
    // For weak correlations (light backgrounds), use dark text in both modes
    // This ensures readability on light colored backgrounds
    if (absCorrelation <= 0.1) return 'text-gray-900 dark:text-gray-900';
    
    // For medium correlations, use appropriate contrast
    return 'text-gray-900 dark:text-gray-100';
  };

  const getPerformanceColor = (changePercent: number) => {
    if (changePercent > 5) return 'bg-green-500';
    if (changePercent > 2) return 'bg-green-400';
    if (changePercent > 0) return 'bg-green-300';
    if (changePercent > -2) return 'bg-red-300';
    if (changePercent > -5) return 'bg-red-400';
    return 'bg-red-500';
  };

  const getPerformanceTextColor = (changePercent: number) => {
    if (Math.abs(changePercent) > 2) return 'text-white';
    return 'text-gray-900';
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(1)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(1)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(1)}M`;
    return `$${marketCap.toFixed(0)}`;
  };

  const handleSectorClick = (sector: string) => {
    setSelectedSector(sector);
    setSelectedIndustry('');
    setViewLevel('industries');
  };

  const handleIndustryClick = (industry: string) => {
    setSelectedIndustry(industry);
    setViewLevel('stocks');
  };

  const handleBackClick = () => {
    if (viewLevel === 'stocks') {
      setSelectedIndustry('');
      setViewLevel('industries');
    } else if (viewLevel === 'industries') {
      setSelectedSector('');
      setViewLevel('sectors');
    } else if (viewLevel === 'custom') {
      setViewLevel('sectors');
    }
  };

  const handleStockClick = (stock: Stock) => {
    window.location.href = `/stock/${stock.id}`;
  };

  const handleStockSelect = (stock: Stock) => {
    if (!selectedStocks.find(s => s.id === stock.id)) {
      setSelectedStocks(prev => [...prev, stock]);
      if (selectedStocks.length === 0) {
        setViewLevel('custom');
      }
    }
    setShowStockSearch(false);
  };

  const removeSelectedStock = (stockId: string) => {
    setSelectedStocks(prev => prev.filter(s => s.id !== stockId));
    if (selectedStocks.length === 1) {
      setViewLevel('sectors');
    }
  };

  const clearAllSelectedStocks = () => {
    setSelectedStocks([]);
    setViewLevel('sectors');
  };

  const renderBreadcrumb = () => (
    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
      <button
        onClick={() => {
          setViewLevel('sectors');
          setSelectedSector('');
          setSelectedIndustry('');
        }}
        className={`hover:text-gray-900 dark:hover:text-white ${
          viewLevel === 'sectors' ? 'font-semibold text-gray-900 dark:text-white' : ''
        }`}
      >
        All Sectors
      </button>
      {selectedSector && (
        <>
          <ChevronRight className="h-4 w-4" />
          <button
            onClick={() => {
              setViewLevel('industries');
              setSelectedIndustry('');
            }}
            className={`hover:text-gray-900 dark:hover:text-white ${
              viewLevel === 'industries' ? 'font-semibold text-gray-900 dark:text-white' : ''
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
      {viewLevel === 'custom' && (
        <>
          <ChevronRight className="h-4 w-4" />
          <span className="font-semibold text-gray-900 dark:text-white">
            Custom Selection ({selectedStocks.length} stocks)
          </span>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {viewLevel === 'sectors' && 'Sector Correlation Matrix'}
              {viewLevel === 'industries' && `${selectedSector} Industries`}
              {viewLevel === 'stocks' && `${selectedIndustry} Performance`}
              {viewLevel === 'custom' && 'Custom Stock Correlation Matrix'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {viewLevel === 'sectors' && 'Analyze how different sectors correlate with each other'}
              {viewLevel === 'industries' && 'Compare industries within the selected sector'}
              {viewLevel === 'stocks' && 'Top and worst performing stocks in the industry'}
              {viewLevel === 'custom' && 'Correlation analysis for your selected stocks'}
            </p>
          </div>
        </div>
        
        {renderBreadcrumb()}
      </div>

      {/* Stock Selection Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Custom Stock Selection
          </h3>
          <div className="flex items-center space-x-2">
            {selectedStocks.length > 0 && (
              <button
                onClick={clearAllSelectedStocks}
                className="flex items-center space-x-1 px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors text-sm"
              >
                <X className="h-3 w-3" />
                <span>Clear All</span>
              </button>
            )}
            <button
              onClick={() => setShowStockSearch(!showStockSearch)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Stock</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {showStockSearch && (
          <div className="mb-4">
            <SearchBar
              onSelect={handleStockSelect}
              placeholder="Search and select stocks for correlation analysis..."
              className="w-full"
            />
          </div>
        )}

        {/* Selected Stocks */}
        {selectedStocks.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Selected Stocks ({selectedStocks.length}):
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedStocks.map(stock => (
                <div
                  key={stock.id}
                  className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full"
                >
                  <span className="text-sm font-medium">{stock.ticker}</span>
                  <span className="text-xs text-blue-600 dark:text-blue-300">
                    {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(1)}%
                  </span>
                  <button
                    onClick={() => removeSelectedStock(stock.id)}
                    className="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            {selectedStocks.length >= 2 && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                ✓ Ready for correlation analysis! View the matrix below.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <Calendar className="h-5 w-5 text-gray-500" />
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Time Frame:
            </label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as any)}
              className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
            >
              <option value="daily">Daily (30 days)</option>
              <option value="weekly">Weekly (12 weeks)</option>
              <option value="monthly">Monthly (12 months)</option>
            </select>
          </div>

          {/* Diagonal Display Mode */}
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Diagonal display:
            </label>
            <select
              value={diagonalDisplayMode}
              onChange={(e) => setDiagonalDisplayMode(e.target.value as any)}
              className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white text-sm"
            >
              <option value="show_value">Show 1.00</option>
              <option value="hide_black">Hide (Black Box)</option>
              <option value="hide_transparent">Hide (Transparent)</option>
            </select>
          </div>

          {/* Legend */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {viewLevel === 'stocks' ? 'Performance:' : 'Correlation:'}
            </span>
            {viewLevel === 'stocks' ? (
              <>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-500 rounded" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">-5%+</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-300 rounded" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">0%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">+5%+</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-red-600 rounded" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">-1.0</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-300 rounded" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">0.0</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-600 rounded" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">+1.0</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Custom Stock Correlation Matrix */}
      {viewLevel === 'custom' && selectedStocks.length >= 2 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Custom Stock Correlation Matrix
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Correlation analysis for {selectedStocks.length} selected stocks
              </p>
            </div>
            
            <button
              onClick={handleBackClick}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              {/* Header row */}
              <div className="flex">
                <div className="w-24 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                  <span className="text-xs font-medium text-gray-900 dark:text-white">Stock</span>
                </div>
                {selectedStocks.map(stock => (
                  <div
                    key={stock.id}
                    className="w-16 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                  >
                    <span className="text-xs font-medium text-gray-900 dark:text-white transform -rotate-45 origin-center">
                      {stock.ticker}
                    </span>
                  </div>
                ))}
              </div>

              {/* Matrix rows */}
              {selectedStocks.map(stock1 => (
                <div key={stock1.id} className="flex">
                  <button
                    onClick={() => handleStockClick(stock1)}
                    className={`w-24 h-12 flex items-center justify-center border border-gray-300 dark:border-gray-600 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors ${getPerformanceColor(stock1.changePercent)} ${getPerformanceTextColor(stock1.changePercent)}`}
                  >
                    <span className="text-xs font-bold">
                      {stock1.ticker}
                    </span>
                  </button>
                  {selectedStocks.map(stock2 => {
                    const correlation = customStockCorrelationMatrix.get(stock1.id)?.get(stock2.id) || 0;
                    
                    // Handle diagonal display based on mode
                    const isSelfCorrelation = stock1.id === stock2.id;
                    
                    let displayValue: string;
                    let cellColor: string;
                    let textColor: string;
                    
                    if (isSelfCorrelation) {
                      switch (diagonalDisplayMode) {
                        case 'show_value':
                          displayValue = correlation.toFixed(2);
                          cellColor = getCorrelationColor(correlation);
                          textColor = getTextColor(correlation);
                          break;
                        case 'hide_black':
                          displayValue = '';
                          cellColor = 'bg-gray-900 dark:bg-black';
                          textColor = 'text-white';
                          break;
                        case 'hide_transparent':
                          displayValue = '';
                          cellColor = 'bg-white dark:bg-gray-800';
                          textColor = 'text-transparent';
                          break;
                      }
                    } else {
                      displayValue = correlation.toFixed(2);
                      cellColor = getCorrelationColor(correlation);
                      textColor = getTextColor(correlation);
                    }
                    
                    return (
                      <div
                        key={stock2.id}
                        className={`w-16 h-12 flex items-center justify-center border border-gray-300 dark:border-gray-600 ${cellColor} ${textColor} hover:scale-105 transition-transform cursor-pointer`}
                        title={`${stock1.ticker} vs ${stock2.ticker}: ${correlation.toFixed(3)}\n${stock1.ticker}: ${stock1.changePercent.toFixed(2)}%\n${stock2.ticker}: ${stock2.changePercent.toFixed(2)}%`}
                      >
                        <span className="text-xs font-bold">
                          {displayValue}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Stock Performance Summary */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedStocks.map(stock => (
              <div
                key={stock.id}
                onClick={() => handleStockClick(stock)}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {stock.ticker}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {formatMarketCap(stock.marketCap)}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ${stock.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sector Correlation Matrix */}
      {viewLevel === 'sectors' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Sector Correlation Matrix
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
              (Click on sector names to drill down)
            </span>
          </h3>
          
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              {/* Header row */}
              <div className="flex">
                <div className="w-32 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Sector</span>
                </div>
                {sectors.map(sector => (
                  <div
                    key={sector}
                    className="w-24 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                  >
                    <span className="text-xs font-medium text-gray-900 dark:text-white transform -rotate-45 origin-center">
                      {sector.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>

              {/* Matrix rows */}
              {sectors.map(sector1 => (
                <div key={sector1} className="flex">
                  <button
                    onClick={() => handleSectorClick(sector1)}
                    className="w-32 h-12 flex items-center justify-start px-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                  >
                    <span className="text-xs font-medium text-gray-900 dark:text-white truncate">
                      {sector1}
                    </span>
                  </button>
                  {sectors.map(sector2 => {
                    const correlation = sectorCorrelationMatrix.get(sector1)?.get(sector2) || 0;
                    
                    // Handle diagonal display based on mode
                    const isSelfCorrelation = sector1 === sector2;
                    
                    let displayValue: string;
                    let cellColor: string;
                    let textColor: string;
                    
                    if (isSelfCorrelation) {
                      switch (diagonalDisplayMode) {
                        case 'show_value':
                          displayValue = correlation.toFixed(2);
                          cellColor = getCorrelationColor(correlation);
                          textColor = getTextColor(correlation);
                          break;
                        case 'hide_black':
                          displayValue = '';
                          cellColor = 'bg-gray-900 dark:bg-black';
                          textColor = 'text-white';
                          break;
                        case 'hide_transparent':
                          displayValue = '';
                          cellColor = 'bg-white dark:bg-gray-800';
                          textColor = 'text-transparent';
                          break;
                      }
                    } else {
                      displayValue = correlation.toFixed(2);
                      cellColor = getCorrelationColor(correlation);
                      textColor = getTextColor(correlation);
                    }
                    
                    return (
                      <div
                        key={sector2}
                        className={`w-24 h-12 flex items-center justify-center border border-gray-300 dark:border-gray-600 ${cellColor} ${textColor} hover:scale-105 transition-transform cursor-pointer`}
                        title={`${sector1} vs ${sector2}: ${correlation.toFixed(3)}`}
                      >
                        <span className="text-xs font-bold">
                          {displayValue}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Industry Correlation Matrix */}
      {viewLevel === 'industries' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {selectedSector} Industry Correlation Matrix
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                (Click on industry names to view stocks)
              </p>
            </div>
            
            <button
              onClick={handleBackClick}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              {/* Header row */}
              <div className="flex">
                <div className="w-40 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Industry</span>
                </div>
                {industriesInSector.map(industry => (
                  <div
                    key={industry}
                    className="w-32 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                  >
                    <span className="text-xs font-medium text-gray-900 dark:text-white transform -rotate-45 origin-center">
                      {industry.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>

              {/* Matrix rows */}
              {industriesInSector.map(industry1 => (
                <div key={industry1} className="flex">
                  <button
                    onClick={() => handleIndustryClick(industry1)}
                    className="w-40 h-12 flex items-center justify-start px-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                  >
                    <span className="text-xs font-medium text-gray-900 dark:text-white truncate">
                      {industry1}
                    </span>
                  </button>
                  {industriesInSector.map(industry2 => {
                    const correlation = industryCorrelationMatrix.get(industry1)?.get(industry2) || 0;
                    
                    // Handle diagonal display based on mode
                    const isSelfCorrelation = industry1 === industry2;
                    
                    let displayValue: string;
                    let cellColor: string;
                    let textColor: string;
                    
                    if (isSelfCorrelation) {
                      switch (diagonalDisplayMode) {
                        case 'show_value':
                          displayValue = correlation.toFixed(2);
                          cellColor = getCorrelationColor(correlation);
                          textColor = getTextColor(correlation);
                          break;
                        case 'hide_black':
                          displayValue = '';
                          cellColor = 'bg-gray-900 dark:bg-black';
                          textColor = 'text-white';
                          break;
                        case 'hide_transparent':
                          displayValue = '';
                          cellColor = 'bg-white dark:bg-gray-800';
                          textColor = 'text-transparent';
                          break;
                      }
                    } else {
                      displayValue = correlation.toFixed(2);
                      cellColor = getCorrelationColor(correlation);
                      textColor = getTextColor(correlation);
                    }
                    
                    return (
                      <div
                        key={industry2}
                        className={`w-32 h-12 flex items-center justify-center border border-gray-300 dark:border-gray-600 ${cellColor} ${textColor} hover:scale-105 transition-transform cursor-pointer`}
                        title={`${industry1} vs ${industry2}: ${correlation.toFixed(3)}`}
                      >
                        <span className="text-xs font-bold">
                          {displayValue}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stock Performance Grid */}
      {viewLevel === 'stocks' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <BarChart3 className="h-5 w-5 text-blue-500 mr-2" />
                Performance Correlation Matrix - {selectedIndustry}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Top 10 vs Worst 10 performers correlation analysis
              </p>
            </div>
            
            <button
              onClick={handleBackClick}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              {/* Header row */}
              <div className="flex">
                <div className="w-24 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                  <span className="text-xs font-medium text-gray-900 dark:text-white">Stock</span>
                </div>
                {[...topAndWorstPerformers.top, ...topAndWorstPerformers.worst].map(stock => (
                  <div
                    key={stock.id}
                    className="w-16 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                  >
                    <span className="text-xs font-medium text-gray-900 dark:text-white transform -rotate-45 origin-center">
                      {stock.ticker}
                    </span>
                  </div>
                ))}
              </div>

              {/* Matrix rows */}
              {[...topAndWorstPerformers.top, ...topAndWorstPerformers.worst].map(stock1 => (
                <div key={stock1.id} className="flex">
                  <button
                    onClick={() => handleStockClick(stock1)}
                    className={`w-24 h-12 flex items-center justify-center border border-gray-300 dark:border-gray-600 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors ${getPerformanceColor(stock1.changePercent)} ${getPerformanceTextColor(stock1.changePercent)}`}
                  >
                    <span className="text-xs font-bold">
                      {stock1.ticker}
                    </span>
                  </button>
                  {[...topAndWorstPerformers.top, ...topAndWorstPerformers.worst].map(stock2 => {
                    // Calculate mock correlation between stocks
                    const correlation = stock1.id === stock2.id ? 1.0 : 
                      Math.cos((stock1.changePercent - stock2.changePercent) * Math.PI / 20) * 
                      (0.3 + Math.random() * 0.4); // Mock correlation calculation
                    
                    // Handle diagonal display based on mode
                    const isSelfCorrelation = stock1.id === stock2.id;
                    
                    let displayValue: string;
                    let cellColor: string;
                    let textColor: string;
                    
                    if (isSelfCorrelation) {
                      switch (diagonalDisplayMode) {
                        case 'show_value':
                          displayValue = correlation.toFixed(2);
                          cellColor = getCorrelationColor(correlation);
                          textColor = getTextColor(correlation);
                          break;
                        case 'hide_black':
                          displayValue = '';
                          cellColor = 'bg-gray-900 dark:bg-black';
                          textColor = 'text-white';
                          break;
                        case 'hide_transparent':
                          displayValue = '';
                          cellColor = 'bg-white dark:bg-gray-800';
                          textColor = 'text-transparent';
                          break;
                      }
                    } else {
                      displayValue = correlation.toFixed(2);
                      cellColor = getCorrelationColor(correlation);
                      textColor = getTextColor(correlation);
                    }
                    
                    return (
                      <div
                        key={stock2.id}
                        className={`w-16 h-12 flex items-center justify-center border border-gray-300 dark:border-gray-600 ${cellColor} ${textColor} hover:scale-105 transition-transform cursor-pointer`}
                        title={`${stock1.ticker} vs ${stock2.ticker}: ${correlation.toFixed(3)}\n${stock1.ticker}: ${stock1.changePercent.toFixed(2)}%\n${stock2.ticker}: ${stock2.changePercent.toFixed(2)}%`}
                      >
                        <span className="text-xs font-bold">
                          {displayValue}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          
          {/* Performance Legend */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                Top 10 Performers
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {topAndWorstPerformers.top.map((stock) => (
                  <div
                    key={stock.id}
                    onClick={() => handleStockClick(stock)}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {stock.ticker}
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      +{stock.changePercent.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <TrendingDown className="h-4 w-4 text-red-500 mr-2" />
                Worst 10 Performers
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {topAndWorstPerformers.worst.map((stock) => (
                  <div
                    key={stock.id}
                    onClick={() => handleStockClick(stock)}
                    className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {stock.ticker}
                    </span>
                    <span className="text-sm font-bold text-red-600">
                      {stock.changePercent.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Industry Summary - Only show when viewing stocks */}
      {viewLevel === 'stocks' && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {selectedIndustry} Industry Summary
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {stocksInIndustry.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Companies
              </div>
            </div>
            
            <div className="text-center">
              <div className={`text-2xl font-bold mb-2 ${
                stocksInIndustry.reduce((sum, s) => sum + s.changePercent, 0) / stocksInIndustry.length >= 0 
                  ? 'text-green-600' : 'text-red-600'
              }`}>
                {stocksInIndustry.length > 0 
                  ? (stocksInIndustry.reduce((sum, s) => sum + s.changePercent, 0) / stocksInIndustry.length).toFixed(2)
                  : '0.00'
                }%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Average Change
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {formatMarketCap(stocksInIndustry.reduce((sum, s) => sum + s.marketCap, 0))}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Market Cap
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {stocksInIndustry.filter(s => s.changePercent > 0).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Gainers
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectorHeatmap;