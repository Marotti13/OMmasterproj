import { IonList, IonRadioGroup, IonListHeader, IonLabel, IonItem, IonRadio, IonInput, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from "@ionic/react";
import React from "react";
import { useEffect, useState } from "react";
import db from "../firebaseConfig";
import { Pie } from 'react-chartjs-2';
var Chart = require('chart.js'); 

type Survey={
    question:string,
    options:Option[]
}
type Option={
    name:string,
    votes:number
}

const SurveyContainer: React.FC<{
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



    const handleVote = (index:number) => {
        if(hasVoted == true){//can fix this with login
            console.log("You have already voted on this survey!");
            alert("You have already voted on this survey!");//ion alert in html that can be done inthe future
            return
        }

        let tempOptions = survey!.options;
        tempOptions[index].votes = tempOptions[index].votes + 1; //smallest instance i can update is the options array as a whole

        db.collection("teams").doc(props.team).collection('interactive').doc(props.docID).update({
            options:tempOptions
        });//bad way to do this becasue data could be overwritten

        setVoted(true)
    }




    const fetchSurvey=async()=>{
        db.collection("teams").doc(props.team).collection('interactive').doc(props.docID)
            .onSnapshot((e) => {
                if(e.exists){
                    let tempArr:Option[] = e.data()!.options;
                    let temp:Survey={
                        question: e.data()!.question,
                        options: tempArr,
                    }
                    setSurvey(temp);
                    let dataLabels:string[];
                    let dataVotes:number[];
                    dataLabels = tempArr.map(e => {return e.name} );
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
        
        <React.Fragment>
            {hasVoted ? 
            <React.Fragment>
                <IonCard>
                    <IonCardHeader>
                        <IonCardSubtitle>Survey</IonCardSubtitle>
                        <IonCardTitle>{survey?.question}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <Pie data={data} /* options={{responsive: false}} */></Pie>
                    </IonCardContent>
                </IonCard>
            </React.Fragment>
            
            :
            <IonList>
                        <IonListHeader>
                            <IonLabel><h2><b>{survey?.question}</b></h2></IonLabel>
                        </IonListHeader>
                        {survey?.options.map((element:Option,index:number) =>{
                            return(
                                <IonItem key={index}>
                                    <IonLabel>{element.name}</IonLabel>
                                    <IonButton slot='end' onClick={e=>{handleVote(index)}}>Vote</IonButton>
                                </IonItem>
                            );
                        })}
            </IonList>
            }
            
        </React.Fragment>
)};
export default SurveyContainer
