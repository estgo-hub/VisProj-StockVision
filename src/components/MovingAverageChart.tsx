import React, { useRef, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { PriceData } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MovingAverageChartProps {
  data: PriceData[];
  height?: number;
  darkMode?: boolean;
}

const MovingAverageChart: React.FC<MovingAverageChartProps> = ({ 
  data, 
  height = 400, 
  darkMode = false 
}) => {
  const chartRef = useRef<ChartJS<"line">>(null);

  const textColor = darkMode ? '#e5e7eb' : '#374151';
  const gridColor = darkMode ? '#374151' : '#e5e7eb';

  // Calculate moving averages
  const movingAverages = useMemo(() => {
    const calculateMA = (period: number) => {
      return data.map((_, index) => {
        if (index < period - 1) return null;
        const sum = data.slice(index - period + 1, index + 1)
          .reduce((acc, item) => acc + item.price, 0);
        return sum / period;
      });
    };

    return {
      ma5: calculateMA(5),
      ma10: calculateMA(10),
      ma20: calculateMA(20)
    };
  }, [data]);

  const chartData = {
    labels: data.map(d => {
      const date = new Date(d.date);
      return date.toLocaleDateString();
    }),
    datasets: [
      {
        label: 'Price',
        data: data.map(d => d.price),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
        pointRadius: 2,
        pointHoverRadius: 4,
      },
      {
        label: 'MA 5',
        data: movingAverages.ma5,
        borderColor: '#10b981',
        backgroundColor: 'transparent',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 3,
        borderDash: [5, 5],
      },
      {
        label: 'MA 10',
        data: movingAverages.ma10,
        borderColor: '#f59e0b',
        backgroundColor: 'transparent',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 3,
        borderDash: [10, 5],
      },
      {
        label: 'MA 20',
        data: movingAverages.ma20,
        borderColor: '#ef4444',
        backgroundColor: 'transparent',
        borderWidth: 2,
        fill: false,
        tension: 0.1,
        pointRadius: 0,
        pointHoverRadius: 3,
        borderDash: [15, 5],
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
            const value = context.parsed.y;
            if (value === null) return '';
            return `${context.dataset.label}: $${value.toFixed(2)}`;
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
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default MovingAverageChart;