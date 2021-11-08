


//this is the wrapper for the app 

import { useEffect, useState } from 'react';

import React from 'react';
import App from '../App';
import { IonButton, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, useIonModal} from '@ionic/react';
import TeamSelector from '../components/TeamSelector';
import db from '../firebaseConfig';
import TwitterAdmin from '../components/TwitterAdmin';
import firebase from 'firebase';
import { dismiss } from '@ionic/core/dist/types/utils/overlays';

const NewEvent: React.FC<{
  onDismiss: () => void;
  submit: (obj:any,date:Date) => void;
}> = ({ onDismiss, submit }) => {
  const [ partys, setPartys ] = useState<any[]>([]);
  const [ partyCount, setCount ] = useState<number>(0);
  const [ selected, setSelected ] = useState<any[]>([]);
  const [ date, setDate ] = useState<Date>(new Date());

  const updateArray = (e:any) =>{
    if(e.detail.value! > -1){
      setCount(parseInt(e.detail.value!));
      while(e.detail.value! > selected.length){
        selected.push(null);
      }
      while(e.detail.value! < selected.length){
        selected.pop();
      }
    }
  }
  const addParty = (i:number,d:any) =>{
    try{
      selected[i] = d.ref.path;
    }catch{}
  }

  useEffect(() => {
    /**runs get events and pulls all events that are available  */
    var tempArray: firebase.firestore.DocumentData[]=[];
    db.collection('teams').get().then(snapshot =>{
        snapshot.docs.map(doc => {
          let temp = doc;
          tempArray.push(temp);
        });
        setPartys((partys: any) => [...partys, ...tempArray]);        

    });
  },[])
  return(
  <div>
    <IonItem>
      <IonLabel>Event Date</IonLabel>
      <IonInput type="date" placeholder="Enter Date" ></IonInput>
    </IonItem>
    <IonItem>
      <IonLabel>Party Count</IonLabel>
      <IonInput type="number" value={partyCount} placeholder="Enter Number" onIonChange={e => updateArray(e) }></IonInput>
    </IonItem>

    {Array.from(Array(partyCount), (e, i) => {
    return (
      <IonItem >
      <IonLabel>Select Party {i+1}</IonLabel>
      <IonSelect value = {selected[i]} onIonChange={e =>{addParty(i,e.detail.value)}}>
        {partys.map(p=>{return(
          <IonSelectOption value={p}>{p.data().teamName}</IonSelectOption>)
        })}
      </IonSelect>
    </IonItem>)
  })}
  <IonButton expand="block" onClick={() => {submit(selected,date); onDismiss()}}>
      Submit
    </IonButton>
    <IonButton expand="block" onClick={() => onDismiss()}>
      Close
    </IonButton>
    
  </div>);
  
};

const Wrapper: React.FC = () => {

  const hnadleSubmitNewEvent = (obj:any,date:Date) => {
    console.log(obj);
    submitTemp(obj,date);
  };

  const handleDismiss = () => {
    dismiss();
  };

  const [ team, setTeam ] = useState<string>(''); //need to export team to other containers
  const [ event, setEvent ] = useState<string>(''); //need exact event possibly? will just be event id. containers will subscribe to data 
  const [present, dismiss] = useIonModal(NewEvent, {
    onDismiss: handleDismiss,
    submit: hnadleSubmitNewEvent,
  });



  const handleSelection = (team:string, event:string) => {
    console.log("team "+team);
    document.body.classList.toggle(team); //css selector
    setTeam(team);
    setEvent(event);
    //need to set event and pass it from selection
  }

  /**
   * create new event method 
   * name of event 
   * event type
   * how many partys
   * name parties 
   * 
   * publish this to a temp place -> when ready to publish copy it to proper place(this will be somewere else)
   * load in app like normal with temp address
   *    method as prop that once team has been published goes back to team select 
   */

  const handleNewEvent = () =>{
    present();
  }

  const submitTemp = (d: Array<string>, date:Date) => {
    let object = {
      distance:"",
      down:"",
      eventDate:date,
      homeTeamPassingYards:"",
      homeTeamRef:d[0],
      homeTeamScore:"",
      qtr:"",
      time:"",
      visitorTeamPassingYards:"",
      visitorTeamRef: d[1],
      visitorTeamScore: ""
    };
    db.collection("temp").doc().set(object).then(() => {
      console.log("Document successfully written!");
    });
    //do something if error 
  }

  return(
    <>{team && event != '' ? <App event={event} team={team}/>: <TeamSelector handleNewEvent={handleNewEvent} onSelection={handleSelection}></TeamSelector>}</>
  );
};

export default Wrapper;
