import { IonRow, IonCol, IonCard, IonCardContent } from "@ionic/react";
import { useEffect, useState } from "react";
//import firestore





/* need to read survey information state vars might need to pass specific document into module */
const viewSurvey: React.FC<{document: string}> = props => {

    const [ name, setName ] = useState<string>();
    const [ prompt, setPrompt ] = useState<string>();
    const [ options, setOptions ] = useState<Array< {key: string, value: string}>>();
    
    //might just need to fetch entire survey and update as needed 
    const fetchName=async()=>{
       const response=db.collection('Surveys').doc(props.document);  
       const data=await response.get();
        data.docs.forEach(item=>{
        setBlogs([...blogs,item.data()])
        })
    }
    //NEED USE EFFECT LOOK AT BOOKMARKS
    useEffect(() => {
        fetchName();
      });

    return (
        <IonRow>
            <IonCol>
                <IonCard>
                    <h2>Survey Name: {name}</h2>
                    <h3>Prompt: {prompt}</h3>
                    <h4>Option </h4> {/* possibly use a for loop? look at how big the array is  */}

                </IonCard>
            </IonCol>
        </IonRow>
    );
  
  };
  
  export default viewSurvey;