import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';

const ChartSwitcher = ({ overallAchievedPercentage, remainingAp, base, centers, targetpercentage, pendingpercentage }) => {
  const [chartType, setChartType] = useState('gauge');

  const handleToggle = (e) => {
    setChartType(e.target.checked ? 'line' : 'gauge');
  };

  const gaugeOptions = {
    series: [
      {
        type: 'pie',
        radius: ['100%', '70%'],
        center: ['50%', '80%'],
        avoidLabelOverlap: false,
        padAngle: 2,
        color: ['#012150', '#d9d9d9'],
        startAngle: 180,
        endAngle: 360,
        itemStyle: {
          borderRadius: 6,
        },
        label: {
          show: true,
          position: 'center',
          fontSize: 16,
          fontWeight: 'bold',
          formatter: `Overall\n${overallAchievedPercentage}%`,
        },
        data: [
          { value: overallAchievedPercentage, name: 'Completed' },
          { value: remainingAp, name: 'Target' },
        ],
      },
    ],
  };

  const lineOptions = {
    title: {
      text: `(n=${base})`,
      top: '3%',
      right: '5%',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: function (params) {
        let tooltipText = `${params[0].name}<br/>`;
        params.forEach((item) => {
          tooltipText += `${item.marker} ${item.seriesName}: ${item.value}%<br/>`;
        });
        return tooltipText;
      },
    },
    legend: { left: 'center', top: '5%' },
    grid: { left: '3%', right: '4%', top: '15%', bottom: '0%', containLabel: true },
    xAxis: {
      type: 'category',
      data: centers,
      axisLabel: { rotate: 40, color: 'black', fontSize: 12 },
    },
    yAxis: { type: 'value', axisLabel: { color: 'black', fontSize: 12 } },
    series: [
      {
        name: 'Achieved',
        type: 'bar',
        stack: 'total',
        color: '#238823',
        label: { show: true, formatter: '{c}%' },
        data: targetpercentage,
      },
      {
        name: 'Pending',
        type: 'bar',
        stack: 'total',
        color: '#D2222D',
        label: { show: true, formatter: '{c}%' },
        data: pendingpercentage,
      },
    ],
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <div className="w-2/6 flex flex-row-reverse pr-2">
        <label className="ground">
          <input
            className="input"
            type="checkbox"
            id="Q_change"
            onChange={handleToggle}
            checked={chartType === 'line'}
          />
          <span className="interchange">
            <span className="z-30 lefite">
              {/* gauge icon */}
            </span>
            <span className="z-30 rightie">
              {/* line icon */}
            </span>
          </span>
        </label>
      </div>

      <div className="w-full h-[60vh] flex justify-center items-center">
        {chartType === 'gauge' ? (
          <ReactECharts option={gaugeOptions} style={{ width: '100%', height: '100%' }} />
        ) : (
          <ReactECharts option={lineOptions} style={{ width: '100%', height: '100%' }} />
        )}
      </div>
    </div>
  );
};

export default ChartSwitcher;
