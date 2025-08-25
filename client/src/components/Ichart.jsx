import React from 'react';
import ReactECharts from 'echarts-for-react';

const Ichart = ({ inc }) => {
  const options = {
    tooltip: {
      trigger: 'item',
      textStyle: {
        fontSize: 15,
      },
      formatter: function (params) {
        return `${params.marker} ${params.name}: ${params.value}%`;
      }
    },
    legend: {
      type: 'scroll',
      orient: 'vertical',
      right: 10,
      top: '20%', // legend labels
      textStyle: {
        fontSize: 12,
      }
    },
    series: [
      {
        name: 'Monthly Income',
        type: 'pie',
        label: {
          show: true,
          position: 'inside',
          fontSize: 10,
          formatter: "{c}%"
        },
        radius: [60, 100],
        center: ['25%', '50%'],
        data: inc, // chart values
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  return (
    <ReactECharts
      option={options}
      notMerge={true}
      lazyUpdate={true}
      
    />
  );
};

export default Ichart;
