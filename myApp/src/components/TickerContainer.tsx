import { IonButton, IonCard, IonContent, IonItem, IonList, IonPage } from '@ionic/react';
import { useEffect, useState } from 'react';
import { Doughnut, Bar,Line } from 'react-chartjs-2';
var Chart = require('chart.js'); 


const TickerContainer: React.FC= () => {

  const rand = () => Math.round(Math.random() * 20 - 10);

  const genData = () => ({
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'], //SHIFT SHIFT 
    datasets: [
      {
        label: 'Scale',
        data: [rand(), rand(), rand(), rand(), rand(), rand()],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  });
  
  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };
  

    const [data, setData] = useState(genData());
  
    useEffect(() => {
      const interval = setInterval(() => setData(genData()), 5000); //the setData method is called every 5 seconds 
  
      return () => clearInterval(interval);
    }, []);
  
    return (
      <IonPage>
        <Line data={data} options={options} />
      </IonPage>
    );



};
  
  export default TickerContainer;

  