import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { PriceData } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend
);

interface CandlestickChartProps {
  data: PriceData[];
  height?: number;
  darkMode?: boolean;
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ 
  data, 
  height = 400, 
  darkMode = false 
}) => {
  const chartRef = useRef<ChartJS>(null);

  const textColor = darkMode ? '#e5e7eb' : '#374151';
  const gridColor = darkMode ? '#374151' : '#e5e7eb';

  // Transform data for candlestick representation using line chart
  const chartData = {
    labels: data.map(d => {
      const date = new Date(d.date);
      return date.toLocaleDateString();
    }),
    datasets: [
      {
        label: 'High',
        data: data.map(d => d.high),
        borderColor: '#10b981',
        backgroundColor: 'transparent',
        borderWidth: 1,
        pointRadius: 0,
        fill: false,
      },
      {
        label: 'Low',
        data: data.map(d => d.low),
        borderColor: '#ef4444',
        backgroundColor: 'transparent',
        borderWidth: 1,
        pointRadius: 0,
        fill: false,
      },
      {
        label: 'Open',
        data: data.map(d => d.open),
        borderColor: '#8b5cf6',
        backgroundColor: 'transparent',
        borderWidth: 2,
        pointRadius: 2,
        fill: false,
      },
      {
        label: 'Close',
        data: data.map(d => d.price),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        pointRadius: 3,
        fill: false,
      }
    ]
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: textColor,
          usePointStyle: true,
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: gridColor,
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const dataPoint = data[context.dataIndex];
            const label = context.dataset.label;
            const value = context.parsed.y;
            
            if (label === 'Close') {
              return [
                `Open: $${dataPoint.open.toFixed(2)}`,
                `High: $${dataPoint.high.toFixed(2)}`,
                `Low: $${dataPoint.low.toFixed(2)}`,
                `Close: $${dataPoint.price.toFixed(2)}`,
                `Volume: ${(dataPoint.volume / 1e6).toFixed(1)}M`
              ];
            }
            return `${label}: $${value.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: gridColor,
          display: true
        },
        ticks: {
          color: textColor,
          maxTicksLimit: 8
        }
      },
      y: {
        grid: {
          color: gridColor,
          display: true
        },
        ticks: {
          color: textColor,
          callback: (value) => `$${value}`
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return (
    <div className="w-full" style={{ height }}>
      <Chart ref={chartRef} type="line" data={chartData} options={options} />
    </div>
  );
};

export default CandlestickChart;