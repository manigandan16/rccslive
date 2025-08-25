import React from 'react';
import ReactECharts from 'echarts-for-react';

const IesChart = ({base, bracket = [], cp = [] , ep = [] }) => {
    const line1Options = {
        title: {
            text: `Distribution of Quantitative Expectations (n=${base})`,
            left: 'center',
            top: '0%',
            textStyle: {
                fontSize: 16
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
            type: 'shadow'
            },
            formatter: function (params) {
            let tooltipText = `${params[0].name}<br/>`;
            params.forEach(item => {
                tooltipText += `${item.marker} ${item.seriesName}: ${item.value}%<br/>`;
            });
            return tooltipText;
        }
        },
        legend: {
            bottom:0
        },
        grid: {
            top: '10%',
            left: '1%',
            right: '1%',
            bottom: '8%',
            containLabel: true
        },
        yAxis: {
            type: 'value',
            max:100,
            axisLabel:{
            color:'#000000'
            }
        },
        xAxis: {
            type: 'category',
            axisLabel: { 
                interval: 0,
                rotate: 0,
                color:'#000000',
                fontSize: 12
            },
            axisTick: {
            alignWithLabel: false
            },
            data: bracket
        },
        series: [
            {
            name: 'Perception of current inflation',
            type: 'bar',
            label: {
                show: true,
                position: 'top',
                formatter: '{c}%'
            },
            data: cp
            },
            {
            name: 'One year ahead inflation expectations',
            type: 'bar',
            label: {
                show: true,
                position: 'top',
                formatter: '{c}%'
            },
            data: ep
            }
        ]
    };

  return <ReactECharts option={line1Options} notMerge={true}
  lazyUpdate={true} />;
};

export default IesChart;
