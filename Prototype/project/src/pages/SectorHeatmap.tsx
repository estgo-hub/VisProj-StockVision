import React, { useState, useMemo } from 'react';
import { useStock } from '../contexts/StockContext';
import { Stock } from '../types';
import { TrendingUp, TrendingDown, Filter, Calendar } from 'lucide-react';
import { sectors } from '../data/mockData';

const SectorHeatmap: React.FC = () => {
  const { stocks } = useStock();
  const [selectedSector, setSelectedSector] = useState<string>(sectors[0]);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const sectorStocks = useMemo(() => {
    return stocks.filter(stock => stock.sector === selectedSector);
  }, [stocks, selectedSector]);

  const getPerformanceColor = (changePercent: number) => {
    if (changePercent > 5) return 'bg-green-500';
    if (changePercent > 2) return 'bg-green-400';
    if (changePercent > 0) return 'bg-green-300';
    if (changePercent > -2) return 'bg-red-300';
    if (changePercent > -5) return 'bg-red-400';
    return 'bg-red-500';
  };

  const getTextColor = (changePercent: number) => {
    if (Math.abs(changePercent) > 2) return 'text-white';
    return 'text-gray-900';
  };

  const handleStockClick = (stock: Stock) => {
    window.location.href = `/stock/${stock.id}`;
  };

  const sectorStats = useMemo(() => {
    const totalStocks = sectorStocks.length;
    const gainers = sectorStocks.filter(s => s.changePercent > 0).length;
    const losers = sectorStocks.filter(s => s.changePercent < 0).length;
    const avgChange = sectorStocks.reduce((sum, s) => sum + s.changePercent, 0) / totalStocks;
    const bestPerformer = sectorStocks.reduce((best, stock) => 
      stock.changePercent > best.changePercent ? stock : best
    );
    const worstPerformer = sectorStocks.reduce((worst, stock) => 
      stock.changePercent < worst.changePercent ? stock : worst
    );

    return {
      totalStocks,
      gainers,
      losers,
      avgChange,
      bestPerformer,
      worstPerformer
    };
  }, [sectorStocks]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Sector Heatmap
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Visualize sector performance with color-coded heatmaps
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Filter className="inline h-4 w-4 mr-2" />
                Select Sector
              </label>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              >
                {sectors.map(sector => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="inline h-4 w-4 mr-2" />
                Time Frame
              </label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value as any)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sector Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Stocks</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {sectorStats.totalStocks}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Gainers</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {sectorStats.gainers}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Losers</span>
            </div>
            <p className="text-2xl font-bold text-red-600">
              {sectorStats.losers}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Avg Change</span>
            </div>
            <p className={`text-2xl font-bold ${
              sectorStats.avgChange >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {sectorStats.avgChange >= 0 ? '+' : ''}{sectorStats.avgChange.toFixed(2)}%
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Best/Worst</span>
            </div>
            <div className="text-xs">
              <p className="text-green-600 font-medium">
                {sectorStats.bestPerformer.ticker}: +{sectorStats.bestPerformer.changePercent.toFixed(1)}%
              </p>
              <p className="text-red-600 font-medium">
                {sectorStats.worstPerformer.ticker}: {sectorStats.worstPerformer.changePercent.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        {/* Heatmap */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {selectedSector} Sector Heatmap
            </h3>
            
            {/* Legend */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">Performance:</span>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded" />
                <span className="text-xs text-gray-600 dark:text-gray-400">-5%+</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-300 rounded" />
                <span className="text-xs text-gray-600 dark:text-gray-400">-2%</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-300 rounded" />
                <span className="text-xs text-gray-600 dark:text-gray-400">0%</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-300 rounded" />
                <span className="text-xs text-gray-600 dark:text-gray-400">+2%</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded" />
                <span className="text-xs text-gray-600 dark:text-gray-400">+5%+</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {sectorStocks.map((stock) => (
              <div
                key={stock.id}
                onClick={() => handleStockClick(stock)}
                className={`
                  ${getPerformanceColor(stock.changePercent)}
                  ${getTextColor(stock.changePercent)}
                  p-4 rounded-lg cursor-pointer hover:scale-105 transition-transform duration-200
                  border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600
                `}
              >
                <div className="text-center">
                  <p className="text-sm font-bold mb-1">
                    {stock.ticker}
                  </p>
                  <p className="text-xs mb-2 opacity-90">
                    ${stock.price.toFixed(2)}
                  </p>
                  <p className="text-xs font-semibold">
                    {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
              Top Gainers
            </h3>
            <div className="space-y-3">
              {sectorStocks
                .filter(stock => stock.changePercent > 0)
                .sort((a, b) => b.changePercent - a.changePercent)
                .slice(0, 5)
                .map((stock) => (
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
                        ${stock.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-600 font-semibold">
                        +{stock.changePercent.toFixed(2)}%
                      </p>
                      <p className="text-sm text-green-600">
                        +${stock.change.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <TrendingDown className="h-5 w-5 text-red-500 mr-2" />
              Top Losers
            </h3>
            <div className="space-y-3">
              {sectorStocks
                .filter(stock => stock.changePercent < 0)
                .sort((a, b) => a.changePercent - b.changePercent)
                .slice(0, 5)
                .map((stock) => (
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
                        ${stock.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-red-600 font-semibold">
                        {stock.changePercent.toFixed(2)}%
                      </p>
                      <p className="text-sm text-red-600">
                        ${stock.change.toFixed(2)}
                      </p>
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

export default SectorHeatmap;