import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ pepanthanData }) => {
  // Labels & values dari prop
  const labels = pepanthanData.map(item => item.name);
  const values = pepanthanData.map(item => item.value);
  const backgroundColors = pepanthanData.map(item => item.color);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: backgroundColors,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // legend kita buat custom di samping
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.raw} orang`;
          },
        },
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default DoughnutChart;
