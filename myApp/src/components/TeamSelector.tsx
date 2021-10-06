import { IonCard, IonCol, IonContent, IonGrid, IonItem, IonLabel, IonPage, IonRow, IonSelect, IonSelectOption, IonText, IonTitle } from "@ionic/react"
import db from "../firebaseConfig";
import { useEffect, useState } from "react";


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
}

const TeamSelector: React.FC<{
  onSelection: (selection:string) => void;
}> = props => {

  const [ events, addEvents ] = useState<myEvent[]>([]);

  /**
   * first grab snapshot of events,
   * then getting hometeam info from ref,
   * after that is done: get visit team info from ref, creat event and setState
   */
  const getEvents = () => {
  
    db.collection('events').get().then(snapshot =>{

   
    let tempArray:myEvent[] = []; //if no connection the array will just be empty- need to do a check on this
    
    snapshot.docs.map(doc => {
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
              visitorTeamID: team.id
            }
    
            console.log(event);
            tempArray.push(event);   
            addEvents((events: any) => [...events, ...tempArray]);//I DONT KNOW WHY I HAD TO DO THIS - might be because i used a simple get instead of a snapshot auto load thingy
          })
        })
      }catch{
        //eh nothing to see
    }

    });

    
    }).catch(err=>console.log(err));///.catch errors
  }
  
  useEffect(() => {
  /**runs get events and pulls all events that are available  */
    getEvents();
  },[])

  return (
    <IonPage>
      <IonContent>
          <IonCard>
              <IonItem>
                <IonLabel>Events</IonLabel>
                <IonSelect value={'test value'} placeholder="Select Team" onIonChange={e=>props.onSelection(e.detail.value)}>
                  {events.map((event: myEvent) => { 
                    return (<><IonSelectOption key={event.homeTeamID} value={event.homeTeamID}>{event.homeTeamName}</IonSelectOption>
                              <IonSelectOption key={event.visitorTeamID} value={event.visitorTeamID}>{event.visitorTeamName}</IonSelectOption></>);
                  })}
                </IonSelect>
              </IonItem>
          </IonCard>
      </IonContent>
    </IonPage>
    
  );

};

export default TeamSelector;

/**
 * events title
 * 
 * card for each event 
 *  select one of two teams to select
 * 
 * 
 */