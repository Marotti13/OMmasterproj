


//this is the wrapper for the app 

import { useState } from 'react';

import React from 'react';
import App from '../App';
import { IonButton, IonContent, IonPage } from '@ionic/react';
import TeamSelector from '../components/TeamSelector';

const Wrapper: React.FC = () => {

  const [ team, setTeam ] = useState<string>(''); //need to export team to other containers
  const [ event, setEvent ] = useState<string>(''); //need exact event possibly? will just be event id. containers will subscribe to data 


  const handleSelection = (team:string, event:string) => {
    console.log("team "+team);
    document.body.classList.toggle(team);
    setTeam(team);
    setEvent(event);
    //need to set event and pass it from selection
  }

  return(
    <>{team && event != '' ? <App event={event} team={team}/>: <TeamSelector onSelection={handleSelection}></TeamSelector>}</>
  );
};

export default Wrapper;
