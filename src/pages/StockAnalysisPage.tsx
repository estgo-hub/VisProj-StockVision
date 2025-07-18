import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStock } from '../contexts/StockContext';
import StockCard from '../components/StockCard';
import StockDetailPanel from '../components/StockDetailPanel';
import SearchBar from '../components/SearchBar';
import { Stock, SortField, SortOrder } from '../types';
import { Filter, SortAsc, SortDesc, X, ChevronDown, ChevronUp } from 'lucide-react';
import { sectors, countries, exchanges, regions } from '../data/mockData';

const StockAnalysisPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { stocks, getStockById } = useStock();
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedExchanges, setSelectedExchanges] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedStockForDetail, setSelectedStockForDetail] = useState<Stock | null>(null);
  const [sortBy, setSortBy] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const industries = useMemo(() => {
    const allIndustries = stocks.map(stock => stock.industry);
    return [...new Set(allIndustries)].sort();
  }, [stocks]);

  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);

  // Handle URL parameter on mount
  useEffect(() => {
    if (id) {
      const stock = getStockById(id);
      if (stock) {
        setSelectedStockForDetail(stock);
      }
    }
  }, [id, getStockById]);

  const filteredStocks = useMemo(() => {
    let filtered = stocks;

    // Apply filters
    if (selectedSectors.length > 0) {
      filtered = filtered.filter(stock => selectedSectors.includes(stock.sector));
    }

    if (selectedIndustries.length > 0) {
      filtered = filtered.filter(stock => selectedIndustries.includes(stock.industry));
    }

    if (selectedCountries.length > 0) {
      filtered = filtered.filter(stock => selectedCountries.includes(stock.country));
    }

    if (selectedExchanges.length > 0) {
      filtered = filtered.filter(stock => selectedExchanges.includes(stock.exchange));
    }

    if (selectedRegions.length > 0) {
      filtered = filtered.filter(stock => selectedRegions.includes(stock.region));
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(stock => 
        stock.ticker.toLowerCase().includes(query) ||
        stock.name.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'ticker':
          aValue = a.ticker.toLowerCase();
          bValue = b.ticker.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'change':
          aValue = a.change;
          bValue = b.change;
          break;
        case 'changePercent':
          aValue = a.changePercent;
          bValue = b.changePercent;
          break;
        case 'marketCap':
          aValue = a.marketCap;
          bValue = b.marketCap;
          break;
        case 'volume':
          aValue = a.volume;
          bValue = b.volume;
          break;
        case 'peRatio':
          aValue = a.peRatio || 0;
          bValue = b.peRatio || 0;
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
  }, [stocks, selectedSectors, selectedIndustries, selectedCountries, selectedExchanges, selectedRegions, searchQuery, sortBy, sortOrder]);

  const handleSectorToggle = (sector: string) => {
    setSelectedSectors(prev => 
      prev.includes(sector) 
        ? prev.filter(s => s !== sector)
        : [...prev, sector]
    );
  };

  const handleIndustryToggle = (industry: string) => {
    setSelectedIndustries(prev => 
      prev.includes(industry) 
        ? prev.filter(i => i !== industry)
        : [...prev, industry]
    );
  };

  const handleCountryToggle = (country: string) => {
    setSelectedCountries(prev => 
      prev.includes(country) 
        ? prev.filter(c => c !== country)
        : [...prev, country]
    );
  };

  const handleExchangeToggle = (exchange: string) => {
    setSelectedExchanges(prev => 
      prev.includes(exchange) 
        ? prev.filter(e => e !== exchange)
        : [...prev, exchange]
    );
  };

  const handleRegionToggle = (region: string) => {
    setSelectedRegions(prev => 
      prev.includes(region) 
        ? prev.filter(r => r !== region)
        : [...prev, region]
    );
  };

  const clearAllFilters = () => {
    setSelectedSectors([]);
    setSelectedIndustries([]);
    setSelectedCountries([]);
    setSelectedExchanges([]);
    setSelectedRegions([]);
    setSearchQuery('');
  };

  const handleStockSelect = (stock: Stock) => {
    setSelectedStockForDetail(stock);
    navigate(`/stock/${stock.id}`);
  };

  const handleCloseDetail = () => {
    setSelectedStockForDetail(null);
    navigate('/explorer');
  };

  const toggleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const hasActiveFilters = selectedSectors.length > 0 || selectedIndustries.length > 0 || 
    selectedCountries.length > 0 || selectedExchanges.length > 0 || selectedRegions.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Stock Analysis
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover and analyze stocks with advanced filtering and detailed insights
          </p>
        </div>

        {/* Search and Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <SearchBar 
                onSelect={handleStockSelect}
                placeholder="Search stocks by ticker or name..."
              />
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  showFilters || hasActiveFilters
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {showFilters ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                {hasActiveFilters && (
                  <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 ml-1">
                    {selectedSectors.length + selectedIndustries.length + selectedCountries.length + selectedExchanges.length + selectedRegions.length}
                  </span>
                )}
              </button>

              {/* Sort Controls */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortField)}
                  className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                >
                  <option value="name">Name</option>
                  <option value="ticker">Ticker</option>
                  <option value="price">Price</option>
                  <option value="change">Change</option>
                  <option value="changePercent">Change %</option>
                  <option value="marketCap">Market Cap</option>
                  <option value="volume">Volume</option>
                  <option value="peRatio">P/E Ratio</option>
                </select>
                
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
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

          {/* Collapsible Filter Sections */}
          {showFilters && (
            <div className="mt-6 space-y-6 animate-slide-up">
              {/* Sectors */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Sectors
                </h3>
                <div className="flex flex-wrap gap-2">
                  {sectors.map(sector => (
                    <button
                      key={sector}
                      onClick={() => handleSectorToggle(sector)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedSectors.includes(sector)
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {sector}
                    </button>
                  ))}
                </div>
              </div>

              {/* Industries */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Industries
                </h3>
                <div className="flex flex-wrap gap-2">
                  {industries.map(industry => (
                    <button
                      key={industry}
                      onClick={() => handleIndustryToggle(industry)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedIndustries.includes(industry)
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {industry}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exchanges */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Exchanges
                </h3>
                <div className="flex flex-wrap gap-2">
                  {exchanges.map(exchange => (
                    <button
                      key={exchange}
                      onClick={() => handleExchangeToggle(exchange)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedExchanges.includes(exchange)
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {exchange}
                    </button>
                  ))}
                </div>
              </div>

              {/* Regions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Regions
                </h3>
                <div className="flex flex-wrap gap-2">
                  {regions.map(region => (
                    <button
                      key={region}
                      onClick={() => handleRegionToggle(region)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        selectedRegions.includes(region)
                          ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {region}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {filteredStocks.length} stocks found
                  </span>
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    <span>Clear All Filters</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Results ({filteredStocks.length} stocks)
          </h2>
        </div>

        {/* Stock Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStocks.map((stock) => (
            <StockCard
              key={stock.id}
              stock={stock}
              onClick={handleStockSelect}
            />
          ))}
        </div>

        {filteredStocks.length === 0 && (
          <div className="text-center py-12">
            <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No stocks found matching your criteria. Try adjusting your filters.
            </p>
          </div>
        )}
      </div>

      {/* Stock Detail Panel */}
      {selectedStockForDetail && (
        <StockDetailPanel
          stock={selectedStockForDetail}
          onClose={handleCloseDetail}
          onStockSelect={handleStockSelect}
        />
      )}
    </div>
  );
};

export default StockAnalysisPage;