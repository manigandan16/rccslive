import React from 'react';
import ReactECharts from 'echarts-for-react';

const Ochart = ({occ,occ_p}) => {
    const options = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function (params) {
            return `${params[0].name}: ${params[0].value}%`; // Add % without conversion
        }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '3%',
            containLabel: true
        },
        xAxis: {
            show: false,
            type: 'value',

        },
        yAxis: {
            type: 'category',
            data: occ
        },
        series: [
            {
                name: 'Occupation',
                type: 'bar',
                label: {
                    show: true,
                    formatter: '{c}%'
                },
                color: '#012150',
                data: occ_p
            }
        ]
    };
    return <ReactECharts option={options} notMerge={true}
      lazyUpdate={true} />;
};

export default Ochart;

