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

interface RSIChartProps {
  data: PriceData[];
  height?: number;
  darkMode?: boolean;
}

const RSIChart: React.FC<RSIChartProps> = ({ 
  data, 
  height = 400, 
  darkMode = false 
}) => {
  const chartRef = useRef<ChartJS<"line">>(null);

  const textColor = darkMode ? '#e5e7eb' : '#374151';
  const gridColor = darkMode ? '#374151' : '#e5e7eb';

  // Calculate RSI (Relative Strength Index)
  const rsiData = useMemo(() => {
    if (data.length < 14) return data.map(() => 50); // Default RSI if not enough data

    const gains: number[] = [];
    const losses: number[] = [];

    // Calculate price changes
    for (let i = 1; i < data.length; i++) {
      const change = data[i].price - data[i - 1].price;
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? Math.abs(change) : 0);
    }

    const rsi: number[] = [50]; // Start with neutral RSI

    // Calculate initial average gain and loss (first 14 periods)
    let avgGain = gains.slice(0, 14).reduce((sum, gain) => sum + gain, 0) / 14;
    let avgLoss = losses.slice(0, 14).reduce((sum, loss) => sum + loss, 0) / 14;

    // Calculate RSI for each period
    for (let i = 14; i < gains.length; i++) {
      avgGain = (avgGain * 13 + gains[i]) / 14;
      avgLoss = (avgLoss * 13 + losses[i]) / 14;
      
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      const rsiValue = 100 - (100 / (1 + rs));
      rsi.push(rsiValue);
    }

    // Pad the beginning to match data length
    while (rsi.length < data.length) {
      rsi.unshift(50);
    }

    return rsi;
  }, [data]);

  const chartData = {
    labels: data.map(d => {
      const date = new Date(d.date);
      return date.toLocaleDateString();
    }),
    datasets: [
      {
        label: 'RSI',
        data: rsiData,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.1,
        pointRadius: 1,
        pointHoverRadius: 4,
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
            const rsi = context.parsed.y;
            let signal = '';
            if (rsi > 70) signal = ' (Overbought)';
            else if (rsi < 30) signal = ' (Oversold)';
            else signal = ' (Neutral)';
            
            return `RSI: ${rsi.toFixed(1)}${signal}`;
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
        min: 0,
        max: 100,
        grid: {
          color: gridColor,
          display: true
        },
        ticks: {
          color: textColor,
          stepSize: 10,
          callback: (value) => `${value}`
        }
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    },
    // Add horizontal lines for overbought/oversold levels
    elements: {
      point: {
        backgroundColor: (context) => {
          const rsi = context.parsed?.y || 50;
          if (rsi > 70) return '#ef4444'; // Red for overbought
          if (rsi < 30) return '#10b981'; // Green for oversold
          return '#8b5cf6'; // Purple for neutral
        }
      }
    }
  };

  return (
    <div className="w-full" style={{ height }}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Overbought (&gt;70)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Neutral (30-70)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Oversold (&lt;30)</span>
          </div>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Current RSI: <span className="font-medium">{rsiData[rsiData.length - 1]?.toFixed(1) || 'N/A'}</span>
        </div>
      </div>
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default RSIChart;