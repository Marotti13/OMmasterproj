import { IonCard, IonCol, IonContent, IonGrid, IonImg, IonItem, IonLabel, IonPage, IonRow, IonSelect, IonSelectOption, IonSelectPopover, IonSpinner, IonText, IonTitle} from "@ionic/react"
import db from "../firebaseConfig";
import { useEffect, useState } from "react";
import './TeamSelector.css'


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
}> = props => {

  const [ events, addEvents ] = useState<myEvent[]>([]);
  const [ loading, setLoading ] = useState<boolean>(true);

  /**
   * first grab snapshot of events,
   * then getting hometeam info from ref,
   * after that is done: get visit team info from ref, creat event and setState
   */
  const getEvents = () => {
  
    db.collection('events').get().then(snapshot =>{ 
      
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
        setLoading(false)//once events have been added then spinner is taken away 

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
        <IonText>
          <h1>Score Buddy</h1>
        </IonText>
        <IonImg class='logo' src='https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/American_football.svg/1024px-American_football.svg.png'></IonImg>
        {loading ? <IonSpinner></IonSpinner> : 
         events.map((event: myEvent) => { 
          return (
            <IonCard key={event.homeTeamID}> {/** need to get unique key*/}
              <IonItem>
                <IonLabel>{event.visitorTeamName + ' vs ' + event.homeTeamName}</IonLabel>
                <IonSelect placeholder="Select Team" onIonChange={e=>props.onSelection(e.detail.value, event.id)}>
                <IonSelectOption key={event.visitorTeamID} value={event.visitorTeamID}>{event.visitorTeamName}</IonSelectOption>
                  <IonSelectOption key={event.homeTeamID} value={event.homeTeamID}>{event.homeTeamName}</IonSelectOption>
                </IonSelect>
              </IonItem>
            </IonCard>
          );
        })}
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