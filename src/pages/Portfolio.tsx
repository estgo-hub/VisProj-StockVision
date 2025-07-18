import React, { useState, useMemo } from 'react';
import { useStock } from '../contexts/StockContext';
import { useTheme } from '../contexts/ThemeContext';
import { Stock } from '../types';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  Globe, 
  Building, 
  Calendar,
  Plus,
  Minus,
  Edit3,
  X,
  Search,
  Filter,
  BarChart3,
  Activity,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Briefcase,
  Grid3x3
} from 'lucide-react';
import { Pie, Doughnut, Bar, Line } from 'react-chartjs-2';
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
import SearchBar from '../components/SearchBar';

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

interface PortfolioHolding {
  id: string;
  stock: Stock;
  shares: number;
  avgCostBasis: number;
  purchaseDate: string;
  currentValue: number;
  totalCost: number;
  gainLoss: number;
  gainLossPercent: number;
}

interface PortfolioStats {
  totalValue: number;
  totalCost: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  dayChange: number;
  dayChangePercent: number;
  bestPerformer: PortfolioHolding | null;
  worstPerformer: PortfolioHolding | null;
}

const Portfolio: React.FC = () => {
  const { stocks } = useStock();
  const { theme } = useTheme();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHolding, setEditingHolding] = useState<PortfolioHolding | null>(null);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [shares, setShares] = useState<string>('');
  const [costBasis, setCostBasis] = useState<string>('');
  const [purchaseDate, setPurchaseDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'overview' | 'holdings' | 'analytics'>('overview');
  const [portfolioLayout, setPortfolioLayout] = useState<'default' | 'quadrant'>('default');
  const [sortBy, setSortBy] = useState<'value' | 'gainLoss' | 'gainLossPercent' | 'shares'>('value');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const isDarkMode = theme === 'dark';

  // Mock portfolio data - in a real app, this would come from a database
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([
    {
      id: '1',
      stock: stocks[0],
      shares: 100,
      avgCostBasis: 145.50,
      purchaseDate: '2024-01-15',
      currentValue: stocks[0].price * 100,
      totalCost: 145.50 * 100,
      gainLoss: (stocks[0].price - 145.50) * 100,
      gainLossPercent: ((stocks[0].price - 145.50) / 145.50) * 100
    },
    {
      id: '2',
      stock: stocks[1],
      shares: 50,
      avgCostBasis: 89.25,
      purchaseDate: '2024-02-10',
      currentValue: stocks[1].price * 50,
      totalCost: 89.25 * 50,
      gainLoss: (stocks[1].price - 89.25) * 50,
      gainLossPercent: ((stocks[1].price - 89.25) / 89.25) * 100
    },
    {
      id: '3',
      stock: stocks[2],
      shares: 75,
      avgCostBasis: 234.80,
      purchaseDate: '2024-01-28',
      currentValue: stocks[2].price * 75,
      totalCost: 234.80 * 75,
      gainLoss: (stocks[2].price - 234.80) * 75,
      gainLossPercent: ((stocks[2].price - 234.80) / 234.80) * 100
    },
    {
      id: '4',
      stock: stocks[3],
      shares: 200,
      avgCostBasis: 67.40,
      purchaseDate: '2024-03-05',
      currentValue: stocks[3].price * 200,
      totalCost: 67.40 * 200,
      gainLoss: (stocks[3].price - 67.40) * 200,
      gainLossPercent: ((stocks[3].price - 67.40) / 67.40) * 100
    },
    {
      id: '5',
      stock: stocks[4],
      shares: 30,
      avgCostBasis: 412.90,
      purchaseDate: '2024-02-20',
      currentValue: stocks[4].price * 30,
      totalCost: 412.90 * 30,
      gainLoss: (stocks[4].price - 412.90) * 30,
      gainLossPercent: ((stocks[4].price - 412.90) / 412.90) * 100
    }
  ]);

  const portfolioStats: PortfolioStats = useMemo(() => {
    const totalValue = holdings.reduce((sum, holding) => sum + holding.currentValue, 0);
    const totalCost = holdings.reduce((sum, holding) => sum + holding.totalCost, 0);
    const totalGainLoss = totalValue - totalCost;
    const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;
    
    // Calculate day change (mock data)
    const dayChange = holdings.reduce((sum, holding) => sum + (holding.stock.change * holding.shares), 0);
    const dayChangePercent = totalValue > 0 ? (dayChange / (totalValue - dayChange)) * 100 : 0;
    
    const sortedByGainLoss = [...holdings].sort((a, b) => b.gainLossPercent - a.gainLossPercent);
    const bestPerformer = sortedByGainLoss[0] || null;
    const worstPerformer = sortedByGainLoss[sortedByGainLoss.length - 1] || null;

    return {
      totalValue,
      totalCost,
      totalGainLoss,
      totalGainLossPercent,
      dayChange,
      dayChangePercent,
      bestPerformer,
      worstPerformer
    };
  }, [holdings]);

  const sortedHoldings = useMemo(() => {
    return [...holdings].sort((a, b) => {
      let aValue: number;
      let bValue: number;
      
      switch (sortBy) {
        case 'value':
          aValue = a.currentValue;
          bValue = b.currentValue;
          break;
        case 'gainLoss':
          aValue = a.gainLoss;
          bValue = b.gainLoss;
          break;
        case 'gainLossPercent':
          aValue = a.gainLossPercent;
          bValue = b.gainLossPercent;
          break;
        case 'shares':
          aValue = a.shares;
          bValue = b.shares;
          break;
        default:
          aValue = a.currentValue;
          bValue = b.currentValue;
      }
      
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }, [holdings, sortBy, sortOrder]);

  // Chart data
  const chartColors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280'
  ];

  const allocationData = useMemo(() => {
    return {
      labels: holdings.map(h => h.stock.ticker),
      datasets: [{
        data: holdings.map(h => h.currentValue),
        backgroundColor: chartColors.slice(0, holdings.length),
        borderColor: isDarkMode ? '#374151' : '#ffffff',
        borderWidth: 2,
      }]
    };
  }, [holdings, isDarkMode]);

  const sectorAllocationData = useMemo(() => {
    const sectorMap = new Map<string, number>();
    holdings.forEach(holding => {
      const current = sectorMap.get(holding.stock.sector) || 0;
      sectorMap.set(holding.stock.sector, current + holding.currentValue);
    });

    const sortedSectors = Array.from(sectorMap.entries())
      .sort((a, b) => b[1] - a[1]);

    return {
      labels: sortedSectors.map(([sector]) => sector),
      datasets: [{
        data: sortedSectors.map(([, value]) => value),
        backgroundColor: chartColors.slice(0, sortedSectors.length),
        borderColor: isDarkMode ? '#374151' : '#ffffff',
        borderWidth: 2,
      }]
    };
  }, [holdings, isDarkMode]);

  const countryAllocationData = useMemo(() => {
    const countryMap = new Map<string, number>();
    holdings.forEach(holding => {
      const current = countryMap.get(holding.stock.country) || 0;
      countryMap.set(holding.stock.country, current + holding.currentValue);
    });

    const sortedCountries = Array.from(countryMap.entries())
      .sort((a, b) => b[1] - a[1]);

    return {
      labels: sortedCountries.map(([country]) => country),
      datasets: [{
        data: sortedCountries.map(([, value]) => value),
        backgroundColor: chartColors.slice(0, sortedCountries.length),
        borderColor: isDarkMode ? '#374151' : '#ffffff',
        borderWidth: 2,
      }]
    };
  }, [holdings, isDarkMode]);

  const performanceData = useMemo(() => {
    // Generate 30 days of portfolio performance data
    const days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    const portfolioValues = days.map((_, index) => {
      // Simulate portfolio value changes
      const baseValue = portfolioStats.totalValue;
      const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
      const trendFactor = (index / 30) * 0.05; // Slight upward trend
      return baseValue * (1 + variation + trendFactor);
    });

    return {
      labels: days,
      datasets: [{
        label: 'Portfolio Value',
        data: portfolioValues,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3B82F6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 4,
      }]
    };
  }, [portfolioStats.totalValue]);

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
            const percentage = ((value / portfolioStats.totalValue) * 100).toFixed(1);
            return `${label}: $${formatCurrency(value)} (${percentage}%)`;
          }
        }
      }
    }
  };

  const lineChartOptions = {
    ...chartOptions,
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
          callback: (value: any) => `$${formatCurrency(value)}`
        }
      }
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1e6) {
      return `${(amount / 1e6).toFixed(1)}M`;
    } else if (amount >= 1e3) {
      return `${(amount / 1e3).toFixed(1)}K`;
    }
    return amount.toFixed(0);
  };

  const formatFullCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const handleAddHolding = () => {
    if (!selectedStock || !shares || !costBasis) return;

    const sharesNum = parseFloat(shares);
    const costBasisNum = parseFloat(costBasis);
    const totalCost = sharesNum * costBasisNum;
    const currentValue = sharesNum * selectedStock.price;
    const gainLoss = currentValue - totalCost;
    const gainLossPercent = (gainLoss / totalCost) * 100;

    const newHolding: PortfolioHolding = {
      id: Date.now().toString(),
      stock: selectedStock,
      shares: sharesNum,
      avgCostBasis: costBasisNum,
      purchaseDate,
      currentValue,
      totalCost,
      gainLoss,
      gainLossPercent
    };

    setHoldings(prev => [...prev, newHolding]);
    setShowAddModal(false);
    setSelectedStock(null);
    setShares('');
    setCostBasis('');
    setPurchaseDate(new Date().toISOString().split('T')[0]);
  };

  const handleEditHolding = (holding: PortfolioHolding) => {
    setEditingHolding(holding);
    setSelectedStock(holding.stock);
    setShares(holding.shares.toString());
    setCostBasis(holding.avgCostBasis.toString());
    setPurchaseDate(holding.purchaseDate);
    setShowAddModal(true);
  };

  const handleUpdateHolding = () => {
    if (!editingHolding || !selectedStock || !shares || !costBasis) return;

    const sharesNum = parseFloat(shares);
    const costBasisNum = parseFloat(costBasis);
    const totalCost = sharesNum * costBasisNum;
    const currentValue = sharesNum * selectedStock.price;
    const gainLoss = currentValue - totalCost;
    const gainLossPercent = (gainLoss / totalCost) * 100;

    const updatedHolding: PortfolioHolding = {
      ...editingHolding,
      shares: sharesNum,
      avgCostBasis: costBasisNum,
      purchaseDate,
      currentValue,
      totalCost,
      gainLoss,
      gainLossPercent
    };

    setHoldings(prev => prev.map(h => h.id === editingHolding.id ? updatedHolding : h));
    setShowAddModal(false);
    setEditingHolding(null);
    setSelectedStock(null);
    setShares('');
    setCostBasis('');
    setPurchaseDate(new Date().toISOString().split('T')[0]);
  };

  const handleRemoveHolding = (holdingId: string) => {
    setHoldings(prev => prev.filter(h => h.id !== holdingId));
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingHolding(null);
    setSelectedStock(null);
    setShares('');
    setCostBasis('');
    setPurchaseDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                My Portfolio
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Track your investments, performance, and geographic distribution
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setPortfolioLayout(portfolioLayout === 'default' ? 'quadrant' : 'default')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  portfolioLayout === 'quadrant'
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Grid3x3 className="h-5 w-5" />
                <span>{portfolioLayout === 'quadrant' ? 'Default View' : 'Quadrant View'}</span>
              </button>
              
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                <Plus className="h-5 w-5" />
                <span>Add Holding</span>
              </button>
            </div>
          </div>
        </div>

        {/* Portfolio Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Value</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatFullCurrency(portfolioStats.totalValue)}
                </p>
                <div className={`flex items-center space-x-1 mt-2 ${
                  portfolioStats.dayChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {portfolioStats.dayChange >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">
                    {portfolioStats.dayChange >= 0 ? '+' : ''}{formatFullCurrency(portfolioStats.dayChange)}
                  </span>
                  <span className="text-sm">
                    ({portfolioStats.dayChangePercent >= 0 ? '+' : ''}{portfolioStats.dayChangePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Gain/Loss</p>
                <p className={`text-2xl font-bold ${
                  portfolioStats.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {portfolioStats.totalGainLoss >= 0 ? '+' : ''}{formatFullCurrency(portfolioStats.totalGainLoss)}
                </p>
                <p className={`text-sm font-medium mt-2 ${
                  portfolioStats.totalGainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {portfolioStats.totalGainLossPercent >= 0 ? '+' : ''}{portfolioStats.totalGainLossPercent.toFixed(2)}%
                </p>
              </div>
              <div className={`p-3 rounded-full ${
                portfolioStats.totalGainLoss >= 0 ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
              }`}>
                {portfolioStats.totalGainLoss >= 0 ? (
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
                )}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Best Performer</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {portfolioStats.bestPerformer?.stock.ticker || 'N/A'}
                </p>
                {portfolioStats.bestPerformer && (
                  <p className="text-sm font-medium text-green-600 mt-2">
                    +{portfolioStats.bestPerformer.gainLossPercent.toFixed(2)}%
                  </p>
                )}
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Holdings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {holdings.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {new Set(holdings.map(h => h.stock.sector)).size} sectors
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                <Briefcase className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Default Layout */}
        {portfolioLayout === 'default' && (
          <>
            {/* View Mode Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              {[
                { key: 'overview', label: 'Overview', icon: BarChart3 },
                { key: 'holdings', label: 'Holdings', icon: Briefcase },
                { key: 'analytics', label: 'Analytics', icon: Activity }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setViewMode(key as any)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                    viewMode === key
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Overview Mode */}
            {viewMode === 'overview' && (
              <>
                {/* Portfolio Performance Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Portfolio Performance (30 Days)
                  </h3>
                  <div className="h-80">
                    <Line data={performanceData} options={lineChartOptions} />
                  </div>
                </div>

                {/* Allocation Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                      Stock Allocation
                    </h3>
                    <div className="h-64">
                      <Doughnut data={allocationData} options={doughnutOptions} />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                      Sector Allocation
                    </h3>
                    <div className="h-64">
                      <Doughnut data={sectorAllocationData} options={doughnutOptions} />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                      Geographic Allocation
                    </h3>
                    <div className="h-64">
                      <Doughnut data={countryAllocationData} options={doughnutOptions} />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Holdings Mode */}
            {viewMode === 'holdings' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Portfolio Holdings
                  </h3>
                  
                  <div className="flex items-center space-x-4">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                    >
                      <option value="value">Sort by Value</option>
                      <option value="gainLoss">Sort by Gain/Loss</option>
                      <option value="gainLossPercent">Sort by Gain/Loss %</option>
                      <option value="shares">Sort by Shares</option>
                    </select>
                    
                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      {sortOrder === 'asc' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {sortedHoldings.map((holding) => (
                    <div
                      key={holding.id}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">
                              {holding.stock.ticker.substring(0, 2)}
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {holding.stock.ticker}
                            </h4>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {holding.shares} shares
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {holding.stock.name}
                          </p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                              <Building className="h-3 w-3" />
                              <span>{holding.stock.sector}</span>
                            </span>
                            <span className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                              <Globe className="h-3 w-3" />
                              <span>{holding.stock.country}</span>
                            </span>
                            <span className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                              <Calendar className="h-3 w-3" />
                              <span>{new Date(holding.purchaseDate).toLocaleDateString()}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex items-center space-x-6">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Current Value</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                              {formatFullCurrency(holding.currentValue)}
                            </p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Gain/Loss</p>
                            <p className={`text-lg font-semibold ${
                              holding.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {holding.gainLoss >= 0 ? '+' : ''}{formatFullCurrency(holding.gainLoss)}
                            </p>
                            <p className={`text-sm ${
                              holding.gainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {holding.gainLossPercent >= 0 ? '+' : ''}{holding.gainLossPercent.toFixed(2)}%
                            </p>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditHolding(holding)}
                              className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleRemoveHolding(holding.id)}
                              className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics Mode */}
            {viewMode === 'analytics' && (
              <div className="space-y-8">
                {/* Detailed Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Risk Analysis */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                      Risk Analysis
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Diversification</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {new Set(holdings.map(h => h.stock.sector)).size} sectors, {new Set(holdings.map(h => h.stock.country)).size} countries
                            </p>
                          </div>
                        </div>
                        <span className="text-green-600 font-semibold">Good</span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Concentration Risk</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Largest holding: {Math.max(...holdings.map(h => (h.currentValue / portfolioStats.totalValue) * 100)).toFixed(1)}%
                            </p>
                          </div>
                        </div>
                        <span className="text-yellow-600 font-semibold">Medium</span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                            <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">Holding Period</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Average: {Math.round(holdings.reduce((sum, h) => {
                                const days = (Date.now() - new Date(h.purchaseDate).getTime()) / (1000 * 60 * 60 * 24);
                                return sum + days;
                              }, 0) / holdings.length)} days
                            </p>
                          </div>
                        </div>
                        <span className="text-blue-600 font-semibold">Long-term</span>
                      </div>
                    </div>
                  </div>

                  {/* Geographic Breakdown */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                      Geographic Breakdown
                    </h3>
                    
                    <div className="space-y-4">
                      {Array.from(new Set(holdings.map(h => h.stock.country))).map(country => {
                        const countryHoldings = holdings.filter(h => h.stock.country === country);
                        const countryValue = countryHoldings.reduce((sum, h) => sum + h.currentValue, 0);
                        const countryPercentage = (countryValue / portfolioStats.totalValue) * 100;
                        
                        return (
                          <div key={country} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                                <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{country}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {countryHoldings.length} holdings
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {formatFullCurrency(countryValue)}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {countryPercentage.toFixed(1)}%
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Performance Metrics
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full w-fit mx-auto mb-4">
                        <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {portfolioStats.totalGainLossPercent.toFixed(2)}%
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total Return</p>
                    </div>

                    <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full w-fit mx-auto mb-4">
                        <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {(Math.random() * 20 + 10).toFixed(1)}%
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Volatility</p>
                    </div>

                    <div className="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full w-fit mx-auto mb-4">
                        <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {((portfolioStats.totalGainLossPercent - 8) / 15).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Sharpe Ratio</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Quadrant Layout */}
        {portfolioLayout === 'quadrant' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top-Left: Portfolio Summary */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Portfolio Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Value</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {formatFullCurrency(portfolioStats.totalValue)}
                      </p>
                      <div className={`flex items-center space-x-1 mt-2 ${
                        portfolioStats.dayChange >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {portfolioStats.dayChange >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span className="text-sm font-medium">
                          {portfolioStats.dayChange >= 0 ? '+' : ''}{formatFullCurrency(portfolioStats.dayChange)}
                        </span>
                        <span className="text-sm">
                          ({portfolioStats.dayChangePercent >= 0 ? '+' : ''}{portfolioStats.dayChangePercent.toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                      <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Gain/Loss</p>
                      <p className={`text-xl font-bold ${
                        portfolioStats.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {portfolioStats.totalGainLoss >= 0 ? '+' : ''}{formatFullCurrency(portfolioStats.totalGainLoss)}
                      </p>
                      <p className={`text-sm font-medium mt-2 ${
                        portfolioStats.totalGainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {portfolioStats.totalGainLossPercent >= 0 ? '+' : ''}{portfolioStats.totalGainLossPercent.toFixed(2)}%
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${
                      portfolioStats.totalGainLoss >= 0 ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
                    }`}>
                      {portfolioStats.totalGainLoss >= 0 ? (
                        <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                      ) : (
                        <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border-l-4 border-purple-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Best Performer</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {portfolioStats.bestPerformer?.stock.ticker || 'N/A'}
                      </p>
                      {portfolioStats.bestPerformer && (
                        <p className="text-sm font-medium text-green-600 mt-2">
                          +{portfolioStats.bestPerformer.gainLossPercent.toFixed(2)}%
                        </p>
                      )}
                    </div>
                    <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                      <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border-l-4 border-orange-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Holdings</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {holdings.length}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {new Set(holdings.map(h => h.stock.sector)).size} sectors
                      </p>
                    </div>
                    <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
                      <Briefcase className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top-Right: Holdings */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Holdings</h3>
                <div className="flex items-center space-x-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm"
                  >
                    <option value="value">Value</option>
                    <option value="gainLoss">Gain/Loss</option>
                    <option value="gainLossPercent">%</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="p-1 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {sortOrder === 'asc' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  </button>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg max-h-96 overflow-y-auto">
                <div className="space-y-3">
                  {sortedHoldings.slice(0, 8).map((holding) => (
                    <div
                      key={holding.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
                          <span className="text-white font-bold text-xs">
                            {holding.stock.ticker.substring(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">
                            {holding.stock.ticker}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {holding.shares} shares
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {formatFullCurrency(holding.currentValue)}
                        </p>
                        <p className={`text-xs font-medium ${
                          holding.gainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {holding.gainLossPercent >= 0 ? '+' : ''}{holding.gainLossPercent.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom-Left: Charts */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Performance & Allocation</h3>
              
              {/* Performance Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  30-Day Performance
                </h4>
                <div className="h-48">
                  <Line data={performanceData} options={lineChartOptions} />
                </div>
              </div>
              
              {/* Allocation Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Sector Allocation
                  </h4>
                  <div className="h-32">
                    <Doughnut data={sectorAllocationData} options={doughnutOptions} />
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    Geographic Split
                  </h4>
                  <div className="h-32">
                    <Doughnut data={countryAllocationData} options={doughnutOptions} />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom-Right: Analytics */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Risk & Analytics</h3>
              
              {/* Risk Analysis */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Risk Analysis
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Diversification</span>
                    </div>
                    <span className="text-sm text-green-600 font-semibold">Good</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Concentration</span>
                    </div>
                    <span className="text-sm text-yellow-600 font-semibold">Medium</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Time Horizon</span>
                    </div>
                    <span className="text-sm text-blue-600 font-semibold">Long-term</span>
                  </div>
                </div>
              </div>
              
              {/* Performance Metrics */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Key Metrics
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Target className="h-5 w-5 text-green-600" />
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {portfolioStats.totalGainLossPercent.toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Total Return</p>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Activity className="h-5 w-5 text-blue-600" />
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {(Math.random() * 20 + 10).toFixed(1)}%
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Volatility</p>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-center mb-2">
                      <Award className="h-5 w-5 text-purple-600" />
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {((portfolioStats.totalGainLossPercent - 8) / 15).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Sharpe Ratio</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Holding Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {editingHolding ? 'Edit Holding' : 'Add New Holding'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Stock
                  </label>
                  {!editingHolding && (
                    <SearchBar
                      onSelect={setSelectedStock}
                      placeholder="Search for a stock..."
                    />
                  )}
                  {selectedStock && (
                    <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedStock.ticker} - {selectedStock.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Current Price: {formatFullCurrency(selectedStock.price)}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Number of Shares
                  </label>
                  <input
                    type="number"
                    value={shares}
                    onChange={(e) => setShares(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Average Cost Basis
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={costBasis}
                    onChange={(e) => setCostBasis(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="150.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Purchase Date
                  </label>
                  <input
                    type="date"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {selectedStock && shares && costBasis && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview:</p>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-900 dark:text-white">
                        Total Cost: {formatFullCurrency(parseFloat(shares) * parseFloat(costBasis))}
                      </p>
                      <p className="text-gray-900 dark:text-white">
                        Current Value: {formatFullCurrency(parseFloat(shares) * selectedStock.price)}
                      </p>
                      <p className={`font-medium ${
                        (parseFloat(shares) * selectedStock.price) - (parseFloat(shares) * parseFloat(costBasis)) >= 0 
                          ? 'text-green-600' : 'text-red-600'
                      }`}>
                        Unrealized P&L: {formatFullCurrency(
                          (parseFloat(shares) * selectedStock.price) - (parseFloat(shares) * parseFloat(costBasis))
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingHolding ? handleUpdateHolding : handleAddHolding}
                  disabled={!selectedStock || !shares || !costBasis}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {editingHolding ? 'Update' : 'Add'} Holding
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;