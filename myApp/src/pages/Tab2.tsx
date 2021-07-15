import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import CreateSurvey from '../components/CreateSurvey';
import ExploreContainer from '../components/ExploreContainer';
import './Tab2.css';

const Tab2: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Create a Survey</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 2</IonTitle>
          </IonToolbar>
        </IonHeader>
        <CreateSurvey></CreateSurvey>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
