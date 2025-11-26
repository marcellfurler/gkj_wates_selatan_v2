import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const BarChart = ({ genderData }) => {
  const labels = genderData.map(item => item.jenisKelamin); // ['Laki-laki', 'Perempuan']
  const values = genderData.map(item => item.jumlah);      // [30, 25]

  const data = {
    labels,
    datasets: [
      {
        label: "Jumlah Jemaat",
        data: values,
        backgroundColor: ["#1b75bc", "#f28e2c"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
