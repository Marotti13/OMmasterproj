import { IonButton, IonCard, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonListHeader, IonRadio, IonRadioGroup } from "@ionic/react";
import React, { useEffect, useState } from "react";
import {db} from "../firebaseConfig";

type Trivia={
    question:string,
    options:string[],
    answer:number //index of which option is correct
}

const TriviaContainer: React.FC<{
    docID:string; 
    team:string;
  }> = props => {

    const [ trivia, setTrivia ] = useState<Trivia>();
    const [ selected, setSelected ] = useState<number>();
    const [ name, setName ] = useState<string>();


    /**
     * snapshot to populate var 
     */
     const fetchTrivia=async()=>{
        db.collection("teams").doc(props.team).collection('interactive').doc(props.docID)
            .onSnapshot((e) => {
                if(e.exists){
                    let temp:Trivia={
                        question: e.data()!.question,
                        options: e.data()!.options,
                        answer: e.data()!.answer
                    }
                    setTrivia(temp);

                }
       });
     }
    



    /**
     * method to send inputed usernames of people who got it right to the admin might not do this
     */
     const sendCorrect=(name:string)=>{
        //send name to firestore
     }

     /**
      * 
      * this method check answer and will tell user if its right or not
      */
     const checkAnswer=(ansIndex:number)=>{
        if(ansIndex == trivia?.answer && name != undefined){
            alert('Correct! Good job ' + name);
            sendCorrect(name);
        }else{
            //wrong! show wrong alert
            alert('Wrong!')
        }
        setName(undefined);
        setSelected(undefined);
     }



    useEffect(() => {
        fetchTrivia();
    }, [])
    return(
        <React.Fragment>
                <IonList>
                    <IonRadioGroup value={selected} onIonChange={e => setSelected(e.detail.value)}>
                        <IonListHeader>
                            <IonLabel><h2><b>{trivia?.question}</b></h2></IonLabel>
                        </IonListHeader>
                        {trivia?.options.map((element:string,index:number) =>{
                            return(
                                <IonItem key={index}>
                                    <IonLabel>{element}</IonLabel>
                                    <IonRadio slot='start' value={index}/>
                                </IonItem>
                            );
                        })}
                    </IonRadioGroup>
                    <IonItem>
                        <IonLabel>Name</IonLabel>
                        <IonInput value={name} onIonChange={e=>{setName(e.detail.value!)}} placeholder='required' clearInput></IonInput>
                        <IonButton disabled={selected==undefined || name==undefined || name == ''}slot='end' onClick={e=>{checkAnswer(selected!)}}>Submit</IonButton>
                    </IonItem>
                </IonList>
        </React.Fragment>
)};
export default TriviaContainer
