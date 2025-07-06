import React, { useState, useMemo } from 'react';
import { useStock } from '../contexts/StockContext';
import { useTheme } from '../contexts/ThemeContext';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Globe, Building, MapPin, Filter } from 'lucide-react';
import { sectors } from '../data/mockData';

ChartJS.register(ArcElement, Tooltip, Legend);

const Geography: React.FC = () => {
  const { stocks } = useStock();
  const { theme } = useTheme();
  const [selectedSector, setSelectedSector] = useState<string>('All');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');

  const isDarkMode = theme === 'dark';

  const chartColors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280'
  ];

  const industries = useMemo(() => {
    const allIndustries = stocks.map(stock => stock.industry);
    return [...new Set(allIndustries)].sort();
  }, [stocks]);

  const filteredStocks = useMemo(() => {
    return stocks.filter(stock => {
      const sectorMatch = selectedSector === 'All' || stock.sector === selectedSector;
      const industryMatch = selectedIndustry === 'All' || stock.industry === selectedIndustry;
      return sectorMatch && industryMatch;
    });
  }, [stocks, selectedSector, selectedIndustry]);

  const sectorCountryData = useMemo(() => {
    const data = new Map<string, Map<string, number>>();
    
    filteredStocks.forEach(stock => {
      if (!data.has(stock.sector)) {
        data.set(stock.sector, new Map());
      }
      const sectorData = data.get(stock.sector)!;
      sectorData.set(stock.country, (sectorData.get(stock.country) || 0) + 1);
    });

    return data;
  }, [filteredStocks]);

  const countryDistribution = useMemo(() => {
    const countryMap = new Map<string, number>();
    
    filteredStocks.forEach(stock => {
      countryMap.set(stock.country, (countryMap.get(stock.country) || 0) + 1);
    });

    const sortedCountries = Array.from(countryMap.entries())
      .sort((a, b) => b[1] - a[1]);

    return {
      labels: sortedCountries.map(([country]) => country),
      datasets: [{
        data: sortedCountries.map(([, count]) => count),
        backgroundColor: chartColors.slice(0, sortedCountries.length),
        borderColor: isDarkMode ? '#374151' : '#ffffff',
        borderWidth: 2,
      }]
    };
  }, [filteredStocks, isDarkMode]);

  const topCountriesBySector = useMemo(() => {
    const result = new Map<string, Array<{country: string, count: number, percentage: number}>>();
    
    Array.from(sectorCountryData.entries()).forEach(([sector, countryMap]) => {
      const total = Array.from(countryMap.values()).reduce((sum, count) => sum + count, 0);
      const sortedCountries = Array.from(countryMap.entries())
        .map(([country, count]) => ({
          country,
          count,
          percentage: (count / total) * 100
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      
      result.set(sector, sortedCountries);
    });

    return result;
  }, [sectorCountryData]);

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
            const total = context.dataset.data.reduce((sum: number, val: number) => sum + val, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} companies (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Geographic Distribution
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore how sectors and industries are distributed across different countries
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Filter className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Filter by Sector & Industry
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sector
              </label>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              >
                <option value="All">All Sectors</option>
                {sectors.map(sector => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Industry
              </label>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
              >
                <option value="All">All Industries</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-2">
              <Building className="h-6 w-6 text-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Companies</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {filteredStocks.length}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-2">
              <Globe className="h-6 w-6 text-green-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Countries</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {new Set(filteredStocks.map(s => s.country)).size}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-2">
              <MapPin className="h-6 w-6 text-purple-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Sectors</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {new Set(filteredStocks.map(s => s.sector)).size}
            </p>
          </div>
        </div>

        {/* Country Distribution Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Country Distribution
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-80">
              <Pie data={countryDistribution} options={chartOptions} />
            </div>
            <div className="space-y-3">
              {countryDistribution.labels.map((country, index) => (
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
                  <div className="text-right">
                    <span className="text-gray-900 dark:text-white font-medium">
                      {countryDistribution.datasets[0].data[index]}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                      ({((countryDistribution.datasets[0].data[index] / filteredStocks.length) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Countries by Sector */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Top Countries by Sector
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from(topCountriesBySector.entries()).map(([sector, countries]) => (
              <div key={sector} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {sector}
                </h4>
                <div className="space-y-3">
                  {countries.map((country, index) => (
                    <div key={country.country} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-4">
                          {index + 1}
                        </span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {country.country}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-900 dark:text-white font-medium">
                          {country.count}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                          ({country.percentage.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Geography;