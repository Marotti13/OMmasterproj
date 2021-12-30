import { IonButton, IonCard, IonCol, IonContent, IonGrid, IonImg, IonItem, IonLabel, IonPage, IonRow, IonSelect, IonSelectOption, IonSelectPopover, IonSpinner, IonText, IonTitle, useIonAlert} from "@ionic/react"
import {db} from "../firebaseConfig";
import { useEffect, useState } from "react";
import './TeamSelector.css'
import PublishEvent from "./PublishEvent";


/**need to write script that pulls all events from firebase and then user selects team
 * need to pass by id instaed of name so values are easier 
 * 
 * grab id of team and try to toggle to the css class -- if it doesnt exist then default is used
*/
type myEvent = {
  eventDate: Date;
  homeTeamName: string;
  homeTeamID: string;
  visitorTeamName: string;
  visitorTeamID: string;
  id: string;
}

const TeamSelector: React.FC<{
  onSelection: (team:string,event:string) => void;
  handleNewEvent: ()=> void;
  handleNewParty: ()=>void;
  handleEditParty:()=>void;
}> = props => {

  const [ events, addEvents ] = useState<myEvent[]>([]);
  const [ tempEvents, addTempEvents ] = useState<myEvent[]>([]); //this will make it easier lol

  const [ loading, setLoading ] = useState<boolean>(true);
  const [present] = useIonAlert();

  

  /**
   * first grab snapshot of events,
   * then getting hometeam info from ref,
   * after that is done: get visit team info from ref, creat event and setState
   */
  const getEvents = () => {
  
    db.collection('events').onSnapshot(snapshot =>{ 
      addEvents([]);
      console.log('here');
      snapshot.docs.map(doc => {
        let tempArray:myEvent[] = []; //if no connection the array will just be empty- need to do a check on this
        let ht='';
        let vt='';
        let htID ='';
        try{
          doc.data().homeTeamRef.get().then((team: any) => {//need to make another then for visitor
            ht = team.data().teamName;
            htID = team.id;
            
          }).then(() => {
            doc.data().visitorTeamRef.get().then((team: any) => {
              vt = team.data().teamName;

              let event:myEvent = {
                eventDate: doc.data().eventDate,
                homeTeamName: ht,
                homeTeamID: htID,
                visitorTeamName: vt,
                visitorTeamID: team.id,
                id: doc.id
              }
      
              console.log(event);
              tempArray.push(event);   
              addEvents((events: any) => [...events, ...tempArray]);//I DONT KNOW WHY I HAD TO DO THIS - might be because i used a simple get instead of a snapshot auto load thingy

            })
          })
        }catch{
          //eh nothing to see
          console.log('yo');
        }

      });

      setLoading(false)//once events have been added then spinner is taken away 

    });

    db.collection('temp').onSnapshot(snapshot =>{ 
      addTempEvents([]);
      snapshot.docs.map(doc => {
        let tempArray:myEvent[] = []; //if no connection the array will just be empty- need to do a check on this
        let ht='';
        let vt='';
        let htID ='';
        try{
          doc.data().homeTeamRef.get().then((team: any) => {//need to make another then for visitor
            ht = team.data().teamName;
            htID = team.id;
            
          }).then(() => {
            doc.data().visitorTeamRef.get().then((team: any) => {
              vt = team.data().teamName;

              let event:myEvent = {
                eventDate: doc.data().eventDate,
                homeTeamName: ht,
                homeTeamID: htID,
                visitorTeamName: vt,
                visitorTeamID: team.id,
                id: doc.id
              }
      
              console.log(event);
              tempArray.push(event);   
              addTempEvents((tempEvents: any) => [...tempEvents, ...tempArray]);//I DONT KNOW WHY I HAD TO DO THIS - might be because i used a simple get instead of a snapshot auto load thingy

            })
          })
        }catch(Error){
          //eh nothing to see
          console.log(Error);
        }

      });

    });
  }

  const deleteEvent = (docID:string) => {
    present({
      cssClass: 'my-css',
      header: 'Are Your Sure?',
      message: 'Deleting an event is a permanent action.',
      buttons: [
        'Cancel',
        { text: 'Delete', handler: (d) => {
          db.collection("temp").doc(docID).delete().then(() => {
              console.log("Document successfully deleted!");
              }).catch((error) => {
                  console.error("Error removing document: ", error);
            });
        }},
      ],
      //onDidDismiss: (e) => checkExists(d),
    })
    console.log(docID);
  }
  
  useEffect(() => {
  /**runs get events and pulls all events that are available  */
    getEvents();
  },[])

  return (
    <IonPage>
      <IonContent>
        <IonText>
          <h1>Score Buddy</h1>
        </IonText>
        <IonImg class='logo' src='https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/American_football.svg/1024px-American_football.svg.png'></IonImg>
        <IonButton onClick={() => props.handleNewEvent()}>Add Event</IonButton>
        <IonButton onClick={() => props.handleNewParty()}>Add Party</IonButton>
        <IonButton onClick={() => props.handleEditParty()}>Edit Party</IonButton>
        { 
         events.map((event: myEvent) => { 
          return (
            <IonCard key={event.homeTeamID}> {/** need to get unique key*/}
              <IonItem>
                <IonLabel class="ion-text-wrap">{event.visitorTeamName + ' vs ' + event.homeTeamName}</IonLabel>
                <IonSelect placeholder="Select Team" onIonChange={e=>props.onSelection(e.detail.value, event.id)}>
                <IonSelectOption key={event.visitorTeamID} value={event.visitorTeamID}>{event.visitorTeamName}</IonSelectOption>
                  <IonSelectOption key={event.homeTeamID} value={event.homeTeamID}>{event.homeTeamName}</IonSelectOption>
                </IonSelect>
                <PublishEvent id ={event.id} state={"published"} ></PublishEvent>
              </IonItem>
            </IonCard>
          );
        })}
        
        {tempEvents.map((event: myEvent) => { 
          return (
            <IonCard key={event.visitorTeamID}> {/** need to get unique key*/}
              <IonItem>
                <IonLabel class="ion-text-wrap">{event.visitorTeamName + ' vs ' + event.homeTeamName}</IonLabel>
                <IonSelect placeholder="Select Team" onIonChange={e=>props.onSelection(e.detail.value, event.id)}>
                <IonSelectOption key={event.visitorTeamID} value={event.visitorTeamID}>{event.visitorTeamName}</IonSelectOption>
                  <IonSelectOption key={event.homeTeamID} value={event.homeTeamID}>{event.homeTeamName}</IonSelectOption>
                </IonSelect>
                <IonButton>Edit</IonButton>
                <IonButton color='danger' onClick={e=>deleteEvent(event.id)}>Delete</IonButton>
                <PublishEvent id ={event.id} state={"unpublished"} ></PublishEvent>
              </IonItem>
            </IonCard>
          );
        })}
        {/* 
          TO DOOOOOOOO
          have another section for expired events that can be saved? and put back in the temp->live cycle that live evetns have 
        
        
        */}
      </IonContent>
    </IonPage>
    
  );

};

export default TeamSelector;