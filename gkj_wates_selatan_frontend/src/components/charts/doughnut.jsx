import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ pepanthanData }) => {
  // Ambil label (nama pepanthan)
  const labels = pepanthanData.map(item => item.namaPepanthan);

  // Ambil jumlah jemaat
  const values = pepanthanData.map(item => item.jumlah);

  const data = {
    labels: labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          "#1b75bc", // biru tua
          "#2eb5e0", // biru muda
          "#6cc24a", // hijau
          "#f9a11b"  // orange
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div style={{ width: "400px", height: "400px", margin: "auto" }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DoughnutChart;
