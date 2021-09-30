import { IonButton, IonCard, IonCol, IonContent, IonItem, IonList, IonPage, IonRow, IonText } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
var Chart = require('chart.js'); 

const finnhub = require('../../node_modules/finnhub'); //two node modules folder messed up

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = "c59jrk2ad3i93kd1riu0" // Replace this
const finnhubClient = new finnhub.DefaultApi();
var test2: NodeJS.Timeout | null = null; //gloal var needed so both methods have access
var labelArray:any = [];
var dataArray:any =[];




const TickerContainer: React.FC= () => {

  const getTicker = () => {

    finnhubClient.quote("AAPL", (error: any, data: any, response: any) => {
      let tempArray = displayData.datasets[0].data;
      let tempArray2 = displayData.labels;

      tempArray.push(data.c.toFixed(2));
      tempArray2.push(new Date().getSeconds().toString() + 's');
      if(tempArray.length > 10){
        tempArray.shift();
        tempArray2.shift();
      }
      
      setData({
        labels: tempArray2, 
        datasets: [
          {
            label: 'AAPL Stock Price',
            data: tempArray,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)'
            ],
             borderColor: [
               'rgba(255, 99, 132, 1)'
             ],
            borderWidth: 1,
          },
        ],
      });
    });
  }

  const stopGetTicker = () => {
    clearInterval(test2!);
  }
  

  const genData = {
    labels: labelArray,
    datasets: [
      {
        label: 'AAPL Stock Price',
        data: dataArray,
        backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        ],
         borderColor: [
           'rgba(255, 99, 132, 1)',
         ],
        borderWidth: 1,
      },
    ],
  };
  
  const options = {
    animation: {
      duration: 0
    },
    scales :{
      y: {
        grid: {
          display: true,
          drawBorder: true,
          drawOnChartArea: true,
          drawTicks: true,
          color: '#FFFFFF'
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function(value: any, index: any, values: any) {
              return '$' + value.toFixed(2);
          }
        }
      },
    }
      
    
  };
  

    const [displayData, setData] = useState(genData);
    
  
    useEffect(() => {
      test2 = setInterval(() => getTicker(), 4000);
  
      return () => clearInterval(test2!);
    }, []);

    
  
    return (
      <React.Fragment>
        <Line data={displayData} options={options} />
        <IonRow>
          <IonCol class="ion-text-center">
            <IonText >Current Price: {displayData.datasets[0].data[displayData.datasets[0].data.length -1]}</IonText>
          </IonCol>
        </IonRow>
      </React.Fragment>
    );



};
  
  export default TickerContainer;

  