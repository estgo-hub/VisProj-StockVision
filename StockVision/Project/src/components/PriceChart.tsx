import React, { useEffect, useRef } from 'react';
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
import { PriceData, NewsEvent } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PriceChartProps {
  data: PriceData[];
  newsEvents?: NewsEvent[];
  height?: number;
  showVolume?: boolean;
  darkMode?: boolean;
}

const PriceChart: React.FC<PriceChartProps> = ({ 
  data, 
  newsEvents = [], 
  height = 400, 
  showVolume = false,
  darkMode = false 
}) => {
  const chartRef = useRef<ChartJS<"line">>(null);

  const textColor = darkMode ? '#e5e7eb' : '#374151';
  const gridColor = darkMode ? '#374151' : '#e5e7eb';

  // Determine if data is hourly by checking time difference
  const isHourlyData = data.length > 1 && 
    (new Date(data[1].date).getTime() - new Date(data[0].date).getTime()) < 24 * 60 * 60 * 1000;

  const formatLabel = (dateString: string) => {
    const date = new Date(dateString);
    if (isHourlyData) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } else {
      return date.toLocaleDateString();
    }
  };

  const chartData = {
    labels: data.map(d => formatLabel(d.date)),
    datasets: [
      {
        label: 'Price',
        data: data.map(d => d.price),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.1,
        pointRadius: isHourlyData ? 2 : 4,
        pointHoverRadius: isHourlyData ? 4 : 6,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
      }
    ]
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
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
            const price = context.parsed.y;
            const dateString = data[context.dataIndex].date;
            const date = new Date(dateString);
            const newsEvent = newsEvents.find(event => {
              const eventDate = new Date(event.date);
              return eventDate.toDateString() === date.toDateString();
            });
            
            let label = `Price: $${price.toFixed(2)}`;
            if (isHourlyData) {
              label += `\nTime: ${date.toLocaleString()}`;
            } else {
              label += `\nDate: ${date.toLocaleDateString()}`;
            }
            
            if (newsEvent) {
              label += `\n📰 ${newsEvent.headline}`;
            }
            return label;
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
          maxTicksLimit: isHourlyData ? 6 : 8
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
    },
    elements: {
      point: {
        hoverRadius: isHourlyData ? 6 : 8
      }
    }
  };

  return (
    <div className="w-full" style={{ height }}>
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default PriceChart;