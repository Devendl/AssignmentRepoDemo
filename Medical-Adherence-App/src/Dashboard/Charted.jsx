import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Charted = ({ labels, datasets }) =>{
    const data = {
        labels,
        datasets: datasets.map(ds => ({
          ...ds,
       
        }))
    };
    const options = {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Weekly Medication Log',
          },
          legend: {
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      };
    
      return <Line data={data} options={options} />;


};
export default Charted;
