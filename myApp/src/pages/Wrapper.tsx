


//this is the wrapper for the app 

import { useState } from 'react';

import React from 'react';
import App from '../App';
import { IonButton, IonContent, IonPage } from '@ionic/react';
import TeamSelector from '../components/TeamSelector';

const Wrapper: React.FC = () => {

  const [ team, setTeam ] = useState<string>(''); //need to export team to other containers
  const [ event, setEvent ] = useState<string>(''); //need exact event possibly? will just be event id. containers will subscribe to data 


  const handleSelection = (selection:string) => {
    document.body.classList.toggle(selection);
    setTeam(selection);
  }

  return(
    <>{team != '' ? <App team={team}/>: <TeamSelector onSelection={handleSelection}></TeamSelector>}</>
  );
};

export default Wrapper;
