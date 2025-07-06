import React from 'react';
import { Stock } from '../types';
import { useStock } from '../contexts/StockContext';
import { Heart, TrendingUp, TrendingDown } from 'lucide-react';

interface StockCardProps {
  stock: Stock;
  onClick?: (stock: Stock) => void;
}

const StockCard: React.FC<StockCardProps> = ({ stock, onClick }) => {
  const { favorites, toggleFavorite } = useStock();
  const isFavorite = favorites.has(stock.id);

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

  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:scale-105' : ''
      }`}
      onClick={() => onClick?.(stock)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {stock.ticker}
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(stock.id);
              }}
              className={`p-1 rounded-full transition-colors ${
                isFavorite
                  ? 'text-red-500 hover:text-red-600'
                  : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {stock.name}
          </p>
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <span>{stock.sector}</span>
            <span>•</span>
            <span>{stock.country}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {formatPrice(stock.price)}
          </p>
          <div className={`flex items-center space-x-1 ${
            stock.change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {stock.change >= 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">
              {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
            </span>
            <span className="text-sm">
              ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Market Cap</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {formatMarketCap(stock.marketCap)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Volume</p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {formatVolume(stock.volume)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StockCard;