import React from 'react';
import ReactECharts from 'echarts-for-react';

const LineChart2 = ({ base ,city = [], fnr = [] ,txt}) => {
    const line2Options = {
        title: {
          text: `Future - ${txt}(n=${base})`,
          subtext: "(Net Responses)",
          left: "center",
          top: "2%",
          textStyle: {
            fontSize: 16,
          },
          color: "#000000",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
          formatter: function (params) {
        return `${params[0].name}: ${params[0].value}%`; // Add % without conversion
    }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "2%",
          top: "20%",
          containLabel: true,
        },
        yAxis: {
          type: "value",
          max: 100,
          min: -100,
          axisLabel: {
            color: "black",
          },
        },
        xAxis: {
          type: "category",
          data: city,
          axisLabel: {
            rotate: 40,
            color: "black",
            interval: 0,
            fontSize: 10,
          },
        },
        series: [
          {
            name: "Economic Conditions",
            type: "bar",
            label: {
              show: true,
              color: "black",
              position: "outside",
              formatter: "{c}%",
              fontSize: 9,
            },
            color: "#c04f15",
            emphasis: {
              focus: "series",
            },
            data: fnr,
          },
        ],
      };
    
      return <ReactECharts option={line2Options} notMerge={true}
        lazyUpdate={true} style={{ height: 385  }} />;
      };
      
      export default LineChart2;
