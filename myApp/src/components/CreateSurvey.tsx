import { IonRow, IonCol, IonCard, IonCardContent, IonButton, IonIcon, IonInput, IonItem, IonLabel, IonAlert } from "@ionic/react";
import { add, checkmark} from "ionicons/icons";
import React from "react";
import { useEffect, useRef, useState } from "react";
import db from '../firebaseConfig';





/* need to read survey information state vars might need to pass specific document into module */
const CreateSurvey: React.FC = () => {

    const obj = function(name1: any) {
        const name = name1;
        const votes = 0;
        return { name,votes};
    };
    
    const titleRef = useRef<HTMLIonInputElement>(null);
    const promptRef = useRef<HTMLIonInputElement>(null);

    const [ options, setOptions ] = useState<any>([]);    
    const [ temp, setTemp ] = useState<any>([]);    


    const [ error, setError ] = useState<string>();


    const submitSurvey = () => {
        const enteredTitle = titleRef.current!.value; //! means this code will never run without a value being stored in side .current ref (TS doesnt know react handles it) 
        const enteredPrompt = promptRef.current!.value;

    
        if (!enteredTitle || !enteredPrompt || options.length<2){
          setError('You Fucked Up! Make sure Everything is entereed right');
          return;
        }
        
        console.log(temp);
    
        var docData = {
            name: enteredTitle,
            prompt: enteredPrompt,
            options: temp
            
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
        setError('Success!');
        resetInputs();
      };

    const resetInputs = () => {
        titleRef.current!.value = '';
        promptRef.current!.value = '';
        setOptions([]);
      };

    const addOption = () => {
            
            setOptions([...options, ""]);
            setTemp([...temp,null]);

            
      };

      const updateSkill = (e: React.FormEvent<HTMLIonInputElement>, index: number) => {
        const tempArr = [...temp];
        const target = e.target as HTMLTextAreaElement;
        console.log(target.value)
        tempArr[index] = obj(target.value);
        setTemp(tempArr); ////quick fix needs help really bad
        console.log(temp);
      };

    return (
        <React.Fragment>
        <IonAlert isOpen={!!error} message={error} buttons={[{text: 'Confirm', handler: () =>{
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
                
                  {options.map((element: string, i: any) => {   
                          return ([
                            <IonItem>
                                <IonLabel position='floating'>Option</IonLabel>
                                <IonInput name="name" onInput={e => updateSkill(e, i)} >{element}</IonInput>
                            </IonItem>
                          ]);
                      })}
                </IonCard>
                <IonButton onClick={() => { addOption() }}>
                        <IonIcon slot='start' icon={add}/>
                        Add Option
                </IonButton>
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