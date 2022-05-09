import { IonList, IonRadioGroup, IonListHeader, IonLabel, IonItem, IonRadio, IonInput, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from "@ionic/react";
import React from "react";
import { useEffect, useState } from "react";
import {db} from "../firebaseConfig";
import { Pie } from 'react-chartjs-2';
import { Chart, registerables} from "chart.js";

Chart.register(...registerables);


type Survey={
    question:string,
    options:Option[]
}
type Option={
    name:string,
    votes:number
}

const SurveyContainerAdmin: React.FC<{
    docID:string;
    team:string; 
  }> = props => {
    

    const [ survey, setSurvey ] = useState<Survey>();
    const [ hasVoted, setVoted ] = useState<boolean>(false);
    const [ data, setData ] = useState<any>({
        labels: [],
        datasets: [
          {
            label: '# of Votes',
            data: [],
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
        ]
    });




    const fetchSurvey=async()=>{
        db.collection("teams").doc(props.team).collection('interactive').doc(props.docID)
            .onSnapshot((e) => {
                if(e.exists){
                    let tempArr:Option[] = e.data()!.options;
                    let temp:Survey={
                        question: e.data()!.question,
                        options: tempArr
                    }
                    setSurvey(temp);
                    let dataLabels:string[];
                    let dataVotes:number[];
                    dataLabels = tempArr.map(e => {console.log(e.name); return e.name} );
                    dataVotes = tempArr.map(e => {return e.votes} );
                    setData({
                        labels: dataLabels,
                        datasets: [
                          {
                            label: '# of Votes',
                            data: dataVotes,
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
                        ]
                    });

                }
       });
    }

    useEffect(() => {
        fetchSurvey();
    }, [])
    return(
        
       <Pie data={data} options={{responsive: true}} ></Pie>
                 
        
            

)};
export default SurveyContainerAdmin
