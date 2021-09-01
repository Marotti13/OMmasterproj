import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useEffect } from 'react';
import CreateSurvey from '../components/CreateSurvey';
import ExploreContainer from '../components/ExploreContainer';
import Twitter from '../components/Twitter';
import './Tab2.css';

const Tab2: React.FC = () => {

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Gameday Feed</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 2</IonTitle>
          </IonToolbar>
        </IonHeader>
        <Twitter></Twitter>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
