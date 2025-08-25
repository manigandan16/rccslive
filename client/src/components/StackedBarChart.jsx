// StackedBarChart.jsx
import React from 'react';
import ReactECharts from 'echarts-for-react';

const StackedBarChart = ({ base, centers, targetpercentage, pendingpercentage }) => {
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
    yAxis: {
      type: 'value',
      axisLabel: { color: 'black', fontSize: 12 },
    },
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

  return <ReactECharts option={lineOptions} style={{ height: '100%', width: '100%' }} />;
};

export default StackedBarChart;
