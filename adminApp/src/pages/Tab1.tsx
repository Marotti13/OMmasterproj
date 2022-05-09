import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useState } from 'react';
import Twitter from '../components/Twitter';
import TwitterAdmin from '../components/TwitterAdmin';
import './Tab1.css';

const Tab1: React.FC<{
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
          <IonTitle>Twitter</IonTitle>
          <IonButton color='warning' slot="end" onClick={toggle}>toggle</IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {/* <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader> */}
        {state == 'admin' ? <TwitterAdmin team={props.team}/>:<Twitter team={props.team}/>}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
