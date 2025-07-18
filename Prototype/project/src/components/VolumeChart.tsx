import React, { useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { PriceData } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface VolumeChartProps {
  data: PriceData[];
  height?: number;
  darkMode?: boolean;
}

const VolumeChart: React.FC<VolumeChartProps> = ({ 
  data, 
  height = 400, 
  darkMode = false 
}) => {
  const chartRef = useRef<ChartJS<"bar">>(null);

  const textColor = darkMode ? '#e5e7eb' : '#374151';
  const gridColor = darkMode ? '#374151' : '#e5e7eb';

  const chartData = {
    labels: data.map(d => {
      const date = new Date(d.date);
      return date.toLocaleDateString();
    }),
    datasets: [
      {
        label: 'Volume',
        data: data.map(d => d.volume / 1e6), // Convert to millions
        backgroundColor: data.map(d => {
          // Color based on price movement
          const priceChange = d.price - d.open;
          return priceChange >= 0 ? 'rgba(16, 185, 129, 0.7)' : 'rgba(239, 68, 68, 0.7)';
        }),
        borderColor: data.map(d => {
          const priceChange = d.price - d.open;
          return priceChange >= 0 ? '#10b981' : '#ef4444';
        }),
        borderWidth: 1,
      }
    ]
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
        titleColor: textColor,
        bodyColor: textColor,
        borderColor: gridColor,
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const dataPoint = data[context.dataIndex];
            const volume = context.parsed.y;
            const priceChange = dataPoint.price - dataPoint.open;
            const priceChangePercent = (priceChange / dataPoint.open) * 100;
            
            return [
              `Volume: ${volume.toFixed(1)}M`,
              `Price Change: ${priceChange >= 0 ? '+' : ''}$${priceChange.toFixed(2)}`,
              `Change %: ${priceChangePercent >= 0 ? '+' : ''}${priceChangePercent.toFixed(2)}%`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: gridColor,
          display: false
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
          callback: (value) => `${value}M`
        }
      }
    }
  };

  return (
    <div className="w-full" style={{ height }}>
      <Bar ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default VolumeChart;