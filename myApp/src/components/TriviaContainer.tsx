import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonInput, IonItem, IonItemDivider, IonLabel, IonList, IonListHeader, IonRadio, IonRadioGroup, IonTitle } from "@ionic/react";
import firebase from "firebase";
import React, { useEffect, useState } from "react";
import db from "../firebaseConfig";

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
    const [ hasAnswered, setAnswered ] = useState<boolean>(false);


    const handleAnswered = () =>{
        setAnswered(true);
    }

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
     const handleSubmit=(name:string)=>{

        db.collection("teams").doc(props.team).collection("interactive").doc(props.docID).set({
            correctNames: firebase.firestore.FieldValue.arrayUnion(name)
        },{merge:true});
        handleAnswered();
        setName(undefined);
        setSelected(undefined);
        //alert('Correct! Good job ' + name);        
     }
     

     /**
      * 
      * this method check answer and will tell user if its right or not
      */
     const checkAnswer=(ansIndex:number)=>{
        if(name != undefined && name.includes(" ")){

            if(ansIndex == trivia?.answer){

                handleSubmit(name);
            }else{
                //wrong! show wrong alert
                //alert('Wrong!');
                handleAnswered();
                setName(undefined);
                setSelected(undefined);
            }
        }else{
            alert("Make sure you enter your first and last name!");
        }
        
     }



    useEffect(() => {
        fetchTrivia();
    }, [])
    return(
        <React.Fragment>
            {!hasAnswered ? 
                <IonCard>
                    <IonCardHeader>
                        <IonCardSubtitle>Trivia</IonCardSubtitle>
                    <IonCardTitle>{trivia?.question}</IonCardTitle>
                </IonCardHeader>
                    <IonList>
                        <IonRadioGroup value={selected} onIonChange={e => setSelected(e.detail.value)}>
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
                </IonCard>
            :
                <IonCard>
                    <IonCardHeader>
                        <IonCardSubtitle>Thank You!</IonCardSubtitle>
                        <IonCardTitle>You Have Already Answered</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                            Check back later for more surveys and trivia!
                    </IonCardContent>
                </IonCard>
            }
        </React.Fragment>
)};
export default TriviaContainer
