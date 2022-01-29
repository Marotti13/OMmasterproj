import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect, useState } from 'react';
import GoogleMap from '../components/Map';
import MapAdmin from '../components/MapAdmin';
import './Tab3.css';

const Tab3: React.FC<{
  team:string;
}> = props => {

  const [ state, toggleState ] = useState<"admin" | 'user'>('admin'); //published vs unpublished
  

  const toggle = () =>{
    if(state=='admin'){
      toggleState("user");
    }else{
      toggleState('admin');
    }

  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 3</IonTitle>
          <IonButton color='warning' slot="end" onClick={toggle}>toggle</IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>

        {state == 'admin' ? <MapAdmin team={props.team}/>:<GoogleMap team={props.team}></GoogleMap>}

      </IonContent>
    </IonPage>
  );
};

export default Tab3;
