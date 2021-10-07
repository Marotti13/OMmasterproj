import { IonRow, IonCol, IonCard, IonCardContent, IonLabel, IonButton, IonText, IonItem } from "@ionic/react";
import { useEffect, useState } from "react";
import db from '../firebaseConfig';

type Survey = {
    title: string;
    question: string;
    options: Option[];
    votes: Number; //might put this in spereate thing
}
type Option = {
    name: string;
    votes: number;
}

/* need to read survey information state vars might need to pass specific document into module */
const ViewSurvey: React.FC<{document: string, team: string}> = props => {

    //this is the new one 
    const [ survey, setSurvey ] = useState<Survey>();


    const [ name, setName ] = useState<string>();
    const [ prompt, setPrompt ] = useState<string>();
    const [ options, setOptions ] = useState<any>([
        {
            name: 'Nothing to see here!',
            votes: 0
        }
    ]);
    const [ hasVoted, setVoted ] = useState<boolean>(false);
    
    //grab document from prop -> subscribe to it se it to state with survey Type  -- might need to update code to reflect this
    const fetchSurvey=async()=>{

        //db.collection("surveys").doc(props.document)
        db.collection("teams").doc(props.team).collection('surveys').doc(props.document)
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
        fetchSurvey();
    }, [])

    const handleVote = (id:any) => {
        if(hasVoted == true){
            console.log("you have already voted!")
            alert("You have already voted on this survey!")
            return
        }
        let newArr = [...options]; // copying the old datas array
        newArr[id].votes = newArr[id].votes+1; // update local state

        db.collection('surveys').doc(props.document).update({options:newArr}); //bad way to do this becasue data could be overwritten
        setVoted(true)
    }

    return (
        <IonRow>
            <IonCol>
                <IonCard>
                    <h2>{name}</h2>
                    <h3>{prompt}</h3>
                    {options.map((element: any, i: any) => {   
                        return (
                            <IonItem key={i}>
                                <IonRow>
                                    <IonCol>
                                        <IonText><h4>{element.name}</h4></IonText>
                                        {/* <h5>Votes: {element.votes}</h5> */}
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



