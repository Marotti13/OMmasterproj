import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useState } from 'react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab2.css';

const Tab2: React.FC = () => {

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
          <IonTitle>Tab 2</IonTitle>
          <IonButton color='warning' slot="end" onClick={toggle}>toggle</IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {/* <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 2</IonTitle>
          </IonToolbar>
        </IonHeader> */}

        {/* {state == 'admin' ? <TwitterAdmin team={props.team}/>:<Twitter team={props.team}/>} */}

      </IonContent>
    </IonPage>
  );
};

export default Tab2;
