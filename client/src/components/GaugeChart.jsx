import React from 'react';
import ReactECharts from 'echarts-for-react';

const GaugeChart = ({completed , pending , comp, target}) => {
  

  const options = {
    series: [
      {
        type: "pie",
        radius: ["100%", "70%"],
        center: ["50%", "80%"],
        avoidLabelOverlap: false,
        padAngle: 2,
        color: ["#012150", "#d9d9d9"],
        startAngle: 180,
        endAngle: 360,
        itemStyle: {
          borderRadius: 6,
        },
        label: {
          show: true,
          position: 'center',
          formatter: `Overall\n${completed}%`,
          fontSize: 16,
          fontWeight: 'bold',
          lineHeight: 22,
        },
        data: [
          { value: completed, name: 'Completed' },
          { value: pending, name: 'Remaining' },
        ],
      },
    ],
  };

  return (
    <div className="w-[35%]">
      <div className="w-full h-[28vh]" id="chart">
        <ReactECharts option={options} style={{ height: '100%' }} />
      </div>
      <div className="flex flex-row justify-center items-center gap-2 ">
        <span className="bg-[#D9D9D9] rounded-lg p-1 pt-2">
          <span className="text-[#292929] text-xs px-1 font-semibold">Target</span>
          <span className="text-[#292929] text-lg font-bold">{target}</span>
        </span>
        <span className="bg-[#012150] rounded-lg p-1 pt-2">
          <span className="text-white text-xs px-1 font-semibold">Completed</span>
          <span className="text-white text-lg font-bold">{comp}</span>
        </span>
      </div>
    </div>
  );
};

export default GaugeChart;
