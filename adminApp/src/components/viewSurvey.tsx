import { IonRow, IonCol, IonCard, IonCardContent, IonLabel, IonButton, IonText, IonItem, IonAlert } from "@ionic/react";
import { useEffect, useState } from "react";
import {db} from '../firebaseConfig';

type Survey = {
    title: string;
    question: string;
    options: Option[];
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
            let options:Option[] = [];
            doc.data()!.options.map((option:any) => {
                options.push(option);
            });
            

            let survey:Survey = {
                title: doc.data()!.title,
                question: doc.data()!.question,
                options: options
            }
            setSurvey(survey);

        });
        //unsubscribe?
    }
    //NEED USE EFFECT to run the method
    useEffect(() => {
        fetchSurvey();
    }, [])

    const handleVote = (index:number) => {
        if(hasVoted == true){//can fix this with login
            console.log("You have already voted on this survey!");
            alert("You have already voted on this survey!");//ion alert in html that can be done inthe future
            return
        }

        let tempOptions = survey!.options;
        tempOptions[index].votes = tempOptions[index].votes + 1; //smallest instance i can update is the options array as a whole

        db.collection("teams").doc(props.team).collection('surveys').doc(props.document).update({
            options:tempOptions
        });//bad way to do this becasue data could be overwritten

        setVoted(true)
    }

    return (
        <IonRow>
            <IonCol>
                <IonCard>
                {/* <IonAlert message='You have already voted on this survey!' isOpen={true}></IonAlert> */}
                    <IonText>
                    <h2>{survey?.title}</h2>
                    <h3>{survey?.question}</h3>
                    </IonText>
                    {survey?.options.map((option: Option, index:number) => {   
                        return (
                                <IonRow key={index}>
                                    <IonCol>
                                        <IonText><h4>{option.name}</h4></IonText>
                                        {/* <h5>Votes: {element.votes}</h5> */}
                                        <IonText>{index}</IonText>
                                        <IonButton onClick={() => { handleVote(index) }}>Vote</IonButton>
                                    </IonCol>
                                </IonRow>
                        );
                    })}
                </IonCard>
            </IonCol>
        </IonRow>
    );
  
  };
  
  export default ViewSurvey;



