import React from 'react';
import ReactECharts from 'echarts-for-react';

const LineChart4 = ({base , city  = [] , fip=[] , fsp=[] , fwp=[] , txt,l1,l2,l3}) => {
    const line4Options = {
        title: {
          text: `Future - ${txt}(n=${base})`,
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
            // Use axis to trigger tooltip
            type: "shadow", // 'shadow' as default; can also be 'line' or 'shadow'
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
          bottom: 1,
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "6%",
          containLabel: true,
        },
        yAxis: {
          type: "value",
          max: 100,
        },
        xAxis: {
          type: "category",
          axisLabel: {
            rotate: 40,
            color: "black",
            fontSize: 10,
          },
          data: city,
        },
        series: [
          {
            name: l1,
            type: "bar",
            stack: "total",
            color: ["#00cc99"],
            label: {
              show: true,
              fontSize: 9,
              formatter: function (params) {
return params.value && parseFloat(params.value) !== 0 ? `${params.value}%` : '';
}
            },
            emphasis: {
              focus: "series",
            },
            data: fip,
          },
          {
            name: l2,
            type: "bar",
            stack: "total",
            color: ["#ffc000"],
            label: {
              show: true,
              fontSize: 9,
              formatter: function (params) {
return params.value && parseFloat(params.value) !== 0 ? `${params.value}%` : '';
}
            },
            emphasis: {
              focus: "series",
            },
            data: fsp,
          },
          {
            name: l3,
            type: "bar",
            stack: "total",
            color: ["#ff5050"],
            label: {
              show: true,
              fontSize: 9,
              formatter: function (params) {
return params.value && parseFloat(params.value) !== 0 ? `${params.value}%` : '';
}
            },
            emphasis: {
              focus: "series",
            },
            data: fwp,
          },
        ],
      };

       return <ReactECharts option={line4Options} notMerge={true}
                    lazyUpdate={true} style={{ height: 385  }} />;
                  };
                  
                  export default LineChart4;