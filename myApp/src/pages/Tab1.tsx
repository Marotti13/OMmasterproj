import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';
import ViewSurvey from '../components/viewSurvey';
import db from '../firebaseConfig';
import { useEffect, useState } from 'react';


const Tab1: React.FC<{
    team:string; 
  }> = props => {
  const [ documents, setDocuments ] = useState<any>([]);


  const fetchDocs=async()=>{
    db.collection("teams").doc(props.team).collection('surveys')
        .onSnapshot((e) => {

          let tempArrray: string[] = [];

          e.docs.map(doc => {
            console.log(doc.id);
            tempArrray.push(doc.id);
          });
          setDocuments(tempArrray);
          });
        
  }

  useEffect(() => {
    fetchDocs();
  }, [])
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Surveys</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
        {documents.map((element: string) => { 
         return (<ViewSurvey key={element} document={element} team={props.team}/>);
        })}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
