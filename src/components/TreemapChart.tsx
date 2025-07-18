import React, { useEffect, useRef, useMemo } from 'react';
import { hierarchy, treemap, HierarchyRectangularNode } from 'd3-hierarchy';
import { scaleSequential } from 'd3-scale';
import { interpolateRdYlGn } from 'd3-scale-chromatic';
import { ETFHolding } from '../types';

interface TreemapData {
  name: string;
  value?: number;
  performance?: number;
  children?: TreemapData[];
  ticker?: string;
  sector?: string;
  industry?: string;
}

interface TreemapChartProps {
  holdings: ETFHolding[];
  width?: number;
  height?: number;
  onHoldingClick?: (holding: ETFHolding) => void;
  darkMode?: boolean;
}

const TreemapChart: React.FC<TreemapChartProps> = ({
  holdings,
  width = 800,
  height = 600,
  onHoldingClick,
  darkMode = false
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // Generate mock performance data for demonstration
  const holdingsWithPerformance = useMemo(() => {
    return holdings.map(holding => ({
      ...holding,
      performance: (Math.random() - 0.5) * 10 // Random performance between -5% and +5%
    }));
  }, [holdings]);

  // Transform holdings data into hierarchical structure
  const treemapData = useMemo((): TreemapData => {
    const sectorMap = new Map<string, Map<string, ETFHolding[]>>();
    
    holdingsWithPerformance.forEach(holding => {
      if (!sectorMap.has(holding.sector)) {
        sectorMap.set(holding.sector, new Map());
      }
      const industryMap = sectorMap.get(holding.sector)!;
      if (!industryMap.has(holding.industry)) {
        industryMap.set(holding.industry, []);
      }
      industryMap.get(holding.industry)!.push(holding);
    });

    const children: TreemapData[] = [];
    sectorMap.forEach((industryMap, sector) => {
      const sectorChildren: TreemapData[] = [];
      industryMap.forEach((holdings, industry) => {
        const industryChildren: TreemapData[] = holdings.map(holding => ({
          name: holding.ticker,
          value: holding.weight,
          performance: (holding as any).performance,
          ticker: holding.ticker,
          sector: holding.sector,
          industry: holding.industry
        }));
        
        sectorChildren.push({
          name: industry,
          children: industryChildren,
          sector,
          industry
        });
      });
      
      children.push({
        name: sector,
        children: sectorChildren,
        sector
      });
    });

    return {
      name: 'ETF Holdings',
      children
    };
  }, [holdingsWithPerformance]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    svg.innerHTML = ''; // Clear previous content

    // Create hierarchy and treemap layout
    const root = hierarchy(treemapData)
      .sum(d => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const treemapLayout = treemap<TreemapData>()
      .size([width, height])
      .padding(2)
      .round(true);

    treemapLayout(root);

    // Color scale for performance
    const colorScale = scaleSequential(interpolateRdYlGn)
      .domain([-5, 5]); // Performance range

    // Create SVG groups for different levels
    const g = svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'g'));

    // Draw rectangles for each node
    const drawNode = (node: HierarchyRectangularNode<TreemapData>, level: number) => {
      if (!node.x0 || !node.y0 || !node.x1 || !node.y1) return;

      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', node.x0.toString());
      rect.setAttribute('y', node.y0.toString());
      rect.setAttribute('width', (node.x1 - node.x0).toString());
      rect.setAttribute('height', (node.y1 - node.y0).toString());
      
      // Style based on level and performance
      if (level === 3 && node.data.performance !== undefined) {
        // Leaf nodes (individual stocks) - colored by performance
        rect.setAttribute('fill', colorScale(node.data.performance));
        rect.setAttribute('stroke', darkMode ? '#374151' : '#ffffff');
        rect.setAttribute('stroke-width', '1');
        rect.style.cursor = 'pointer';
        
        // Add click handler
        rect.addEventListener('click', () => {
          if (onHoldingClick && node.data.ticker) {
            const holding = holdingsWithPerformance.find(h => h.ticker === node.data.ticker);
            if (holding) onHoldingClick(holding);
          }
        });

        // Add hover effects
        rect.addEventListener('mouseenter', () => {
          rect.setAttribute('stroke-width', '2');
          rect.setAttribute('stroke', darkMode ? '#60a5fa' : '#3b82f6');
        });

        rect.addEventListener('mouseleave', () => {
          rect.setAttribute('stroke-width', '1');
          rect.setAttribute('stroke', darkMode ? '#374151' : '#ffffff');
        });
      } else {
        // Parent nodes (sectors/industries) - neutral colors
        const opacity = level === 1 ? 0.1 : level === 2 ? 0.2 : 0.3;
        rect.setAttribute('fill', darkMode ? '#4b5563' : '#e5e7eb');
        rect.setAttribute('fill-opacity', opacity.toString());
        rect.setAttribute('stroke', darkMode ? '#6b7280' : '#d1d5db');
        rect.setAttribute('stroke-width', '1');
      }

      g.appendChild(rect);

      // Add text labels
      const rectWidth = node.x1 - node.x0;
      const rectHeight = node.y1 - node.y0;
      
      // Only add text if rectangle is large enough
      if (rectWidth > 30 && rectHeight > 20) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', (node.x0 + rectWidth / 2).toString());
        text.setAttribute('y', (node.y0 + rectHeight / 2).toString());
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'middle');
        text.setAttribute('fill', darkMode ? '#e5e7eb' : '#374151');
        text.setAttribute('font-size', Math.min(12, rectWidth / 8, rectHeight / 3).toString());
        text.setAttribute('font-weight', level <= 2 ? 'bold' : 'normal');
        text.style.pointerEvents = 'none';
        text.style.userSelect = 'none';
        
        // Add text content
        let displayText = node.data.name;
        if (level === 3 && node.data.performance !== undefined) {
          displayText = `${node.data.name}\n${node.data.performance.toFixed(1)}%`;
        }
        
        // Handle multi-line text
        const lines = displayText.split('\n');
        if (lines.length > 1) {
          lines.forEach((line, i) => {
            const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
            tspan.setAttribute('x', (node.x0 + rectWidth / 2).toString());
            tspan.setAttribute('dy', i === 0 ? '0' : '1.2em');
            tspan.textContent = line;
            text.appendChild(tspan);
          });
        } else {
          text.textContent = displayText;
        }
        
        g.appendChild(text);
      }

      // Recursively draw children
      if (node.children) {
        node.children.forEach(child => drawNode(child, level + 1));
      }
    };

    // Start drawing from root
    if (root.children) {
      root.children.forEach(child => drawNode(child, 1));
    }

  }, [treemapData, width, height, darkMode, holdingsWithPerformance, onHoldingClick]);

  return (
    <div className="w-full overflow-auto">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="border border-gray-200 dark:border-gray-700 rounded-lg"
        style={{ minWidth: width, minHeight: height }}
      />
    </div>
  );
};

export default TreemapChart;