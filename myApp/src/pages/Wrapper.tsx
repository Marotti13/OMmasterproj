


//this is the wrapper for the app 

import { useState } from 'react';

import React from 'react';
import App from '../App';
import { IonButton, IonPage } from '@ionic/react';
import TeamSelector from '../components/TeamSelector';

const Wrapper: React.FC = () => {

  const [ team, setTeam ] = useState<string>('');

  const handleSelection = (selection:string) => {
    document.body.classList.toggle(selection);
    setTeam(selection);
  }

  return(
    <IonPage>
      {team != '' ? <App/>: <TeamSelector onSelection={handleSelection}></TeamSelector>}
    </IonPage>
    );
};

export default Wrapper;
