import { IonRow, IonCol, IonCard, IonCardContent, IonButton, IonIcon, IonInput, IonItem, IonLabel, IonAlert } from "@ionic/react";
import { checkmark} from "ionicons/icons";
import React from "react";
import { useEffect, useRef, useState } from "react";
import db from '../firebaseConfig';





/* need to read survey information state vars might need to pass specific document into module */
const CreateSurvey: React.FC = () => {
    
    const titleRef = useRef<HTMLIonInputElement>(null);
    const promptRef = useRef<HTMLIonInputElement>(null);
    const [ error, setError ] = useState<string>();


    const submitSurvey = () => {
        const enteredTitle = titleRef.current!.value; //! means this code will never run without a value being stored in side .current ref (TS doesnt know react handles it) 
        const enteredPrompt = promptRef.current!.value;
    
        if (!enteredTitle || !enteredPrompt){
          setError('You Fucked Up! Make sure Everything is entereed right');
          return;
        }
    
        var docData = {
            name: enteredTitle,
            prompt: enteredPrompt
/*             booleanExample: true,
            numberExample: 3.14159265,
            dateExample: firebase.firestore.Timestamp.fromDate(new Date("December 10, 1815")),
            arrayExample: [5, true, "hello"],
            nullExample: null,
            objectExample: {
                a: 5,
                b: {
                    nested: "foo"
                }
            } */
        };
        db.collection("surveys").doc().set(docData).then(() => {
            console.log("Document successfully written!");
        });
        //setCalculatedBMI(bmi); this will be where the survey is submitted 
        resetInputs();
      };

    const resetInputs = () => {
        titleRef.current!.value = '';
        promptRef.current!.value = '';
      };

    return (
        <React.Fragment>
        <IonAlert isOpen={!!error} message={error} buttons={[{text: 'Fine.', handler: () =>{
            setError("");
          }}]}/>
        <IonRow>
            <IonCol>
                <IonCard>
                <IonItem>
                  <IonLabel position='floating'>Title</IonLabel>
                  <IonInput ref={titleRef}></IonInput>
                </IonItem>
                <IonItem>
                  <IonLabel position='floating'>Prompt</IonLabel>
                  <IonInput ref={promptRef}></IonInput>
                </IonItem>
                </IonCard>
                <IonButton onClick={() => { submitSurvey() }}>
                        <IonIcon slot='start' icon={checkmark}/>
                        Submit
                </IonButton>
            </IonCol>
        </IonRow>
        </React.Fragment>

    );
  
  };
  
  export default CreateSurvey;
