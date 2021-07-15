import { IonRow, IonCol, IonCard, IonCardContent, IonLabel, IonButton, IonText, IonItem } from "@ionic/react";
import { useEffect, useState } from "react";
import db from '../firebaseConfig';





/* need to read survey information state vars might need to pass specific document into module */
const ViewSurvey: React.FC<{document: string}> = props => {

    const [ name, setName ] = useState<string>();
    const [ prompt, setPrompt ] = useState<string>();
    const [ options, setOptions ] = useState<any>([
        {
            name: 'Nothing to see here!',
            votes: 0
        }
    ]);
    
    //might just need to fetch entire survey and update as needed 
    const fetchName=async()=>{

        db.collection("surveys").doc(props.document)
        .onSnapshot((doc) => {

            //if empty do something 

            //if one thing chnage the only update that staet


            if(!doc.exists){ //prevents an error if survey gets deleted - snapshot doesnt exist but still triggers fetch
                return
            }
            setName(doc.data()!.name);
            setPrompt(doc.data()!.prompt);

            let tempArray: any[] =[];

            if(doc.data()!.options){ //MIGHT NEED TO LOAD THIS INTO SOMETHING SO NOT CALLING TWICE
                doc.data()!.options.forEach((element: any) => { 
                    tempArray.push(element);
                });
                setOptions(tempArray);
            }
            
            

        });
        //unsubscribe?
    }
    //NEED USE EFFECT to run the method
    useEffect(() => {
        fetchName();
    }, [])

    const handleVote = (id:any) => {
        let newArr = [...options]; // copying the old datas array
        newArr[id].votes = newArr[id].votes+1; // update local state

        db.collection('surveys').doc(props.document).update({options:newArr}); //bad way to do this becasue data could be overwritten
    }

    return (
        <IonRow>
            <IonCol>
                <IonCard>
                    <h2>{name}</h2>
                    <h3>{prompt}</h3>
                    {options.map((element: any, i: any) => {   
                        return (
                            <IonItem>
                                <IonRow>
                                    <IonCol>
                                        <IonText><h4>{element.name}</h4></IonText>
                                        <h5>Votes: {element.votes}</h5>
                                        <IonButton onClick={() => { handleVote(i) }}>Vote</IonButton>
                                    </IonCol>
                                </IonRow>

                            </IonItem>
                        );
                    })}
                </IonCard>
            </IonCol>
        </IonRow>
    );
  
  };
  
  export default ViewSurvey;



